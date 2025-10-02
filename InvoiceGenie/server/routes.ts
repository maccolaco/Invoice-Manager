import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertInvoiceSchema, updateInvoiceSchema, insertLineItemSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to check authentication
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ email, password: hashedPassword });

      req.session!.userId = user.id;
      res.json({ id: user.id, email: user.email });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session!.userId = user.id;
      res.json({ id: user.id, email: user.email });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Invalid login data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session!.userId!);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: user.id, email: user.email });
  });

  // Invoice routes
  app.get("/api/invoices", requireAuth, async (req, res) => {
    try {
      const { type, status, search } = req.query;
      const invoices = await storage.getInvoices(req.session!.userId!, {
        type: type as string,
        status: status as string,
        search: search as string,
      });
      res.json(invoices);
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", requireAuth, async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id, req.session!.userId!);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Get invoice error:", error);
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", requireAuth, async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData, req.session!.userId!);
      res.json(invoice);
    } catch (error) {
      console.error("Create invoice error:", error);
      res.status(400).json({ error: "Invalid invoice data" });
    }
  });

  app.patch("/api/invoices/:id", requireAuth, async (req, res) => {
    try {
      const updates = updateInvoiceSchema.parse(req.body);
      const invoice = await storage.updateInvoice(req.params.id, req.session!.userId!, updates);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Update invoice error:", error);
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  app.delete("/api/invoices/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteInvoice(req.params.id, req.session!.userId!);
      if (!deleted) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete invoice error:", error);
      res.status(500).json({ error: "Failed to delete invoice" });
    }
  });

  // Line items routes
  app.get("/api/invoices/:id/line-items", requireAuth, async (req, res) => {
    try {
      // Verify user owns the invoice
      const invoice = await storage.getInvoice(req.params.id, req.session!.userId!);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      
      const lineItems = await storage.getLineItems(req.params.id);
      res.json(lineItems);
    } catch (error) {
      console.error("Get line items error:", error);
      res.status(500).json({ error: "Failed to fetch line items" });
    }
  });

  app.post("/api/invoices/:id/line-items", requireAuth, async (req, res) => {
    try {
      // Verify user owns the invoice
      const invoice = await storage.getInvoice(req.params.id, req.session!.userId!);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      const lineItemData = insertLineItemSchema.parse(req.body);
      const lineItem = await storage.createLineItem(lineItemData, req.params.id);
      res.json(lineItem);
    } catch (error) {
      console.error("Create line item error:", error);
      res.status(400).json({ error: "Invalid line item data" });
    }
  });

  // PDF upload route (placeholder - will implement full processing in next task)
  app.post("/api/invoices/upload", requireAuth, upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Placeholder response - will implement PDF processing in next task
      res.json({ 
        success: true, 
        message: "PDF upload received, processing will be implemented",
        filePath: req.file.path 
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Export to CSV
  app.get("/api/invoices/export/csv", requireAuth, async (req, res) => {
    try {
      const invoices = await storage.getInvoices(req.session!.userId!);
      
      // Simple CSV generation
      const headers = ["Invoice Number", "Type", "Vendor/Customer", "Issue Date", "Due Date", "Subtotal", "Tax", "Total", "Currency", "Status"];
      const rows = invoices.map(inv => [
        inv.invoiceNumber,
        inv.type,
        inv.vendorCustomer,
        inv.issueDate,
        inv.dueDate,
        inv.subtotal,
        inv.tax,
        inv.total,
        inv.currency,
        inv.status
      ]);

      const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=invoices.csv");
      res.send(csv);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

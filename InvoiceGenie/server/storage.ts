import { 
  type User, 
  type InsertUser, 
  type Invoice, 
  type InsertInvoice,
  type UpdateInvoice,
  type LineItem,
  type InsertLineItem,
  type Reminder,
  type InsertReminder,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Invoice operations
  getInvoices(userId: string, filters?: {
    type?: string;
    status?: string;
    search?: string;
  }): Promise<Invoice[]>;
  getInvoice(id: string, userId: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice, userId: string): Promise<Invoice>;
  updateInvoice(id: string, userId: string, updates: UpdateInvoice): Promise<Invoice | undefined>;
  deleteInvoice(id: string, userId: string): Promise<boolean>;
  
  // Line item operations
  getLineItems(invoiceId: string): Promise<LineItem[]>;
  createLineItem(lineItem: InsertLineItem, invoiceId: string): Promise<LineItem>;
  deleteLineItems(invoiceId: string): Promise<void>;
  
  // Reminder operations
  getReminders(invoiceId: string): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  getPendingReminders(): Promise<Reminder[]>;
  markReminderSent(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private invoices: Map<string, Invoice>;
  private lineItems: Map<string, LineItem>;
  private reminders: Map<string, Reminder>;

  constructor() {
    this.users = new Map();
    this.invoices = new Map();
    this.lineItems = new Map();
    this.reminders = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Invoice operations
  async getInvoices(userId: string, filters?: {
    type?: string;
    status?: string;
    search?: string;
  }): Promise<Invoice[]> {
    let invoices = Array.from(this.invoices.values()).filter(
      (invoice) => invoice.userId === userId
    );

    if (filters?.type && filters.type !== "all") {
      invoices = invoices.filter((inv) => inv.type === filters.type);
    }

    if (filters?.status && filters.status !== "all") {
      invoices = invoices.filter((inv) => inv.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      invoices = invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchLower) ||
          inv.vendorCustomer.toLowerCase().includes(searchLower)
      );
    }

    return invoices;
  }

  async getInvoice(id: string, userId: string): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (invoice && invoice.userId === userId) {
      return invoice;
    }
    return undefined;
  }

  async createInvoice(insertInvoice: InsertInvoice, userId: string): Promise<Invoice> {
    const id = randomUUID();
    const now = new Date();
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      userId,
      status: insertInvoice.status || "unpaid",
      currency: insertInvoice.currency || "USD",
      extractedJson: insertInvoice.extractedJson || null,
      filePath: insertInvoice.filePath || null,
      notes: insertInvoice.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: string, userId: string, updates: UpdateInvoice): Promise<Invoice | undefined> {
    const invoice = await this.getInvoice(id, userId);
    if (!invoice) return undefined;

    const updated: Invoice = {
      ...invoice,
      ...updates,
      updatedAt: new Date(),
    };
    this.invoices.set(id, updated);
    return updated;
  }

  async deleteInvoice(id: string, userId: string): Promise<boolean> {
    const invoice = await this.getInvoice(id, userId);
    if (!invoice) return false;
    
    // Delete associated line items and reminders
    await this.deleteLineItems(id);
    Array.from(this.reminders.values())
      .filter((r) => r.invoiceId === id)
      .forEach((r) => this.reminders.delete(r.id));
    
    return this.invoices.delete(id);
  }

  // Line item operations
  async getLineItems(invoiceId: string): Promise<LineItem[]> {
    return Array.from(this.lineItems.values()).filter(
      (item) => item.invoiceId === invoiceId
    );
  }

  async createLineItem(insertLineItem: InsertLineItem, invoiceId: string): Promise<LineItem> {
    const id = randomUUID();
    const lineItem: LineItem = {
      ...insertLineItem,
      id,
      invoiceId,
    };
    this.lineItems.set(id, lineItem);
    return lineItem;
  }

  async deleteLineItems(invoiceId: string): Promise<void> {
    const items = await this.getLineItems(invoiceId);
    items.forEach((item) => this.lineItems.delete(item.id));
  }

  // Reminder operations
  async getReminders(invoiceId: string): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).filter(
      (reminder) => reminder.invoiceId === invoiceId
    );
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = randomUUID();
    const reminder: Reminder = {
      ...insertReminder,
      id,
      sent: false,
    };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async getPendingReminders(): Promise<Reminder[]> {
    const now = new Date();
    return Array.from(this.reminders.values()).filter(
      (reminder) => !reminder.sent && reminder.remindAt <= now
    );
  }

  async markReminderSent(id: string): Promise<void> {
    const reminder = this.reminders.get(id);
    if (reminder) {
      this.reminders.set(id, { ...reminder, sent: true });
    }
  }
}

export const storage = new MemStorage();

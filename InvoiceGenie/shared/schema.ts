import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull(),
  type: text("type").notNull(), // "payable" or "receivable"
  vendorCustomer: text("vendor_customer").notNull(),
  issueDate: text("issue_date").notNull(),
  dueDate: text("due_date").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("unpaid"), // "draft", "unpaid", "paid", "overdue"
  extractedJson: jsonb("extracted_json"),
  filePath: text("file_path"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lineItems = pgTable("line_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  qty: integer("qty").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
});

export const reminders = pgTable("reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  remindAt: timestamp("remind_at").notNull(),
  sent: boolean("sent").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateInvoiceSchema = insertInvoiceSchema.partial();

export const insertLineItemSchema = createInsertSchema(lineItems).omit({
  id: true,
  invoiceId: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  sent: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type InsertLineItem = z.infer<typeof insertLineItemSchema>;
export type LineItem = typeof lineItems.$inferSelect;

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;

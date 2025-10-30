import { relations, sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Entries table
export const entries = pgTable("entries", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  item: text("item").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category"),
  note: text("note"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  transferId: text("transfer_id").references(() => transfers.id, { onDelete: "set null" }),
});

// Transfers table
export const transfers = pgTable("transfers", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(), // "manual" | "plaid_sandbox"
  status: text("status").notNull(), // "pending_manual" | "scheduled" | "completed" | "failed"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Preferences table
export const preferences = pgTable("preferences", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  bankProvider: text("bank_provider").notNull().default("manual"), // "manual" | "plaid_sandbox"
  fromAccountLabel: text("from_account_label"),
  toAccountLabel: text("to_account_label"),
  plaidItemId: text("plaid_item_id"),
  plaidFromId: text("plaid_from_id"),
  plaidToId: text("plaid_to_id"),
  monthlyGoal: decimal("monthly_goal", { precision: 10, scale: 2 }).notNull().default("0.00"),
  yearlyGoal: decimal("yearly_goal", { precision: 10, scale: 2 }).notNull().default("0.00"),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  entries: many(entries),
  transfers: many(transfers),
  preferences: one(preferences, {
    fields: [users.id],
    references: [preferences.userId],
  }),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  user: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
  transfer: one(transfers, {
    fields: [entries.transferId],
    references: [transfers.id],
  }),
}));

export const transfersRelations = relations(transfers, ({ one, many }) => ({
  user: one(users, {
    fields: [transfers.userId],
    references: [users.id],
  }),
  entries: many(entries),
}));

export const preferencesRelations = relations(preferences, ({ one }) => ({
  user: one(users, {
    fields: [preferences.userId],
    references: [users.id],
  }),
}));

// Insert schemas with Zod validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEntrySchema = createInsertSchema(entries).omit({
  id: true,
  createdAt: true,
  userId: true,
}).extend({
  amount: z.coerce.number().positive().finite(),
  item: z.string().min(1).max(120),
  category: z.string().max(50).optional(),
  note: z.string().max(500).optional(),
  date: z.coerce.date().optional(),
});

export const insertTransferSchema = createInsertSchema(transfers).omit({
  id: true,
  createdAt: true,
  userId: true,
  totalAmount: true,
  completedAt: true,
});

export const insertPreferenceSchema = createInsertSchema(preferences).omit({
  id: true,
  userId: true,
});

// Additional validation schemas
export const entryCreateSchema = z.object({
  item: z.string().min(1).max(120),
  amount: z.coerce.number().positive().finite(),
  category: z.string().max(50).optional(),
  note: z.string().max(500).optional(),
  date: z.coerce.date().optional(),
});

export const transferCreateSchema = z.object({
  entryIds: z.array(z.string()).min(1),
});

export const providerUpdateSchema = z.object({
  provider: z.enum(["manual", "plaid_sandbox"]),
  fromAccountLabel: z.string().optional(),
  toAccountLabel: z.string().optional(),
  plaidFromId: z.string().optional(),
  plaidToId: z.string().optional(),
});

export const preferencesUpdateSchema = z.object({
  monthlyGoal: z.coerce.number().nonnegative().optional(),
  yearlyGoal: z.coerce.number().nonnegative().optional(),
  bankProvider: z.enum(["manual", "plaid_sandbox"]).optional(),
  fromAccountLabel: z.string().optional(),
  toAccountLabel: z.string().optional(),
  plaidFromId: z.string().optional(),
  plaidToId: z.string().optional(),
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Entry = typeof entries.$inferSelect;
export type InsertEntry = z.infer<typeof insertEntrySchema>;

export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;

export type Preference = typeof preferences.$inferSelect;
export type InsertPreference = z.infer<typeof insertPreferenceSchema>;

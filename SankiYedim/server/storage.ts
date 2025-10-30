import { 
  users, entries, transfers, preferences,
  type User, type InsertUser,
  type Entry, type InsertEntry,
  type Transfer, type InsertTransfer,
  type Preference, type InsertPreference
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Entries
  getEntries(userId: string, filters?: {
    from?: Date;
    to?: Date;
    category?: string;
    search?: string;
  }): Promise<Entry[]>;
  getEntry(id: string, userId: string): Promise<Entry | undefined>;
  createEntry(entry: InsertEntry & { userId: string }): Promise<Entry>;
  updateEntry(id: string, userId: string, data: Partial<InsertEntry>): Promise<Entry | undefined>;
  deleteEntry(id: string, userId: string): Promise<boolean>;

  // Transfers
  getTransfers(userId: string): Promise<Transfer[]>;
  getTransfer(id: string, userId: string): Promise<Transfer | undefined>;
  createTransfer(transfer: InsertTransfer & { userId: string; totalAmount: string }): Promise<Transfer>;
  updateTransfer(id: string, userId: string, data: Partial<InsertTransfer>): Promise<Transfer | undefined>;
  completeTransfer(id: string, userId: string): Promise<Transfer | undefined>;

  // Preferences
  getPreferences(userId: string): Promise<Preference | undefined>;
  createOrUpdatePreferences(userId: string, prefs: Partial<InsertPreference>): Promise<Preference>;

  // Entry-Transfer linking
  linkEntriesToTransfer(entryIds: string[], transferId: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Entries
  async getEntries(userId: string, filters?: {
    from?: Date;
    to?: Date;
    category?: string;
    search?: string;
  }): Promise<Entry[]> {
    let query = db.select().from(entries).where(eq(entries.userId, userId));

    // Apply filters would go here - for simplicity, returning all
    const results = await query.orderBy(desc(entries.date));
    return results;
  }

  async getEntry(id: string, userId: string): Promise<Entry | undefined> {
    const [entry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, id), eq(entries.userId, userId)));
    return entry || undefined;
  }

  async createEntry(entry: InsertEntry & { userId: string }): Promise<Entry> {
    const [newEntry] = await db.insert(entries).values(entry).returning();
    return newEntry;
  }

  async updateEntry(id: string, userId: string, data: Partial<InsertEntry>): Promise<Entry | undefined> {
    const [updated] = await db
      .update(entries)
      .set(data)
      .where(and(eq(entries.id, id), eq(entries.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteEntry(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(entries)
      .where(and(eq(entries.id, id), eq(entries.userId, userId)));
    return true;
  }

  // Transfers
  async getTransfers(userId: string): Promise<Transfer[]> {
    return await db
      .select()
      .from(transfers)
      .where(eq(transfers.userId, userId))
      .orderBy(desc(transfers.createdAt));
  }

  async getTransfer(id: string, userId: string): Promise<Transfer | undefined> {
    const [transfer] = await db
      .select()
      .from(transfers)
      .where(and(eq(transfers.id, id), eq(transfers.userId, userId)));
    return transfer || undefined;
  }

  async createTransfer(transfer: InsertTransfer & { userId: string; totalAmount: string }): Promise<Transfer> {
    const [newTransfer] = await db.insert(transfers).values(transfer).returning();
    return newTransfer;
  }

  async updateTransfer(id: string, userId: string, data: Partial<InsertTransfer>): Promise<Transfer | undefined> {
    const [updated] = await db
      .update(transfers)
      .set(data)
      .where(and(eq(transfers.id, id), eq(transfers.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async completeTransfer(id: string, userId: string): Promise<Transfer | undefined> {
    const [updated] = await db
      .update(transfers)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(and(eq(transfers.id, id), eq(transfers.userId, userId)))
      .returning();
    return updated || undefined;
  }

  // Preferences
  async getPreferences(userId: string): Promise<Preference | undefined> {
    const [prefs] = await db
      .select()
      .from(preferences)
      .where(eq(preferences.userId, userId));
    return prefs || undefined;
  }

  async createOrUpdatePreferences(userId: string, prefs: Partial<InsertPreference>): Promise<Preference> {
    const existing = await this.getPreferences(userId);

    if (existing) {
      const [updated] = await db
        .update(preferences)
        .set(prefs)
        .where(eq(preferences.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(preferences)
        .values({ userId, ...prefs })
        .returning();
      return created;
    }
  }

  // Entry-Transfer linking
  async linkEntriesToTransfer(entryIds: string[], transferId: string, userId: string): Promise<void> {
    for (const entryId of entryIds) {
      await db
        .update(entries)
        .set({ transferId })
        .where(and(eq(entries.id, entryId), eq(entries.userId, userId)));
    }
  }
}

export const storage = new DatabaseStorage();

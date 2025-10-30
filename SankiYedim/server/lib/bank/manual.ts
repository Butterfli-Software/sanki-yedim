// Manual Transfer Provider - default provider for Canada-friendly manual transfers
import { IBankProvider } from "./index";
import { db } from "../../db";
import { transfers } from "@shared/schema";
import { format } from "date-fns";

export class ManualTransferProvider implements IBankProvider {
  getDisplayName(): string {
    return "Manual Transfer";
  }

  getCapabilities(): { simulateTransfers: boolean; manualChecklist: boolean } {
    return {
      simulateTransfers: false,
      manualChecklist: true,
    };
  }

  async listAccounts(userId: string): Promise<Array<{ id: string; name: string; balance?: number }>> {
    // Manual provider doesn't list accounts - user enters labels manually
    return [];
  }

  async createTransfer(args: {
    userId: string;
    entryIds: string[];
    totalAmount: number;
  }): Promise<{ transferId: string; status: "pending_manual" | "scheduled" }> {
    // Create transfer with pending_manual status
    const [transfer] = await db
      .insert(transfers)
      .values({
        userId: args.userId,
        totalAmount: args.totalAmount.toString(),
        method: "manual",
        status: "pending_manual",
      })
      .returning();

    return {
      transferId: transfer.id,
      status: "pending_manual",
    };
  }

  async markCompleted(transferId: string): Promise<void> {
    // Update transfer status to completed
    await db
      .update(transfers)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(transfers.id === transferId);
  }
}

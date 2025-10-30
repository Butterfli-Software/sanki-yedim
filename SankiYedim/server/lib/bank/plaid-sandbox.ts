// Plaid Sandbox Provider - demo-only simulated transfers
import { IBankProvider } from "./index";
import { db } from "../../db";
import { transfers } from "@shared/schema";

export class PlaidSandboxProvider implements IBankProvider {
  getDisplayName(): string {
    return "Plaid Sandbox (Demo)";
  }

  getCapabilities(): { simulateTransfers: boolean; manualChecklist: boolean } {
    return {
      simulateTransfers: true,
      manualChecklist: false,
    };
  }

  async listAccounts(userId: string): Promise<Array<{ id: string; name: string; balance?: number }>> {
    // Return mock accounts for demo
    return [
      { id: "acc_checking_1234", name: "Checking Account (****1234)", balance: 5420.50 },
      { id: "acc_savings_5678", name: "Savings Account (****5678)", balance: 12350.75 },
      { id: "acc_checking_9012", name: "Joint Checking (****9012)", balance: 8900.00 },
    ];
  }

  async createTransfer(args: {
    userId: string;
    entryIds: string[];
    totalAmount: number;
  }): Promise<{ transferId: string; status: "pending_manual" | "scheduled" }> {
    // Create transfer with scheduled status
    const [transfer] = await db
      .insert(transfers)
      .values({
        userId: args.userId,
        totalAmount: args.totalAmount.toString(),
        method: "plaid_sandbox",
        status: "scheduled",
      })
      .returning();

    // Simulate auto-completion after a short delay (in real app, this would be server-side)
    // For demo purposes, we'll just mark as scheduled and let the UI handle it
    setTimeout(async () => {
      try {
        await db
          .update(transfers)
          .set({
            status: "completed",
            completedAt: new Date(),
          })
          .where(transfers.id === transfer.id);
      } catch (error) {
        console.error("Failed to auto-complete sandbox transfer:", error);
      }
    }, 5000); // Auto-complete after 5 seconds

    return {
      transferId: transfer.id,
      status: "scheduled",
    };
  }
}

export const plaidSandboxProvider = new PlaidSandboxProvider();

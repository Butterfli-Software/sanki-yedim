// Banking abstraction layer interface and provider registry

export interface IBankProvider {
  getDisplayName(): string;
  getCapabilities(): { simulateTransfers: boolean; manualChecklist: boolean };
  listAccounts(userId: string): Promise<Array<{ id: string; name: string; balance?: number }>>;
  createTransfer(args: {
    userId: string;
    entryIds: string[];
    totalAmount: number;
  }): Promise<{ transferId: string; status: "pending_manual" | "scheduled" }>;
  markCompleted?(transferId: string): Promise<void>;
}

export interface BankAccount {
  id: string;
  name: string;
  balance?: number;
}

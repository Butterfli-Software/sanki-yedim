import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TransferChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfer: {
    id: string;
    totalAmount: string;
    entryCount: number;
    createdAt: string;
  };
  accountLabels: {
    from?: string;
    to?: string;
  };
  onMarkComplete: (transferId: string) => void;
  isCompletingTransfer: boolean;
}

export function TransferChecklistModal({
  open,
  onOpenChange,
  transfer,
  accountLabels,
  onMarkComplete,
  isCompletingTransfer,
}: TransferChecklistModalProps) {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
      duration: 2000,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const memoText = `Sanki Yedim – ${format(new Date(transfer.createdAt), 'yyyy-MM-dd')} – ${transfer.entryCount} item${transfer.entryCount !== 1 ? 's' : ''}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-transfer-checklist">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Transfer Checklist</DialogTitle>
          <DialogDescription>
            Follow these steps to complete your transfer manually
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount to Transfer</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border bg-muted/50 p-3">
                <p className="text-3xl font-bold tabular-nums" data-testid="text-transfer-amount">
                  ${parseFloat(transfer.totalAmount).toFixed(2)}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(parseFloat(transfer.totalAmount).toFixed(2), 'Amount')}
                data-testid="button-copy-amount"
              >
                {copiedField === 'Amount' ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Memo / Description</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border bg-muted/50 p-3">
                <p className="text-sm font-mono break-all" data-testid="text-transfer-memo">
                  {memoText}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(memoText, 'Memo')}
                data-testid="button-copy-memo"
              >
                {copiedField === 'Memo' ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* From Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From Account</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border bg-muted/50 p-3">
                <p className="text-sm" data-testid="text-transfer-from">
                  {accountLabels.from || "Your checking account"}
                </p>
              </div>
              {accountLabels.from && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(accountLabels.from!, 'From Account')}
                  data-testid="button-copy-from"
                >
                  {copiedField === 'From Account' ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* To Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To Account</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border bg-muted/50 p-3">
                <p className="text-sm" data-testid="text-transfer-to">
                  {accountLabels.to || "Your savings account"}
                </p>
              </div>
              {accountLabels.to && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(accountLabels.to!, 'To Account')}
                  data-testid="button-copy-to"
                >
                  {copiedField === 'To Account' ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 rounded-lg border bg-primary/5 p-4">
            <p className="font-medium text-sm">Next Steps:</p>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Open your banking app or website</li>
              <li>Navigate to transfers or payments</li>
              <li>Enter the amount shown above</li>
              <li>Set the memo/description for tracking</li>
              <li>Verify the accounts and submit</li>
              <li>Return here and mark as completed</li>
            </ol>
          </div>

          {/* Action */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-transfer"
            >
              Close
            </Button>
            <Button
              onClick={() => onMarkComplete(transfer.id)}
              disabled={isCompletingTransfer}
              className="flex-1"
              data-testid="button-mark-complete"
            >
              {isCompletingTransfer ? "Marking..." : "Mark as Completed"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

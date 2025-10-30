import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransferChecklistModal } from "@/components/TransferChecklistModal";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { Transfer, Entry, Preference } from "@shared/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Transfers() {
  const { toast } = useToast();
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [expandedTransfer, setExpandedTransfer] = useState<string | null>(null);

  // Fetch transfers
  const { data: transfers = [], isLoading } = useQuery<Transfer[]>({
    queryKey: ['/api/transfers'],
  });

  // Fetch entries to get details
  const { data: entries = [] } = useQuery<Entry[]>({
    queryKey: ['/api/entries'],
  });

  // Fetch preferences for account labels
  const { data: preferences } = useQuery<Preference>({
    queryKey: ['/api/preferences'],
  });

  // Complete transfer mutation
  const completeTransfer = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await fetch(`/api/transfers/${transferId}/complete`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to complete transfer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transfers'] });
      setChecklistOpen(false);
      setSelectedTransfer(null);
      toast({
        title: "Transfer completed!",
        description: "Your savings have been moved successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete transfer",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      pending_manual: { variant: "secondary", icon: Clock },
      scheduled: { variant: "default", icon: Clock },
      completed: { variant: "outline", icon: CheckCircle2 },
      failed: { variant: "destructive", icon: XCircle },
    };

    const config = variants[status] || variants.pending_manual;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getTransferEntries = (transferId: string) => {
    return entries.filter(entry => entry.transferId === transferId);
  };

  const handleOpenChecklist = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setChecklistOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Transfers</h1>
          <p className="text-muted-foreground">Manage your savings transfers</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : transfers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-2">No transfers yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first transfer from the Dashboard or Entries page
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transfers.map((transfer) => {
              const transferEntries = getTransferEntries(transfer.id);
              const isExpanded = expandedTransfer === transfer.id;

              return (
                <Card key={transfer.id} data-testid={`card-transfer-${transfer.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">
                            ${parseFloat(transfer.totalAmount).toFixed(2)}
                          </CardTitle>
                          {getStatusBadge(transfer.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p data-testid={`text-transfer-entries-${transfer.id}`}>
                            {transferEntries.length} {transferEntries.length === 1 ? 'entry' : 'entries'}
                          </p>
                          <p>Created {format(new Date(transfer.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                          {transfer.completedAt && (
                            <p>Completed {format(new Date(transfer.completedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {transfer.status === "pending_manual" && (
                          <Button
                            onClick={() => handleOpenChecklist(transfer)}
                            data-testid={`button-view-checklist-${transfer.id}`}
                          >
                            View Checklist
                          </Button>
                        )}
                        {transfer.status === "scheduled" && (
                          <Badge variant="default">Processing...</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {transferEntries.length > 0 && (
                    <CardContent className="pt-0">
                      <Collapsible open={isExpanded} onOpenChange={(open) => setExpandedTransfer(open ? transfer.id : null)}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between"
                            data-testid={`button-toggle-entries-${transfer.id}`}
                          >
                            <span className="text-sm">
                              {isExpanded ? 'Hide' : 'Show'} included entries
                            </span>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                          <div className="space-y-2 rounded-lg border p-4 bg-muted/30">
                            {transferEntries.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between py-2 border-b last:border-0"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{entry.item}</p>
                                  {entry.category && (
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                      {entry.category}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm font-semibold tabular-nums">
                                  ${parseFloat(entry.amount).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Transfer Checklist Modal */}
        {selectedTransfer && (
          <TransferChecklistModal
            open={checklistOpen}
            onOpenChange={setChecklistOpen}
            transfer={{
              id: selectedTransfer.id,
              totalAmount: selectedTransfer.totalAmount,
              entryCount: getTransferEntries(selectedTransfer.id).length,
              createdAt: selectedTransfer.createdAt,
            }}
            accountLabels={{
              from: preferences?.fromAccountLabel,
              to: preferences?.toAccountLabel,
            }}
            onMarkComplete={completeTransfer.mutate}
            isCompletingTransfer={completeTransfer.isPending}
          />
        )}
      </div>
    </div>
  );
}

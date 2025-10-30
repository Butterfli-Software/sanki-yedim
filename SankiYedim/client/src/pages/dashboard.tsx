import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { EntryForm } from "@/components/EntryForm";
import { KpiCard } from "@/components/KpiCard";
import { Sparkline } from "@/components/Sparkline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Flame, Target } from "lucide-react";
import type { Entry } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { toast } = useToast();
  const [showTransferPrompt, setShowTransferPrompt] = useState(false);
  const [lastEntryId, setLastEntryId] = useState<string | null>(null);
  const [lastAmount, setLastAmount] = useState<number>(0);

  // Fetch entries for calculations
  const { data: entries = [] } = useQuery<Entry[]>({
    queryKey: ['/api/entries'],
  });

  // Fetch preferences for goals
  const { data: preferences } = useQuery({
    queryKey: ['/api/preferences'],
  });

  // Create entry mutation
  const createEntry = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to create entry');
      return response.json();
    },
    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
      setLastEntryId(newEntry.id);
      setLastAmount(parseFloat(newEntry.amount));
      setShowTransferPrompt(true);
      toast({
        title: "Entry saved!",
        description: `Saved $${parseFloat(newEntry.amount).toFixed(2)}`,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save entry",
      });
    },
  });

  // Create transfer mutation
  const createTransfer = useMutation({
    mutationFn: async (entryIds: string[]) => {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryIds }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to create transfer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
      setShowTransferPrompt(false);
      toast({
        title: "Transfer created!",
        description: "Check the Transfers page to complete it",
      });
    },
  });

  // Calculate KPIs
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalSaved = entries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
  
  const savedThisMonth = entries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    })
    .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

  // Calculate streak (consecutive days with entries)
  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    
    const sortedDates = entries
      .map(e => new Date(e.date).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (const dateStr of sortedDates) {
      const entryDate = new Date(dateStr);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        checkDate = entryDate;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // Calculate sparkline data (last 30 days)
  const getLast30DaysData = () => {
    const data: number[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTotal = entries
        .filter(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.toDateString() === date.toDateString();
        })
        .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
      
      data.push(dayTotal);
    }
    
    return data;
  };

  const sparklineData = getLast30DaysData();

  // Calculate goal progress
  const monthlyGoal = preferences?.monthlyGoal ? parseFloat(preferences.monthlyGoal) : 0;
  const yearlyGoal = preferences?.yearlyGoal ? parseFloat(preferences.yearlyGoal) : 0;
  
  const savedThisYear = entries
    .filter(entry => new Date(entry.date).getFullYear() === currentYear)
    .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

  const monthlyProgress = monthlyGoal > 0 ? (savedThisMonth / monthlyGoal) * 100 : 0;
  const yearlyProgress = yearlyGoal > 0 ? (savedThisYear / yearlyGoal) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Little choices. Big results.</h1>
          <p className="text-muted-foreground">Track your savings journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Add Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <EntryForm
                  onSubmit={(values) => createEntry.mutate(values)}
                  isLoading={createEntry.isPending}
                />
              </CardContent>
            </Card>

            {/* Transfer Prompt */}
            {showTransferPrompt && lastEntryId && (
              <Card className="mt-4 border-primary">
                <CardContent className="pt-6">
                  <p className="font-medium mb-2">Saved ${lastAmount.toFixed(2)} — Move funds now?</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a transfer to save this amount
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => createTransfer.mutate([lastEntryId])}
                      disabled={createTransfer.isPending}
                      data-testid="button-create-transfer-prompt"
                    >
                      Yes, Create Transfer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTransferPrompt(false)}
                      data-testid="button-dismiss-transfer-prompt"
                    >
                      Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - KPIs and Sparkline */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <KpiCard
                title="Total Saved"
                value={`$${totalSaved.toFixed(2)}`}
                icon={DollarSign}
                description="All time"
              />
              <KpiCard
                title="Saved This Month"
                value={`$${savedThisMonth.toFixed(2)}`}
                icon={TrendingUp}
                description={`${now.toLocaleString('default', { month: 'long' })}`}
              />
              <KpiCard
                title="Current Streak"
                value={`${streak} ${streak === 1 ? 'day' : 'days'}`}
                icon={Flame}
                description={streak > 0 ? "Keep it going!" : "Start today!"}
              />
              <KpiCard
                title="Monthly Goal"
                value={monthlyGoal > 0 ? `$${savedThisMonth.toFixed(2)}` : "Not set"}
                icon={Target}
                description={monthlyGoal > 0 ? `of $${monthlyGoal.toFixed(2)}` : "Set in Settings"}
                progress={monthlyGoal > 0 ? Math.min(monthlyProgress, 100) : undefined}
              />
            </div>

            {/* Yearly Goal Card */}
            {yearlyGoal > 0 && (
              <KpiCard
                title="Yearly Goal"
                value={`$${savedThisYear.toFixed(2)}`}
                icon={Target}
                description={`of $${yearlyGoal.toFixed(2)}`}
                progress={Math.min(yearlyProgress, 100)}
              />
            )}

            {/* Sparkline */}
            <Card>
              <CardHeader>
                <CardTitle>Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <Sparkline data={sparklineData} width={600} height={120} className="w-full" />
              </CardContent>
            </Card>

            {/* Empty State */}
            {entries.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-2">
                    Log your first "as-if purchase"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Start building your savings journey today
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

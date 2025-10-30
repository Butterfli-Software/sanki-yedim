import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProviderSelector } from "@/components/ProviderSelector";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { User, Target, Building2, Trash2 } from "lucide-react";
import type { Preference } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock user data (in real app, this would come from auth)
  const user = {
    name: "Demo User",
    email: "demo@sankiyedim.app",
    image: null,
  };

  // Fetch preferences
  const { data: preferences, isLoading } = useQuery<Preference>({
    queryKey: ['/api/preferences'],
  });

  // Update goals mutation
  const updateGoals = useMutation({
    mutationFn: async (data: { monthlyGoal?: number; yearlyGoal?: number }) => {
      const response = await fetch('/api/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update goals');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
      toast({
        title: "Goals updated",
        description: "Your savings goals have been saved",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update goals",
      });
    },
  });

  // Update provider mutation
  const updateProvider = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/settings/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update provider');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
      toast({
        title: "Provider updated",
        description: "Your bank provider settings have been saved",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update provider",
      });
    },
  });

  const handleGoalsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const monthlyGoal = parseFloat(formData.get('monthlyGoal') as string) || 0;
    const yearlyGoal = parseFloat(formData.get('yearlyGoal') as string) || 0;
    updateGoals.mutate({ monthlyGoal, yearlyGoal });
  };

  const handleDeleteAccount = () => {
    // In real app, this would call an API to delete the account
    toast({
      title: "Account deletion",
      description: "This feature is not implemented in the demo",
    });
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Profile</CardTitle>
              </div>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  readOnly
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  data-testid="input-email"
                />
                <p className="text-sm text-muted-foreground">
                  Email is read-only for OAuth accounts
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Goals Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Savings Goals</CardTitle>
              </div>
              <CardDescription>Set your monthly and yearly savings targets</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGoalsSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyGoal">Monthly Goal</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="monthlyGoal"
                        name="monthlyGoal"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        defaultValue={preferences?.monthlyGoal ? parseFloat(preferences.monthlyGoal) : undefined}
                        className="pl-7"
                        data-testid="input-monthly-goal"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearlyGoal">Yearly Goal</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="yearlyGoal"
                        name="yearlyGoal"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        defaultValue={preferences?.yearlyGoal ? parseFloat(preferences.yearlyGoal) : undefined}
                        className="pl-7"
                        data-testid="input-yearly-goal"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={updateGoals.isPending}
                  data-testid="button-save-goals"
                >
                  {updateGoals.isPending ? "Saving..." : "Save Goals"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Bank Provider Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Bank Provider</CardTitle>
              </div>
              <CardDescription>Choose how you want to handle transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <ProviderSelector
                onSubmit={(values) => updateProvider.mutate(values)}
                isLoading={updateProvider.isPending}
                defaultValues={{
                  provider: preferences?.bankProvider as "manual" | "plaid_sandbox",
                  fromAccountLabel: preferences?.fromAccountLabel || undefined,
                  toAccountLabel: preferences?.toAccountLabel || undefined,
                  plaidFromId: preferences?.plaidFromId || undefined,
                  plaidToId: preferences?.plaidToId || undefined,
                }}
              />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </div>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  data-testid="button-delete-account"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete-account">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete-account"
              >
                Yes, delete my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

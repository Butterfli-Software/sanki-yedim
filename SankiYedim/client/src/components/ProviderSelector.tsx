import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { providerUpdateSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

interface ProviderSelectorProps {
  onSubmit: (values: z.infer<typeof providerUpdateSchema>) => void;
  isLoading?: boolean;
  defaultValues?: Partial<z.infer<typeof providerUpdateSchema>>;
}

export function ProviderSelector({ onSubmit, isLoading, defaultValues }: ProviderSelectorProps) {
  const form = useForm<z.infer<typeof providerUpdateSchema>>({
    resolver: zodResolver(providerUpdateSchema),
    defaultValues: {
      provider: defaultValues?.provider || "manual",
      fromAccountLabel: defaultValues?.fromAccountLabel || "",
      toAccountLabel: defaultValues?.toAccountLabel || "",
      plaidFromId: defaultValues?.plaidFromId || "",
      plaidToId: defaultValues?.plaidToId || "",
    },
  });

  const selectedProvider = form.watch("provider");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Bank Provider</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover-elevate">
                    <FormControl>
                      <RadioGroupItem value="manual" data-testid="radio-manual" />
                    </FormControl>
                    <div className="flex-1 space-y-1">
                      <FormLabel className="font-medium cursor-pointer">
                        Manual Transfer
                        <Badge variant="secondary" className="ml-2">Default</Badge>
                      </FormLabel>
                      <FormDescription>
                        You'll receive a checklist to manually transfer funds in your banking app
                      </FormDescription>
                    </div>
                  </FormItem>
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover-elevate">
                    <FormControl>
                      <RadioGroupItem value="plaid_sandbox" data-testid="radio-plaid" />
                    </FormControl>
                    <div className="flex-1 space-y-1">
                      <FormLabel className="font-medium cursor-pointer">
                        Plaid Sandbox
                        <Badge variant="outline" className="ml-2">Demo Only</Badge>
                      </FormLabel>
                      <FormDescription>
                        Simulated transfers for testing purposes (no real money)
                      </FormDescription>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedProvider === "manual" && (
          <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
            <p className="text-sm font-medium">Account Labels</p>
            <FormField
              control={form.control}
              name="fromAccountLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Account (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Checking (****1234)"
                      {...field}
                      data-testid="input-from-account"
                    />
                  </FormControl>
                  <FormDescription>
                    This label will appear in your transfer checklist
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toAccountLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Account (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Savings (****5678)"
                      {...field}
                      data-testid="input-to-account"
                    />
                  </FormControl>
                  <FormDescription>
                    This label will appear in your transfer checklist
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {selectedProvider === "plaid_sandbox" && (
          <div className="space-y-4 rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-950/20">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">Demo</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">Sandbox Mode</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This is a demonstration mode only. No real bank connections or transfers will be made.
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-save-provider"
        >
          {isLoading ? "Saving..." : "Save Provider Settings"}
        </Button>
      </form>
    </Form>
  );
}

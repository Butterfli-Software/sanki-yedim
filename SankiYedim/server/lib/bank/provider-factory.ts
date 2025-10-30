// Provider factory to get the correct bank provider based on settings
import { IBankProvider } from "./index";
import { ManualTransferProvider } from "./manual";
import { PlaidSandboxProvider } from "./plaid-sandbox";
import { db } from "../../db";
import { preferences } from "@shared/schema";
import { eq } from "drizzle-orm";

const manualProvider = new ManualTransferProvider();
const plaidProvider = new PlaidSandboxProvider();

export async function getProviderForUser(userId: string): Promise<IBankProvider> {
  // Get user preferences
  const [userPrefs] = await db
    .select()
    .from(preferences)
    .where(eq(preferences.userId, userId))
    .limit(1);

  if (userPrefs?.bankProvider === "plaid_sandbox") {
    return plaidProvider;
  }

  // Default to manual provider
  return manualProvider;
}

export function getProviderByName(providerName: string): IBankProvider {
  if (providerName === "plaid_sandbox") {
    return plaidProvider;
  }
  return manualProvider;
}

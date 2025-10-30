import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAuth, type AuthRequest } from "./middleware/auth";
import { rateLimit } from "./middleware/rate-limit";
import { 
  entryCreateSchema,
  transferCreateSchema,
  providerUpdateSchema,
  preferencesUpdateSchema
} from "@shared/schema";
import { getProviderForUser, getProviderByName } from "./lib/bank/provider-factory";

// Rate limiting for POST/PATCH/DELETE routes (60 requests per minute)
const writeRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

// Helper to validate request body with Zod
function validateBody<T>(schema: any) {
  return (req: Request, res: Response, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: error.errors,
        },
      });
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Entries routes
  app.get("/api/entries", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const entries = await storage.getEntries(req.userId!);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Failed to fetch entries" },
      });
    }
  });

  app.post(
    "/api/entries",
    writeRateLimit,
    requireAuth,
    validateBody(entryCreateSchema),
    async (req: AuthRequest, res: Response) => {
      try {
        const entry = await storage.createEntry({
          ...req.body,
          userId: req.userId!,
          amount: req.body.amount.toString(),
        });
        res.status(201).json(entry);
      } catch (error) {
        console.error("Error creating entry:", error);
        res.status(500).json({
          error: { code: "SERVER_ERROR", message: "Failed to create entry" },
        });
      }
    }
  );

  app.patch(
    "/api/entries/:id",
    writeRateLimit,
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const updated = await storage.updateEntry(
          req.params.id,
          req.userId!,
          req.body
        );
        if (!updated) {
          return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Entry not found" },
          });
        }
        res.json(updated);
      } catch (error) {
        console.error("Error updating entry:", error);
        res.status(500).json({
          error: { code: "SERVER_ERROR", message: "Failed to update entry" },
        });
      }
    }
  );

  app.delete("/api/entries/:id", writeRateLimit, requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      await storage.deleteEntry(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting entry:", error);
      res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Failed to delete entry" },
      });
    }
  });

  // Transfers routes
  app.get("/api/transfers", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const transfers = await storage.getTransfers(req.userId!);
      res.json(transfers);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Failed to fetch transfers" },
      });
    }
  });

  app.post(
    "/api/transfers",
    writeRateLimit,
    requireAuth,
    validateBody(transferCreateSchema),
    async (req: AuthRequest, res: Response) => {
      try {
        const { entryIds } = req.body;

        // Get entries to calculate total
        const entries = await storage.getEntries(req.userId!);
        const selectedEntries = entries.filter((e) => entryIds.includes(e.id));

        if (selectedEntries.length === 0) {
          return res.status(400).json({
            error: { code: "INVALID_REQUEST", message: "No valid entries selected" },
          });
        }

        const totalAmount = selectedEntries.reduce(
          (sum, e) => sum + parseFloat(e.amount),
          0
        );

        // Get user's bank provider
        const provider = await getProviderForUser(req.userId!);

        // Create transfer using provider
        const { transferId, status } = await provider.createTransfer({
          userId: req.userId!,
          entryIds,
          totalAmount,
        });

        // Link entries to transfer
        await storage.linkEntriesToTransfer(entryIds, transferId, req.userId!);

        const transfer = await storage.getTransfer(transferId, req.userId!);
        res.status(201).json(transfer);
      } catch (error) {
        console.error("Error creating transfer:", error);
        res.status(500).json({
          error: { code: "SERVER_ERROR", message: "Failed to create transfer" },
        });
      }
    }
  );

  app.post(
    "/api/transfers/:id/complete",
    writeRateLimit,
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const transfer = await storage.getTransfer(req.params.id, req.userId!);
        
        if (!transfer) {
          return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Transfer not found" },
          });
        }

        const provider = await getProviderForUser(req.userId!);
        
        if (provider.markCompleted) {
          await provider.markCompleted(req.params.id);
        }

        const updated = await storage.completeTransfer(req.params.id, req.userId!);
        res.json(updated);
      } catch (error) {
        console.error("Error completing transfer:", error);
        res.status(500).json({
          error: { code: "SERVER_ERROR", message: "Failed to complete transfer" },
        });
      }
    }
  );

  // Preferences routes
  app.get("/api/preferences", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      let prefs = await storage.getPreferences(req.userId!);
      
      // Create default preferences if they don't exist
      if (!prefs) {
        prefs = await storage.createOrUpdatePreferences(req.userId!, {
          bankProvider: "manual",
          monthlyGoal: "0.00",
          yearlyGoal: "0.00",
        });
      }
      
      res.json(prefs);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Failed to fetch preferences" },
      });
    }
  });

  app.patch(
    "/api/preferences",
    writeRateLimit,
    requireAuth,
    validateBody(preferencesUpdateSchema),
    async (req: AuthRequest, res: Response) => {
      try {
        const updated = await storage.createOrUpdatePreferences(req.userId!, req.body);
        res.json(updated);
      } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({
          error: { code: "SERVER_ERROR", message: "Failed to update preferences" },
        });
      }
    }
  );

  // Provider settings route
  app.post(
    "/api/settings/provider",
    writeRateLimit,
    requireAuth,
    validateBody(providerUpdateSchema),
    async (req: AuthRequest, res: Response) => {
      try {
        const updated = await storage.createOrUpdatePreferences(req.userId!, req.body);
        res.json(updated);
      } catch (error) {
        console.error("Error updating provider:", error);
        res.status(500).json({
          error: { code: "SERVER_ERROR", message: "Failed to update provider" },
        });
      }
    }
  );

  // Bank integration routes (Plaid sandbox demo)
  app.post("/api/bank/link", writeRateLimit, requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      // Mock Plaid link token for demo
      res.json({
        link_token: "link-sandbox-mock-token",
        expiration: new Date(Date.now() + 3600000).toISOString(),
      });
    } catch (error) {
      console.error("Error creating link token:", error);
      res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Failed to create link token" },
      });
    }
  });

  app.get("/api/bank/accounts", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const provider = await getProviderForUser(req.userId!);
      const accounts = await provider.listAccounts(req.userId!);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Failed to fetch bank accounts" },
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

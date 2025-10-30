// Simple mock authentication middleware for demo purposes
// In production, this would use NextAuth or similar
import type { Request, Response, NextFunction } from "express";

// Mock demo user ID
export const DEMO_USER_ID = "demo-user-123";
export const DEMO_USER_EMAIL = "demo@sankiyedim.app";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // For demo purposes, always use the same demo user
  req.userId = DEMO_USER_ID;
  next();
}

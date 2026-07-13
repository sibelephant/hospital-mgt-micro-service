import type { Request } from "express";

export type AuthenticatedUser = {
  userId: string;
  hospitalId: string;
  email: string;
  role: string;
};

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

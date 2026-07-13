import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export type UserRole = "owner" | "admin" | "doctor" | "nurse" | "billing" | "reception" | "lab";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

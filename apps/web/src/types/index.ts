import type { LucideIcon } from "lucide-react";

export type ModuleTone = "blue" | "cyan" | "indigo" | "sky" | "teal" | "navy";
export type StatusTone = "blue" | "green" | "amber" | "red" | "slate";
export type DataStateName = "loaded" | "loading" | "empty" | "error";

export type AuthSession = {
  token: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: {
    userId: string;
    hospitalId: string;
    email: string;
    role: string;
  };
  hospital: {
    id: string;
    name: string;
  };
};

export type HospitalModule = {
  slug: string;
  name: string;
  shortName: string;
  metric: string;
  detail: string;
  summary: string;
  icon: LucideIcon;
  tone: ModuleTone;
  endpoint: string;
  action: string;
};

export type TableConfig = {
  title: string;
  eyebrow: string;
  columns: string[];
  rows: string[][];
  statusColumn: number;
  rowAction: string;
};

export type FieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
};

export type ApiListResponse<T> = {
  data: T[];
  meta?: { count: number; limit: number; offset: number };
};

import type { HubStatus } from "./types";

// Visual treatment per hub status (badge label + dot colors).
export const statusStyles: Record<
  HubStatus,
  { label: string; dot: string; dotText: string }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    dotText: "text-emerald-600",
  },
  closed: { label: "Closed", dot: "bg-gray-400", dotText: "text-gray-500" },
  draft: { label: "Draft", dot: "bg-amber-500", dotText: "text-amber-600" },
};

// Page size for the hubs grid.
export const LIMIT = 9;

// Status options shown in the toolbar filter and the form's status toggle.
export const statuses = ["all", "active", "closed", "draft"];

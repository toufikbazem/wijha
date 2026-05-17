import { z } from "zod";

export const APPLIED_IN_VALUES = ["hour", "day", "week", "month"] as const;
export type AppliedIn = (typeof APPLIED_IN_VALUES)[number] | "";

export const applicationsFilterSchema = z.object({
  globalSearch: z.string(),
  applied_in: z.string(),
  sortBy: z.enum(["latest", "oldest"]),
});

export type ApplicationsFilters = z.infer<typeof applicationsFilterSchema>;

export const FILTER_KEYS: (keyof ApplicationsFilters)[] = [
  "globalSearch",
  "applied_in",
  "sortBy",
];

export const DEFAULT_FILTERS: ApplicationsFilters = {
  globalSearch: "",
  applied_in: "",
  sortBy: "latest",
};

export const filtersFromParams = (
  params: URLSearchParams,
): ApplicationsFilters => {
  const out = { ...DEFAULT_FILTERS };
  for (const key of FILTER_KEYS) {
    const value = params.get(key);
    if (value !== null) {
      if (key === "sortBy") {
        out.sortBy = value === "oldest" ? "oldest" : "latest";
      } else {
        out[key] = value;
      }
    }
  }
  return out;
};

// Maps backend param name -> URL/form param name.
// Backend already names `applied_in` the same; just pass-through.
export const APPLIED_IN_OPTIONS: { value: (typeof APPLIED_IN_VALUES)[number]; label: string }[] = [
  { value: "hour", label: "Last hour" },
  { value: "day", label: "Last 24 hours" },
  { value: "week", label: "Last 1 week" },
  { value: "month", label: "Last month" },
];

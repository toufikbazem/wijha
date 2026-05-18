import { z } from "zod";

export const ACCESSED_IN_VALUES = ["hour", "day", "week", "month"] as const;
export type AccessedIn = (typeof ACCESSED_IN_VALUES)[number] | "";

export const profileAccessFilterSchema = z.object({
  globalSearch: z.string(),
  accessed_in: z.string(),
  sortBy: z.enum(["latest", "oldest"]),
});

export type ProfileAccessFilters = z.infer<typeof profileAccessFilterSchema>;

export const FILTER_KEYS: (keyof ProfileAccessFilters)[] = [
  "globalSearch",
  "accessed_in",
  "sortBy",
];

export const DEFAULT_FILTERS: ProfileAccessFilters = {
  globalSearch: "",
  accessed_in: "",
  sortBy: "latest",
};

export const filtersFromParams = (
  params: URLSearchParams,
): ProfileAccessFilters => {
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

export const ACCESSED_IN_OPTIONS: {
  value: (typeof ACCESSED_IN_VALUES)[number];
  label: string;
}[] = [
  { value: "hour", label: "Last hour" },
  { value: "day", label: "Last 24 hours" },
  { value: "week", label: "Last 1 week" },
  { value: "month", label: "Last month" },
];

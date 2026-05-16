import { z } from "zod";

export const employersFilterSchema = z.object({
  globalSearch: z.string(),
  address: z.string(),
  industry: z.string(),
  is_email_verified: z.string(),
  status: z.string(),
  joined_from: z.string(),
  joined_to: z.string(),
  sortBy: z.enum(["latest", "oldest"]),
});

export type EmployersFilters = z.infer<typeof employersFilterSchema>;

export const FILTER_KEYS: (keyof EmployersFilters)[] = [
  "globalSearch",
  "address",
  "industry",
  "is_email_verified",
  "status",
  "joined_from",
  "joined_to",
  "sortBy",
];

export const DEFAULT_FILTERS: EmployersFilters = {
  globalSearch: "",
  address: "",
  industry: "",
  is_email_verified: "",
  status: "",
  joined_from: "",
  joined_to: "",
  sortBy: "latest",
};

export const filtersFromParams = (params: URLSearchParams): EmployersFilters => {
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

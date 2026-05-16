import { z } from "zod";

export const jobSeekersFilterSchema = z.object({
  globalSearch: z.string(),
  personalSearch: z.string(),
  address: z.string(),
  experience_level: z.string(),
  education_level: z.string(),
  gender: z.string(),
  has_cv: z.string(),
  is_email_verified: z.string(),
  status: z.string(),
  registered_type: z.string(),
  joined_from: z.string(),
  joined_to: z.string(),
  sortBy: z.enum(["latest", "oldest"]),
});

export type JobSeekersFilters = z.infer<typeof jobSeekersFilterSchema>;

export const FILTER_KEYS: (keyof JobSeekersFilters)[] = [
  "globalSearch",
  "personalSearch",
  "address",
  "experience_level",
  "education_level",
  "gender",
  "has_cv",
  "is_email_verified",
  "status",
  "registered_type",
  "joined_from",
  "joined_to",
  "sortBy",
];

export const DEFAULT_FILTERS: JobSeekersFilters = {
  globalSearch: "",
  personalSearch: "",
  address: "",
  experience_level: "",
  education_level: "",
  gender: "",
  has_cv: "",
  is_email_verified: "",
  status: "",
  registered_type: "",
  joined_from: "",
  joined_to: "",
  sortBy: "latest",
};

export const filtersFromParams = (
  params: URLSearchParams,
): JobSeekersFilters => {
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

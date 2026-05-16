import { z } from "zod";

export const jobPostsFilterSchema = z.object({
  globalSearch: z.string(),
  address: z.string(),
  industry: z.string(),
  experience_level: z.string(),
  education_level: z.string(),
  job_type: z.string(),
  job_mode: z.string(),
  status: z.string(),
  is_anonymous: z.string(),
  created_from: z.string(),
  created_to: z.string(),
  sortBy: z.enum(["latest", "oldest"]),
});

export type JobPostsFilters = z.infer<typeof jobPostsFilterSchema>;

export const FILTER_KEYS: (keyof JobPostsFilters)[] = [
  "globalSearch",
  "address",
  "industry",
  "experience_level",
  "education_level",
  "job_type",
  "job_mode",
  "status",
  "is_anonymous",
  "created_from",
  "created_to",
  "sortBy",
];

export const DEFAULT_FILTERS: JobPostsFilters = {
  globalSearch: "",
  address: "",
  industry: "",
  experience_level: "",
  education_level: "",
  job_type: "",
  job_mode: "",
  status: "",
  is_anonymous: "",
  created_from: "",
  created_to: "",
  sortBy: "latest",
};

export const filtersFromParams = (
  params: URLSearchParams,
): JobPostsFilters => {
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

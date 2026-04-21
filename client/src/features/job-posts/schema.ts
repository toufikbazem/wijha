import z from "zod";

export const jobPostsFilterSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
  job_type: z.string().optional(),
  job_mode: z.string().optional(),
  experience_level: z.string().optional(),
  education_level: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
});

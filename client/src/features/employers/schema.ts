import { array, string, z } from "zod";

export const companyProfileSchema = z.object({
  company_name: string().min(2, "Company name must be at least 2 characters"),
  industry: string().min(2, "Industry is required"),
  size: string(),
  phone_number: string().optional(),
  address: string().optional(),
  logo: string().optional(),
  cover_image: string().optional(),
  description: string().optional(),
  missions: array(string()).optional(),
  founding_year: string().optional(),
  website: string().optional(),
  linkedin: string().optional(),
});

export const jobPostSchema = z.object({
  title: z.string().min(1, "Job title is required."),
  description: z.string().min(1, "Job description is required."),
  location: z.string().min(1, "Location is required."),
  company_name: z.string().min(1, "Company name is required."),
  industry: z.string().min(1, "Industry is required."),
  job_type: z.string().min(1, "Job type is required."),
  job_mode: z.string().min(1, "Work arrangement is required."),
  experience_level: z.string().min(1, "Experience level is required."),
  education_level: z.string().min(1, "Education level is required."),
  number_of_positions: z.string().min(1, "Number of positions is required"),
  min_salary: z.string().optional(),
  max_salary: z.string().optional(),
  deadline: z
    .date()
    .min(new Date(), "Deadline must be in the future.")
    .refine(
      (date) => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return date <= maxDate;
      },
      { message: "Deadline cannot be more than 3 months from now." },
    ),
  is_anonymous: z.boolean().optional(),
});

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

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required.")
      .min(8, "Password must be at least 8 characters."),
    newPassword: z
      .string()
      .min(1, "New password is required.")
      .min(8, "Password must be at least 8 characters."),
    confirmNewPassword: z
      .string()
      .min(1, "Confirm new password is required.")
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
  });

export const profileSearchFilterSchema = z.object({
  professional_title: z.string().optional(),
  skills: z.string().optional(),
  experience_years: z.string().optional(),
  address: z.string().optional(),
});

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .min(1, "New email is required.")
    .email("Invalid email address"),
});

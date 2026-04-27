import { z } from "zod";

export const ProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  professional_title: z.string().optional(),
  professional_summary: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  email: z.string().min(1, "Email is required.").email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required."),
  address: z.string().min(1, "Address is required."),
  gender: z.string().nullable().optional(),
  resume: z.string().optional(),
  experience_level: z.string().optional(),
  education_level: z.string().optional(),
  skills: z.array(z.string()).optional(),
  profile_image: z.string().optional(),
  cv: z.string().optional(),
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

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .min(1, "New email is required.")
    .email("Invalid email address"),
});

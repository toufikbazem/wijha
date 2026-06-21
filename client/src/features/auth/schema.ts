import { z } from "zod";
import {
  companySize,
  educationLevels,
  experienceLevels,
  industries,
} from "../../utils/data";

// Step 1 — Account Type
export const accountTypeSchema = z.object({
  accountType: z.enum(["jobseeker", "employer"], {
    message: "Please select an account type.",
  }),
});

// Step 2 — Account Information (shared)
export const accountInfoSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required.")
      .max(254, "Email must be at most 254 characters.")
      .pipe(z.email("Invalid email address")),
    password: z
      .string()
      .min(1, "Password is required.")
      .max(128, "Password must be at most 128 characters.")
      .pipe(z.string().min(8, "Password must be at least 8 characters.")),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required.")
      .max(128, "Confirm password must be at most 128 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match the password.",
    path: ["confirmPassword"],
  });

// Job Seeker — Step 3 — Personal Information
export const jobseekerPersonalSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(128, "First name must be at most 128 characters.")
    .pipe(z.string().min(2, "First name must be at least 2 characters.")),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(128, "Last name must be at most 128 characters.")
    .pipe(z.string().min(2, "Last name must be at least 2 characters.")),
  address: z
    .string()
    .min(1, "Address is required.")
    .max(256, "Address must be at most 256 characters."),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required.")
    .pipe(z.string().regex(/^0[5-7]\d{8}$/, "Invalid Phone number")),
  gender: z.enum(["male", "female"], {
    message: "Please select a valid gender.",
  }),
  profileImage: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "Invalid URL",
    }),
});

// Job Seeker — Step 4 — Professional Information
export const jobseekerProfessionalSchema = z.object({
  professionalTitle: z
    .string()
    .min(1, "Professional title is required.")
    .max(128, "Professional title must be at most 128 characters.")
    .pipe(
      z.string().min(2, "Professional title must be at least 2 characters."),
    ),
  educationLevel: z.enum(educationLevels, {
    message: "Please select a valid education level.",
  }),
  experienceLevel: z.enum(experienceLevels, {
    message: "Please select a valid experience level.",
  }),
  linkedin: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "Invalid URL",
    }),
  professionalSummary: z.string().optional(),
});

// Final review schema (terms only — all required validation already happened on prior steps)
export const reviewSchema = z.object({
  termsAndConditions: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

// Employer — Step 3 — Company Information
export const employerCompanySchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required.")
    .max(128, "Company name must be at most 128 characters.")
    .pipe(z.string().min(2, "Company name must be at least 2 characters.")),
  address: z
    .string()
    .min(1, "Address is required.")
    .max(256, "Address must be at most 256 characters."),
  industry: z.enum(industries, {
    message: "Please select a valid industry.",
  }),
  size: z.enum(companySize, {
    message: "Please select a valid company size.",
  }),
  foundingYear: z
    .string()
    .min(1, "Founding year is required.")
    .pipe(z.string().regex(/^\d{4}$/, "Invalid founding year")),
});

// Employer — Step 4 — Company Contact
export const employerContactSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required.")
    .pipe(z.string().regex(/^0[5-7]\d{8}$/, "Invalid Phone number")),
  linkedin: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "Invalid URL",
    }),
  website: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "Invalid URL",
    }),
});

// Employer — Step 5 — Company Profile
export const employerProfileSchema = z.object({
  description: z.string().optional(),
  missions: z
    .array(
      z
        .string()
        .min(2, "Mission must be at least 2 characters.")
        .max(256, "Mission must be at most 256 characters"),
    )
    .max(20, "You can only add up to 20 missions.")
    .optional(),
  logo: z.string().optional(),
});

// Combined schemas (kept for typing of the unified form values)
export const jobSeekerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "User name is required.")
      .min(2, "User name must be at least 2 characters.")
      .max(25, "User name must not exceed 25 characters."),
    lastName: z
      .string()
      .min(1, "User name is required.")
      .min(2, "User name must be at least 2 characters.")
      .max(25, "User name must not exceed 25 characters."),
    professionalTitle: z
      .string()
      .min(1, "Professional title is required.")
      .min(2, "Professional title must be at least 2 characters.")
      .max(50, "Professional title must not exceed 50 characters."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email address"),
    educationLevel: z.string().min(1, "Education level is required."),
    experienceLevel: z.string().min(1, "Experience level is required."),
    gender: z.string().min(1, "Gender is required."),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required.")
      .regex(/^0[5-7]\d{8}$/, "Invalid Phone number"),
    address: z.string().min(1, "Address is required."),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
    termsAndConditions: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const employerSchema = z
  .object({
    companyName: z
      .string()
      .min(1, "Company name is required.")
      .min(2, "Company name must be at least 2 characters.")
      .max(100, "Company name must not exceed 100 characters."),
    size: z.string().min(1, "Company size is required."),
    address: z.string().min(1, "Address is required."),
    industry: z.string().min(1, "Industry is required."),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required.")
      .regex(/^0[5-7]\d{8}$/, "Invalid Phone number"),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email address"),
    foundingYear: z
      .string()
      .min(1, "Founding year is required.")
      .regex(/^\d{4}$/, "Invalid founding year"),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
    termsAndConditions: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
  });

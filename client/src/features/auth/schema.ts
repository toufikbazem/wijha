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
    message: "ACCOUNT_TYPE_REQUIRED",
  }),
});

// Step 2 — Account Information (shared)
export const accountInfoSchema = z
  .object({
    email: z
      .string()
      .min(1, "EMAIL_REQUIRED")
      .max(254, "EMAIL_MAX_LENGTH")
      .pipe(z.email("EMAIL_INVALID")),
    password: z
      .string()
      .min(1, "PASSWORD_REQUIRED")
      .max(128, "PASSWORD_MAX_LENGTH")
      .pipe(z.string().min(8, "PASSWORD_MIN_LENGTH")),
    confirmPassword: z
      .string()
      .min(1, "CONFIRMPASSWORD_REQUIRED")
      .max(128, "CONFIRMPASSWORD_MAX_LENGTH"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "PASSWORD_MISMATCH",
    path: ["confirmPassword"],
  });

// Job Seeker — Step 3 — Personal Information
export const jobseekerPersonalSchema = z.object({
  firstName: z
    .string()
    .min(1, "FIRST_NAME_REQUIRED")
    .max(128, "FIRST_NAME_MAX_LENGTH")
    .pipe(z.string().min(2, "FIRST_NAME_MIN_LENGTH")),
  lastName: z
    .string()
    .min(1, "LAST_NAME_REQUIRED")
    .max(128, "LAST_NAME_MAX_LENGTH")
    .pipe(z.string().min(2, "LAST_NAME_MIN_LENGTH")),
  address: z
    .string()
    .min(1, "ADDRESS_REQUIRED")
    .max(256, "ADDRESS_MAX_LENGTH"),
  phoneNumber: z
    .string()
    .min(1, "PHONE_REQUIRED")
    .pipe(z.string().regex(/^0[5-7]\d{8}$/, "PHONE_INVALID")),
  gender: z.enum(["male", "female"], {
    message: "GENDER_REQUIRED",
  }),
  profileImage: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "PROFILE_IMAGE_INVALID",
    }),
});

// Job Seeker — Step 4 — Professional Information
export const jobseekerProfessionalSchema = z.object({
  professionalTitle: z
    .string()
    .min(1, "PROFESSIONAL_TITLE_REQUIRED")
    .max(128, "PROFESSIONAL_TITLE_MAX_LENGTH")
    .pipe(z.string().min(2, "PROFESSIONAL_TITLE_MIN_LENGTH")),
  educationLevel: z.enum(educationLevels, {
    message: "EDUCATION_LEVEL_REQUIRED",
  }),
  experienceLevel: z.enum(experienceLevels, {
    message: "EXPERIENCE_LEVEL_REQUIRED",
  }),
  linkedin: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "LINKEDIN_URL_INVALID",
    }),
  professionalSummary: z
    .string()
    .max(2024, "PROFESSIONAL_SUMMARY_MAX_LENGTH")
    .optional(),
});

// Final review schema (terms only — all required validation already happened on prior steps)
export const reviewSchema = z.object({
  termsAndConditions: z.boolean().refine((val) => val === true, {
    message: "TERMS_AND_CONDITIONS_REQUIRED",
  }),
});

// Employer — Step 3 — Company Information
export const employerCompanySchema = z.object({
  companyName: z
    .string()
    .min(1, "COMPANY_NAME_REQUIRED")
    .max(128, "COMPANY_NAME_MAX_LENGTH")
    .pipe(z.string().min(2, "COMPANY_NAME_MIN_LENGTH")),
  address: z
    .string()
    .min(1, "ADDRESS_REQUIRED")
    .max(256, "ADDRESS_MAX_LENGTH"),
  industry: z.enum(industries, {
    message: "INDUSTRY_REQUIRED",
  }),
  size: z.enum(companySize, {
    message: "SIZE_REQUIRED",
  }),
  foundingYear: z
    .string()
    .min(1, "FOUNDING_YEAR_REQUIRED")
    .pipe(z.string().regex(/^\d{4}$/, "FOUNDING_YEAR_INVALID")),
});

// Employer — Step 4 — Company Contact
export const employerContactSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "PHONE_REQUIRED")
    .pipe(z.string().regex(/^0[5-7]\d{8}$/, "PHONE_INVALID")),
  linkedin: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "LINKEDIN_URL_INVALID",
    }),
  website: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "WEBSITE_URL_INVALID",
    }),
});

// Employer — Step 5 — Company Profile
export const employerProfileSchema = z.object({
  description: z
    .string()
    .max(2024, "DESCRIPTION_MAX_LENGTH")
    .optional(),
  missions: z
    .array(
      z
        .string()
        .min(2, "MISSION_MIN_LENGTH")
        .max(256, "MISSION_MAX_LENGTH"),
    )
    .max(20, "MISSIONS_MAX_LENGTH")
    .optional(),
  logo: z
    .string()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "LOGO_REQUIRED",
    })
    .optional(),
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

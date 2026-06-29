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
  address: z.string().min(1, "ADDRESS_REQUIRED").max(256, "ADDRESS_MAX_LENGTH"),
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

// Job Seeker — Step 5 — Experiences
export const experienceDraftSchema = z
  .object({
    title: z
      .string()
      .min(1, "EXPERIENCE_TITLE_REQUIRED")
      .max(128, "EXPERIENCE_TITLE_MAX_LENGTH")
      .pipe(z.string().min(2, "EXPERIENCE_TITLE_MIN_LENGTH")),
    company: z
      .string()
      .min(1, "EXPERIENCE_COMPANY_REQUIRED")
      .max(128, "EXPERIENCE_COMPANY_MAX_LENGTH")
      .pipe(z.string().min(2, "EXPERIENCE_COMPANY_MIN_LENGTH")),
    fromMonth: z
      .string()
      .min(1, "EXPERIENCE_FROM_MONTH_REQUIRED")
      .pipe(
        z.string().regex(/^(1[0-2]|[1-9])$/, "EXPERIENCE_FROM_MONTH_REQUIRED"),
      ),
    fromYear: z
      .string()
      .min(1, "EXPERIENCE_FROM_YEAR_REQUIRED")
      .pipe(z.string().regex(/^\d{4}$/, "EXPERIENCE_FROM_YEAR_REQUIRED")),
    toMonth: z
      .string()
      .min(1, "EXPERIENCE_TO_MONTH_REQUIRED")
      .pipe(
        z.string().regex(/^(1[0-2]|[1-9])$/, "EXPERIENCE_TO_MONTH_REQUIRED"),
      ),
    toYear: z
      .string()
      .min(1, "EXPERIENCE_TO_YEAR_REQUIRED")
      .pipe(z.string().regex(/^\d{4}$/, "EXPERIENCE_TO_YEAR_REQUIRED")),
    description: z
      .string()
      .max(2024, "EXPERIENCE_DESCRIPTION_MAX_LENGTH")
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(
        parseInt(data.fromYear),
        parseInt(data.fromMonth) - 1,
      );
      const end = new Date(parseInt(data.toYear), parseInt(data.toMonth) - 1);
      return start <= end;
    },
    {
      message: "EXPERIENCE_END_DATE_AFTER_START",
      path: ["toYear"],
    },
  );

export const experienceItemSchema = z
  .object({
    title: z
      .string()
      .min(2, "EXPERIENCE_TITLE_MIN_LENGTH")
      .max(128, "EXPERIENCE_TITLE_MAX_LENGTH"),
    company: z
      .string()
      .min(2, "EXPERIENCE_COMPANY_MIN_LENGTH")
      .max(128, "EXPERIENCE_COMPANY_MAX_LENGTH"),
    from: z.iso.datetime("EXPERIENCE_FROM_INVALID"),
    to: z.iso.datetime("EXPERIENCE_TO_INVALID"),
    description: z
      .string()
      .max(2024, "EXPERIENCE_DESCRIPTION_MAX_LENGTH")
      .optional(),
  })
  .refine((data) => new Date(data.from) <= new Date(data.to), {
    message: "EXPERIENCE_END_DATE_AFTER_START",
    path: ["to"],
  });

export const experiencesSchema = z
  .array(experienceItemSchema)
  .max(20, "EXPERIENCES_MAX_LENGTH")
  .optional();

// Job Seeker — Step 6 — Education
export const educationDraftSchema = z
  .object({
    degree: z
      .string()
      .min(1, "EDUCATION_DEGREE_REQUIRED")
      .max(128, "EDUCATION_DEGREE_MAX_LENGTH")
      .pipe(z.string().min(2, "EDUCATION_DEGREE_MIN_LENGTH")),
    institution: z
      .string()
      .min(1, "EDUCATION_INSTITUTION_REQUIRED")
      .max(128, "EDUCATION_INSTITUTION_MAX_LENGTH")
      .pipe(z.string().min(2, "EDUCATION_INSTITUTION_MIN_LENGTH")),
    fromMonth: z
      .string()
      .min(1, "EDUCATION_FROM_MONTH_REQUIRED")
      .pipe(
        z.string().regex(/^(1[0-2]|[1-9])$/, "EDUCATION_FROM_MONTH_REQUIRED"),
      ),
    fromYear: z
      .string()
      .min(1, "EDUCATION_FROM_YEAR_REQUIRED")
      .pipe(z.string().regex(/^\d{4}$/, "EDUCATION_FROM_YEAR_REQUIRED")),
    toMonth: z
      .string()
      .min(1, "EDUCATION_TO_MONTH_REQUIRED")
      .pipe(
        z.string().regex(/^(1[0-2]|[1-9])$/, "EDUCATION_TO_MONTH_REQUIRED"),
      ),
    toYear: z
      .string()
      .min(1, "EDUCATION_TO_YEAR_REQUIRED")
      .pipe(z.string().regex(/^\d{4}$/, "EDUCATION_TO_YEAR_REQUIRED")),
    description: z
      .string()
      .max(2024, "EDUCATION_DESCRIPTION_MAX_LENGTH")
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(
        parseInt(data.fromYear),
        parseInt(data.fromMonth) - 1,
      );
      const end = new Date(parseInt(data.toYear), parseInt(data.toMonth) - 1);
      return start <= end;
    },
    {
      message: "EDUCATION_END_DATE_AFTER_START",
      path: ["toYear"],
    },
  );

export const educationItemSchema = z
  .object({
    degree: z
      .string()
      .min(2, "EDUCATION_DEGREE_MIN_LENGTH")
      .max(128, "EDUCATION_DEGREE_MAX_LENGTH"),
    institution: z
      .string()
      .min(2, "EDUCATION_INSTITUTION_MIN_LENGTH")
      .max(128, "EDUCATION_INSTITUTION_MAX_LENGTH"),
    from: z.iso.datetime("EDUCATION_FROM_INVALID"),
    to: z.iso.datetime("EDUCATION_TO_INVALID"),
    description: z
      .string()
      .max(2024, "EDUCATION_DESCRIPTION_MAX_LENGTH")
      .optional(),
  })
  .refine((data) => new Date(data.from) <= new Date(data.to), {
    message: "EDUCATION_END_DATE_AFTER_START",
    path: ["to"],
  });

export const educationsSchema = z
  .array(educationItemSchema)
  .max(20, "EDUCATIONS_MAX_LENGTH")
  .optional();

// Job Seeker — Step 7 — Skills
export const skillSchema = z
  .string()
  .min(2, "SKILL_MIN_LENGTH")
  .max(50, "SKILL_MAX_LENGTH");

export const skillsSchema = z
  .array(skillSchema)
  .max(30, "SKILLS_MAX_LENGTH")
  .optional();

// Final review schema
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
  address: z.string().min(1, "ADDRESS_REQUIRED").max(256, "ADDRESS_MAX_LENGTH"),
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
  description: z.string().max(2024, "DESCRIPTION_MAX_LENGTH").optional(),
  missions: z
    .array(
      z.string().min(2, "MISSION_MIN_LENGTH").max(256, "MISSION_MAX_LENGTH"),
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

export const loginSchema = z.object({
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
  rememberMe: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "EMAIL_REQUIRED")
    .max(254, "EMAIL_MAX_LENGTH")
    .pipe(z.email("EMAIL_INVALID")),
});

export const resetPasswordSchema = z
  .object({
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
    message: "PASSWORDS_MUST_MATCH",
  });

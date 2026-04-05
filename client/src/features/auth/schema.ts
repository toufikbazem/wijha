import { z } from "zod";

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
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email address"),
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

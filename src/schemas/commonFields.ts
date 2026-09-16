// src/schemas/common/commonFields.ts
import { z } from "zod";

export const commonFields = {
  // ─── String fields ───────────────────────────────────────
  requiredString: (label: string) =>
    z.string().min(1, `${label} cannot be empty.`),

  name: (label: string) =>
    z
      .string()
      .min(1, `${label} cannot be empty.`)
      .max(30, `${label} size should be 1 to 30.`)
      .regex(/^[a-zA-Z\s]+$/, `Invalid ${label}, special characters not allowed.`),

  username: z
    .string()
    .min(3, "Username size should be 3 to 30.")
    .max(30, "Username size should be 3 to 30.")
    .regex(/^[a-zA-Z\s]+$/, "Invalid Username, special characters are not allowed."),

  password: z
    .string()
    .min(6, "Password size should be 6 to 15.")
    .max(15, "Password size should be 6 to 15."),

  email: z
    .string()
    .min(1, "Email cannot be empty.")
    .max(45, "Email cannot be more than 45 characters.")
    .regex(
      /^(?=.{1,64}@)[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[^-][a-zA-Z0-9]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/,
      "Invalid email address."
    ),

  phone: z
    .string()
    .min(1, "Phone cannot be empty.")
    .regex(/^(0|91)?[6-9][0-9]{9}$/, "Invalid Phone Number."),

  // ─── Number fields ────────────────────────────────────────
  positiveNumber: (label: string) =>
    z.number({ invalid_type_error: `${label} must be a number.` })
     .positive(`${label} must be greater than 0.`),

  nonNegativeNumber: (label: string) =>
    z.number({ invalid_type_error: `${label} must be a number.` })
     .nonnegative(`${label} cannot be negative.`),

  // ─── Optional fields ──────────────────────────────────────
  optionalString: z.string().optional(),

  optionalEmail: z
    .string()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),

  // ─── Date fields ──────────────────────────────────────────
  futureDate: (label: string) =>
    z.string().refine((val) => new Date(val) > new Date(), {
      message: `${label} must be a future date.`,
    }),

  pastDate: (label: string) =>
    z.string().refine((val) => new Date(val) < new Date(), {
      message: `${label} must be a past date.`,
    }),
};
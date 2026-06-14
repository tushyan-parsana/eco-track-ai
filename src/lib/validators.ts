/**
 * @module validators
 * @description Centralised Zod validation schemas for all server-side
 * data ingestion in EcoTrack AI. Co-locating schemas here keeps
 * `actions.ts` focused on business logic and makes schemas independently testable.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Footprint Record Schema
// ---------------------------------------------------------------------------

/**
 * Validates the payload sent when saving a carbon footprint record.
 * All emission values must be non-negative numbers.
 */
export const footprintSchema = z.object({
  transport: z
    .number({ error: "Transport emission is required" })
    .min(0, "Transport emission must be non-negative"),
  energy: z
    .number({ error: "Energy emission is required" })
    .min(0, "Energy emission must be non-negative"),
  food: z
    .number({ error: "Food emission is required" })
    .min(0, "Food emission must be non-negative"),
  lifestyle: z
    .number({ error: "Lifestyle emission is required" })
    .min(0, "Lifestyle emission must be non-negative"),
  total: z
    .number({ error: "Total emission is required" })
    .min(0, "Total emission must be non-negative"),
});

/** Inferred TypeScript type from the footprint Zod schema. */
export type FootprintInput = z.infer<typeof footprintSchema>;

// ---------------------------------------------------------------------------
// Goal Schema
// ---------------------------------------------------------------------------

/**
 * Validates the payload for creating a new sustainability goal.
 */
export const goalSchema = z.object({
  title: z
    .string({ error: "Goal title is required" })
    .min(1, "Goal title cannot be empty")
    .max(200, "Goal title must be 200 characters or fewer"),
  targetValue: z
    .number({ error: "Target value is required" })
    .positive("Target value must be a positive number"),
  deadline: z
    .string({ error: "Deadline is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Deadline must be a valid date string",
    }),
});

/** Inferred TypeScript type from the goal Zod schema. */
export type GoalInput = z.infer<typeof goalSchema>;

// ---------------------------------------------------------------------------
// Calculator Form Schema (client-side pre-validation)
// ---------------------------------------------------------------------------

/**
 * Validates the raw calculator form data before it is processed.
 * Numeric fields are expected as strings from form inputs.
 */
export const calculatorFormSchema = z.object({
  carMiles: z.string(),
  flights: z.string(),
  electricity: z.string(),
  dietType: z.enum(["meat", "mixed", "vegetarian", "vegan"]),
  shoppingFrequency: z.enum(["high", "moderate", "low"]),
});

/** Inferred TypeScript type from the calculator form schema. */
export type CalculatorFormInput = z.infer<typeof calculatorFormSchema>;

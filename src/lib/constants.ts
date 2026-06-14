/**
 * @module constants
 * @description Central configuration for carbon footprint emission factors,
 * scoring logic, and calculation utilities used across EcoTrack AI.
 */

// ---------------------------------------------------------------------------
// Emission Factor Constants (kg CO2e)
// ---------------------------------------------------------------------------

/** CO2 emitted per mile driven by an average car (kg CO2e/mile). */
export const CAR_EMISSION_PER_MILE = 0.4;

/** CO2 emitted per round-trip flight (kg CO2e/flight). */
export const FLIGHT_EMISSION_PER_TRIP = 200;

/** CO2 emitted per dollar of electricity usage (kg CO2e/$). */
export const ELECTRICITY_EMISSION_PER_DOLLAR = 0.5;

/** Weeks in a year — used to annualize weekly inputs. */
export const WEEKS_PER_YEAR = 52;

// ---------------------------------------------------------------------------
// Diet Emission Factors (kg CO2e per year)
// ---------------------------------------------------------------------------

/** Annual CO2e estimates by diet type. */
export const DIET_EMISSIONS: Record<DietType, number> = {
  meat: 3000,
  mixed: 2000,
  vegetarian: 1000,
  vegan: 800,
} as const;

// ---------------------------------------------------------------------------
// Shopping / Lifestyle Emission Factors (kg CO2e per year)
// ---------------------------------------------------------------------------

/** Annual CO2e estimates by shopping frequency. */
export const SHOPPING_EMISSIONS: Record<ShoppingFrequency, number> = {
  high: 1000,
  moderate: 500,
  low: 200,
} as const;

// ---------------------------------------------------------------------------
// Carbon Score Constants
// ---------------------------------------------------------------------------

/** Maximum eco score a user can achieve. */
export const MAX_CARBON_SCORE = 100;

/** Divisor applied to total emissions when computing the eco score deduction. */
export const SCORE_DIVISOR = 100;

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/** Supported diet types for the carbon calculator. */
export type DietType = "meat" | "mixed" | "vegetarian" | "vegan";

/** Supported shopping frequency levels for the carbon calculator. */
export type ShoppingFrequency = "high" | "moderate" | "low";

/** Raw user inputs from the calculator form. */
export interface CalculatorFormData {
  /** Weekly car miles driven. */
  carMiles: string;
  /** Number of round-trip flights per year. */
  flights: string;
  /** Monthly electricity bill in dollars. */
  electricity: string;
  /** Primary diet type. */
  dietType: DietType;
  /** How often the user shops for new items. */
  shoppingFrequency: ShoppingFrequency;
}

/** Computed carbon footprint breakdown (all values in kg CO2e/year). */
export interface FootprintBreakdown {
  transport: number;
  energy: number;
  food: number;
  lifestyle: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Calculator Steps Configuration
// ---------------------------------------------------------------------------

/** Identifiers for each step in the calculator wizard. */
export const CALCULATOR_STEPS = [
  { id: "transport", title: "Transportation" },
  { id: "energy", title: "Home Energy" },
  { id: "food", title: "Diet & Food" },
  { id: "lifestyle", title: "Lifestyle" },
  { id: "results", title: "Your Results" },
] as const;

/** Default form state for the calculator. */
export const DEFAULT_FORM_DATA: CalculatorFormData = {
  carMiles: "",
  flights: "",
  electricity: "",
  dietType: "mixed",
  shoppingFrequency: "moderate",
};

// ---------------------------------------------------------------------------
// Calculation Logic
// ---------------------------------------------------------------------------

/**
 * Calculates the annual carbon footprint breakdown from user-provided inputs.
 *
 * @param data - The raw calculator form data.
 * @returns A breakdown of emissions by category and the total.
 *
 * @example
 * ```ts
 * const result = calculateFootprint({
 *   carMiles: "150",
 *   flights: "2",
 *   electricity: "100",
 *   dietType: "mixed",
 *   shoppingFrequency: "moderate",
 * }, "imperial");
 * // result.total === 150*0.4 + 2*200 + 100*0.5 + 2000 + 500 === 2910
 * ```
 */
export function calculateFootprint(data: CalculatorFormData, unit: "metric" | "imperial" = "imperial"): FootprintBreakdown {
  const milesDriven = unit === "metric" ? (Number(data.carMiles) || 0) * 0.621371 : (Number(data.carMiles) || 0);

  const transport =
    milesDriven * CAR_EMISSION_PER_MILE +
    (Number(data.flights) || 0) * FLIGHT_EMISSION_PER_TRIP;

  const energy = (Number(data.electricity) || 0) * ELECTRICITY_EMISSION_PER_DOLLAR;

  const food = DIET_EMISSIONS[data.dietType] ?? DIET_EMISSIONS.mixed;

  const lifestyle = SHOPPING_EMISSIONS[data.shoppingFrequency] ?? SHOPPING_EMISSIONS.moderate;

  const total = transport + energy + food + lifestyle;

  return { transport, energy, food, lifestyle, total };
}

/**
 * Computes a user-facing eco score (0–100) from their total annual emissions.
 * Lower emissions result in a higher score.
 *
 * @param totalEmissions - Total annual emissions in kg CO2e.
 * @returns An integer score between 0 and {@link MAX_CARBON_SCORE}.
 */
export function computeCarbonScore(totalEmissions: number): number {
  const clamped = Math.max(0, totalEmissions);
  const deduction = Math.min(MAX_CARBON_SCORE, Math.round(clamped / SCORE_DIVISOR));
  return Math.max(0, MAX_CARBON_SCORE - deduction);
}

// ---------------------------------------------------------------------------
// Badge Definitions
// ---------------------------------------------------------------------------

/** Badge definitions with their unlock conditions. */
export const BADGE_DEFINITIONS = [
  {
    name: "First Footprint",
    icon: "⭐",
    condition: (footprintCount: number) => footprintCount >= 1,
  },
  {
    name: "Eco Warrior",
    icon: "🏆",
    condition: (footprintCount: number) => footprintCount >= 5,
  },
  {
    name: "Green Champion",
    icon: "🌿",
    condition: (footprintCount: number) => footprintCount >= 10,
  },
] as const;

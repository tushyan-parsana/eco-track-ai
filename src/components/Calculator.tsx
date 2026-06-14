"use client";

/**
 * @component Calculator
 * @description A multi-step carbon footprint calculator wizard.
 * Collects transport, energy, food, and lifestyle data to compute
 * an estimated annual CO2e footprint. Results are persisted to the
 * database for authenticated users.
 */

import { useState, useTransition, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import {
  Car,
  Zap,
  Utensils,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { saveFootprint } from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  calculateFootprint,
  DEFAULT_FORM_DATA,
  type CalculatorFormData,
  type FootprintBreakdown,
} from "@/lib/constants";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSettingsStore } from "@/store/useSettingsStore";

// ---------------------------------------------------------------------------
// Step configuration
// ---------------------------------------------------------------------------

const steps = [
  { id: "transport", title: "Transportation", icon: Car },
  { id: "energy", title: "Home Energy", icon: Zap },
  { id: "food", title: "Diet & Food", icon: Utensils },
  { id: "lifestyle", title: "Lifestyle", icon: ShoppingBag },
  { id: "results", title: "Your Results", icon: CheckCircle2 },
] as const;

// ---------------------------------------------------------------------------
// Sub-components for each step
// ---------------------------------------------------------------------------

/** Props shared by all step renderers. */
interface StepProps {
  formData: CalculatorFormData;
  onChange: (field: keyof CalculatorFormData, value: string) => void;
}

function TransportStep({ formData, onChange }: StepProps) {
  const { unit } = useSettingsStore();
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="carMiles"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {unit === "metric" ? "Weekly car kilometers driven" : "Weekly car miles driven"}
        </label>
        <Input
          id="carMiles"
          type="number"
          min="0"
          placeholder="e.g. 150"
          aria-describedby="carMilesHint"
          value={formData.carMiles}
          onChange={(e) => onChange("carMiles", e.target.value)}
        />
        <p id="carMilesHint" className="sr-only">
          Enter the approximate number of {unit === "metric" ? "kilometers" : "miles"} you drive per week
        </p>
      </div>
      <div>
        <label
          htmlFor="flights"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Flights per year
        </label>
        <Input
          id="flights"
          type="number"
          min="0"
          placeholder="e.g. 2"
          aria-describedby="flightsHint"
          value={formData.flights}
          onChange={(e) => onChange("flights", e.target.value)}
        />
        <p id="flightsHint" className="sr-only">
          Enter the number of round-trip flights you take per year
        </p>
      </div>
    </div>
  );
}

/** Step 1 — Home energy inputs. */
function EnergyStep({ formData, onChange }: StepProps) {
  const { currency } = useSettingsStore();
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="electricity"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Monthly electricity bill ({currency})
        </label>
        <Input
          id="electricity"
          type="number"
          min="0"
          placeholder="e.g. 100"
          aria-describedby="electricityHint"
          value={formData.electricity}
          onChange={(e) => onChange("electricity", e.target.value)}
        />
        <p id="electricityHint" className="sr-only">
          Enter your average monthly electricity bill
        </p>
      </div>
    </div>
  );
}

/** Step 2 — Diet selection. */
function FoodStep({ formData, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="dietType"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Primary Diet Type
        </label>
        <select
          id="dietType"
          aria-label="Select your primary diet type"
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          value={formData.dietType}
          onChange={(e) => onChange("dietType", e.target.value)}
        >
          <option value="meat">Meat Heavy</option>
          <option value="mixed">Mixed / Average</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </div>
    </div>
  );
}

/** Step 3 — Lifestyle / shopping habits. */
function LifestyleStep({ formData, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="shoppingFrequency"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Shopping Frequency for New Items
        </label>
        <select
          id="shoppingFrequency"
          aria-label="Select how often you shop for new items"
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          value={formData.shoppingFrequency}
          onChange={(e) => onChange("shoppingFrequency", e.target.value)}
        >
          <option value="high">High (Weekly)</option>
          <option value="moderate">Moderate (Monthly)</option>
          <option value="low">Low (Rarely)</option>
        </select>
      </div>
    </div>
  );
}

/** Step 4 — Results display. */
function ResultsStep({
  result,
  session,
  onNavigateDashboard,
}: {
  result: number;
  session: boolean;
  onNavigateDashboard: () => void;
}) {
  return (
    <div className="text-center py-8" aria-live="polite" role="status">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-32 h-32 rounded-full bg-brand-500/10 mx-auto flex items-center justify-center mb-6"
      >
        <div className="text-4xl font-bold text-brand-600 dark:text-brand-400">
          {Math.round(result)}
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">kg CO2e per year</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        Based on your inputs, your estimated carbon footprint is{" "}
        {Math.round(result)} kg CO2e annually. This is just a starting point!
        {!session && (
          <span className="block mt-4 text-orange-500 font-medium text-sm">
            Please log in to save these results to your dashboard.
          </span>
        )}
      </p>
      {session ? (
        <Button
          variant="default"
          size="lg"
          className="rounded-full"
          onClick={onNavigateDashboard}
        >
          Go to Dashboard
        </Button>
      ) : (
        <Button
          variant="default"
          size="lg"
          className="rounded-full"
          onClick={() => signIn()}
        >
          Sign In to Save
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Calculator Component
// ---------------------------------------------------------------------------

export default function Calculator() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { unit } = useSettingsStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CalculatorFormData>(DEFAULT_FORM_DATA);
  const [result, setResult] = useState<FootprintBreakdown | null>(null);

  /** Percentage of steps completed, for the progress bar. */
  const progressPercent = useMemo(
    () => (currentStep / (steps.length - 1)) * 100,
    [currentStep]
  );

  /** Updates a single field in the form data. */
  const handleFieldChange = useCallback(
    (field: keyof CalculatorFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  /** Advances to the next step, calculating results on the penultimate step. */
  const handleNext = useCallback(async () => {
    if (currentStep >= steps.length - 1) return;

    if (currentStep === steps.length - 2) {
      const breakdown = calculateFootprint(formData, unit);
      setResult(breakdown);

      if (session) {
        startTransition(async () => {
          await saveFootprint({
            transport: breakdown.transport,
            energy: breakdown.energy,
            food: breakdown.food,
            lifestyle: breakdown.lifestyle,
            total: breakdown.total,
          });
          setCurrentStep((prev) => prev + 1);
        });
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  }, [currentStep, formData, session, startTransition]);

  /** Goes back one step. */
  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  /** Navigates to the dashboard. */
  const handleNavigateDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <ErrorBoundary>
      <GlassCard className="w-full relative overflow-hidden">
        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Calculator progress: step ${currentStep + 1} of ${steps.length}`}
        >
          <motion.div
            className="h-full bg-brand-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-4">
          {/* Sidebar Steps */}
          <div
            className="hidden md:flex flex-col gap-4 min-w-[200px]"
            role="tablist"
            aria-label="Calculator steps"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              return (
                <div
                  key={step.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? "step" : undefined}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                      : isPast
                        ? "text-slate-600 dark:text-slate-400"
                        : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-[300px] relative" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                    {steps[currentStep].title}
                  </h2>

                  {currentStep === 0 && (
                    <TransportStep formData={formData} onChange={handleFieldChange} />
                  )}
                  {currentStep === 1 && (
                    <EnergyStep formData={formData} onChange={handleFieldChange} />
                  )}
                  {currentStep === 2 && (
                    <FoodStep formData={formData} onChange={handleFieldChange} />
                  )}
                  {currentStep === 3 && (
                    <LifestyleStep formData={formData} onChange={handleFieldChange} />
                  )}
                  {currentStep === 4 && result && (
                    <ResultsStep
                      result={result.total}
                      session={!!session}
                      onNavigateDashboard={handleNavigateDashboard}
                    />
                  )}
                </div>

                {/* Navigation Actions */}
                {currentStep < steps.length - 1 && (
                  <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="ghost"
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={isPending}
                      className="gap-2 bg-brand-600 hover:bg-brand-700"
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : currentStep === steps.length - 2 ? (
                        "Calculate Result"
                      ) : (
                        "Next"
                      )}
                      {!isPending && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </GlassCard>
    </ErrorBoundary>
  );
}

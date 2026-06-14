"use client";

/**
 * @component GoalForm
 * @description A modal-like form for creating new sustainability goals.
 * Uses server actions to persist goals and optimistic UI patterns.
 */

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { X, Loader2, Plus } from "lucide-react";
import { createGoal } from "@/lib/goal-actions";

interface GoalFormProps {
  /** Callback fired after a goal is successfully created. */
  onSuccess?: () => void;
}

export default function GoalForm({ onSuccess }: GoalFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const target = Number(targetValue);
    if (!title.trim()) {
      setError("Please enter a goal title.");
      return;
    }
    if (!target || target <= 0) {
      setError("Please enter a valid target value.");
      return;
    }
    if (!deadline) {
      setError("Please select a deadline.");
      return;
    }

    startTransition(async () => {
      const result = await createGoal({
        title: title.trim(),
        targetValue: target,
        deadline,
      });

      if (result.success) {
        setTitle("");
        setTargetValue("");
        setDeadline("");
        setIsOpen(false);
        onSuccess?.();
      } else {
        setError(result.error);
      }
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl gap-2"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        Set New Goal
      </Button>
    );
  }

  return (
    <GlassCard variant="dark" className="p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">New Goal</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          aria-label="Close goal form"
        >
          <X className="w-4 h-4 text-slate-400" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="goalTitle"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Goal Title
          </label>
          <Input
            id="goalTitle"
            placeholder="e.g. Reduce meat consumption"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="dark:bg-slate-900 dark:border-slate-700"
          />
        </div>

        <div>
          <label
            htmlFor="goalTarget"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Target (kg CO2e reduction)
          </label>
          <Input
            id="goalTarget"
            type="number"
            min="1"
            placeholder="e.g. 100"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            className="dark:bg-slate-900 dark:border-slate-700"
          />
        </div>

        <div>
          <label
            htmlFor="goalDeadline"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Deadline
          </label>
          <Input
            id="goalDeadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="dark:bg-slate-900 dark:border-slate-700"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand-600 hover:bg-brand-700 gap-2"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            "Create Goal"
          )}
        </Button>
      </form>
    </GlassCard>
  );
}

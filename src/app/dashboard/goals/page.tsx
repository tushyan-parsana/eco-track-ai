export const dynamic = "force-dynamic";

/**
 * @page GoalsPage
 * @description Displays the user's sustainability goals with real data
 * from the database and their earned achievement badges.
 */

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Star, Leaf, Award, Trash2 } from "lucide-react";
import { getDashboardData } from "@/lib/actions";
import { BADGE_DEFINITIONS } from "@/lib/constants";
import { deleteGoal } from "@/lib/goal-actions";
import Link from "next/link";
import GoalForm from "@/components/GoalForm";

/** Maps badge icon strings to Lucide components. */
const BADGE_ICON_MAP: Record<string, typeof Trophy> = {
  "⭐": Star,
  "🏆": Trophy,
  "🌿": Leaf,
  "🏅": Award,
};

export default async function GoalsPage() {
  const result = await getDashboardData();

  if (!result.success || !result.data) {
    return (
      <div className="max-w-6xl mx-auto text-center py-24">
        <h1 className="text-3xl font-bold text-white mb-4">Please log in</h1>
        <p className="text-slate-400 mb-8">
          You need to be logged in to view your goals and achievements.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  const user = result.data;

  // Calculate days remaining for each goal
  const goalsWithProgress = user.goals.map((goal) => {
    const daysLeft = Math.max(
      0,
      Math.ceil(
        (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    );
    const progress = goal.targetValue > 0
      ? Math.min(100, Math.round((goal.currentVal / goal.targetValue) * 100))
      : 0;

    return { ...goal, daysLeft, progress };
  });

  const activeGoals = goalsWithProgress.filter((g) => !g.isCompleted);
  const completedGoals = goalsWithProgress.filter((g) => g.isCompleted);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Goals & Achievements
          </h1>
          <p className="text-slate-400">
            Track your sustainability goals and view your earned badges.
          </p>
        </div>
        <GoalForm />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Goals */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Active Goals</h2>
          <div className="space-y-4">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => (
                <GlassCard variant="dark" key={goal.id} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Target className="w-5 h-5 text-blue-500" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold text-white">{goal.title}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">
                        {goal.daysLeft} days left
                      </span>
                      <form action={async () => { "use server"; await deleteGoal(goal.id); }}>
                        <button type="submit" className="text-slate-500 hover:text-red-500 transition-colors" aria-label="Delete goal">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div
                    className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2"
                    role="progressbar"
                    aria-valuenow={goal.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${goal.title}: ${goal.progress}% completed`}
                  >
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>{goal.progress}% completed</span>
                    <span>
                      {Math.round(goal.currentVal)}/{Math.round(goal.targetValue)} kg CO2e
                    </span>
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="text-center text-slate-500 py-8">
                No active goals. Set a new goal to get started!
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2">
                  Completed
                </h3>
                {completedGoals.map((goal) => (
                  <GlassCard variant="dark" key={goal.id} className="p-5 opacity-75">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <Target className="w-5 h-5 text-green-500" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white line-through">
                          {goal.title}
                        </h3>
                        <span className="text-xs text-green-400">✓ Completed</span>
                      </div>
                    </div>
                    <form action={async () => { "use server"; await deleteGoal(goal.id); }} className="ml-auto">
                      <button type="submit" className="text-slate-500 hover:text-red-500 transition-colors" aria-label="Delete goal">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </GlassCard>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {BADGE_DEFINITIONS.map((def) => {
              const earnedBadge = user.badges.find((b) => b.name === def.name);
              const isEarned = !!earnedBadge;
              const IconComponent = BADGE_ICON_MAP[def.icon] || Award;

              return (
                <GlassCard
                  variant="dark"
                  key={def.name}
                  className={`p-5 text-center flex flex-col items-center transition-all ${
                    isEarned ? "" : "opacity-40 grayscale"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      isEarned
                        ? "bg-yellow-500/20 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                        : "bg-slate-800"
                    }`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${
                        isEarned ? "text-yellow-500" : "text-slate-500"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{def.name}</h3>
                  <p className="text-xs text-slate-400">
                    {isEarned && earnedBadge
                      ? `Earned ${new Date(earnedBadge.awardedAt).toLocaleDateString(
                          "default",
                          { month: "short", day: "numeric" }
                        )}`
                      : "Not yet earned"}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

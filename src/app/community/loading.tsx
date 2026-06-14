/**
 * @component CommunityLoading
 * @description Streaming loading skeleton for the community page.
 */

import { GlassCard } from "@/components/ui/glass-card";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-300 dark:bg-slate-700/50 ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

export default function CommunityLoading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4" aria-busy="true" aria-label="Loading community data">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <SkeletonPulse className="h-10 w-64 mx-auto mb-4" />
          <SkeletonPulse className="h-5 w-96 mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <GlassCard key={i} className="text-center">
              <SkeletonPulse className="w-8 h-8 mx-auto mb-3 rounded-full" />
              <SkeletonPulse className="h-8 w-20 mx-auto mb-1" />
              <SkeletonPulse className="h-4 w-24 mx-auto" />
            </GlassCard>
          ))}
        </div>

        <GlassCard>
          <SkeletonPulse className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </GlassCard>
      </div>
    </main>
  );
}

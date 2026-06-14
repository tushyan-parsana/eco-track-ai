/**
 * @component DashboardLoading
 * @description Streaming loading skeleton shown while the dashboard page
 * data is fetched server-side. Provides instant visual feedback.
 */

import { GlassCard } from "@/components/ui/glass-card";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-700/50 ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto" aria-busy="true" aria-label="Loading dashboard data">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <SkeletonPulse className="h-8 w-48 mb-2" />
          <SkeletonPulse className="h-4 w-64" />
        </div>
        <SkeletonPulse className="h-10 w-28 rounded-xl" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <GlassCard variant="dark" key={i} className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <SkeletonPulse className="w-12 h-12 rounded-xl" />
            </div>
            <SkeletonPulse className="h-4 w-24 mb-2" />
            <SkeletonPulse className="h-8 w-32" />
          </GlassCard>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard variant="dark" className="lg:col-span-2">
          <SkeletonPulse className="h-5 w-32 mb-6" />
          <SkeletonPulse className="h-[300px] w-full rounded-xl" />
        </GlassCard>
        <GlassCard variant="dark" className="lg:col-span-1">
          <SkeletonPulse className="h-5 w-32 mb-6" />
          <SkeletonPulse className="h-[300px] w-full rounded-xl" />
        </GlassCard>
      </div>
    </div>
  );
}

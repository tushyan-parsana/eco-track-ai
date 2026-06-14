export const dynamic = "force-dynamic";

import { getDashboardData } from "@/lib/actions"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingDown, Leaf, Zap, Car } from "lucide-react"
import DashboardCharts from "@/components/DashboardCharts"
import Link from "next/link"

export default async function DashboardOverview() {
  const result = await getDashboardData();
  
  if (!result.success || !result.data) {
    return (
      <div className="max-w-6xl mx-auto text-center py-24">
        <h1 className="text-3xl font-bold text-white mb-4">Please log in</h1>
        <p className="text-slate-400 mb-8">You need to be logged in to view your dashboard.</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  const { data: user } = result;
  
  // Calculate stats from footprints
  const latestFootprint = user.footprints[user.footprints.length - 1] || null;
  const previousFootprint = user.footprints[user.footprints.length - 2] || null;
  
  const total = latestFootprint?.total || 0;
  const prevTotal = previousFootprint?.total || 0;
  const change = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : 0;
  
  const transportTotal = latestFootprint?.transport || 0;
  const energyTotal = latestFootprint?.energy || 0;

  // Format data for charts
  const trendData = user.footprints.map(f => ({
    month: new Date(f.date).toLocaleDateString('default', { month: 'short' }),
    footprint: f.total
  }));

  const categoryData = latestFootprint ? [
    { name: "Transport", value: latestFootprint.transport },
    { name: "Energy", value: latestFootprint.energy },
    { name: "Food", value: latestFootprint.food },
    { name: "Lifestyle", value: latestFootprint.lifestyle },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}</h1>
          <p className="text-slate-400">Here is your environmental impact at a glance.</p>
        </div>
        <Link href="/calculator">
          <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/20">
            Log Activity
          </Button>
        </Link>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard variant="dark" className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-brand-500/20 rounded-xl">
              <Leaf className="w-6 h-6 text-brand-400" />
            </div>
            {latestFootprint && (
              <span className={`flex items-center text-sm font-medium ${change <= 0 ? 'text-success-400' : 'text-orange-400'}`}>
                {change <= 0 ? <TrendingDown className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
                {Math.abs(Math.round(change))}% vs last
              </span>
            )}
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Total Footprint</h3>
          <div className="text-3xl font-bold text-white">
            {Math.round(total)} <span className="text-lg text-slate-500 font-normal">kg CO2e</span>
          </div>
        </GlassCard>

        <GlassCard variant="dark" className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Energy Usage</h3>
          <div className="text-3xl font-bold text-white">
            {Math.round(energyTotal)} <span className="text-lg text-slate-500 font-normal">kg CO2e</span>
          </div>
        </GlassCard>

        <GlassCard variant="dark" className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-success-500/20 rounded-xl">
              <Car className="w-6 h-6 text-success-400" />
            </div>
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Transport Impact</h3>
          <div className="text-3xl font-bold text-white">
            {Math.round(transportTotal)} <span className="text-lg text-slate-500 font-normal">kg CO2e</span>
          </div>
        </GlassCard>
      </div>

      <DashboardCharts trendData={trendData} categoryData={categoryData} />

      {/* AI Recommendations */}
      {latestFootprint && (
        <GlassCard variant="dark" className="border-brand-500/20 bg-gradient-to-br from-brand-950/40 to-slate-900/80 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-500/20 rounded-xl shrink-0">
              <Zap className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Sustainability Advisor</h3>
              <p className="text-slate-400 mb-4">
                {change <= 0 
                  ? "Great job reducing your footprint! To improve further, consider taking public transport twice a week."
                  : "Your emissions have increased. Try to reduce meat consumption or optimize your home energy use this month."}
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/goals">
                  <Button size="sm" className="bg-brand-600 hover:bg-brand-700">Adopt Strategy</Button>
                </Link>
                <Link href="/calculator">
                  <Button size="sm" variant="glass">View Details</Button>
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}

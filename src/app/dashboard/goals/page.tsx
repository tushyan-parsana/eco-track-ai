export const dynamic = "force-dynamic";

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Star, Leaf } from "lucide-react"
import { getDashboardData } from "@/lib/actions"
import Link from "next/link"

export default async function GoalsPage() {
  const result = await getDashboardData();
  
  if (!result.success || !result.data) {
    return (
      <div className="max-w-6xl mx-auto text-center py-24">
        <h1 className="text-3xl font-bold text-white mb-4">Please log in</h1>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  const user = result.data;
  const mockGoals = [
    { id: 1, title: "Reduce Meat Consumption", progress: 75, target: 100, daysLeft: 4, icon: Leaf, color: "text-green-500", bg: "bg-green-500/20" },
    { id: 2, title: "Bike to Work", progress: 40, target: 100, daysLeft: 12, icon: Target, color: "text-blue-500", bg: "bg-blue-500/20" },
  ]; // Using mock because we don't have a form to create goals yet

  const mockBadges = [
    { id: 1, title: "Eco Warrior", description: "Saved 100kg CO2e", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/20" },
    { id: 2, title: "First Footprint", description: "Calculated first footprint", icon: Star, color: "text-purple-500", bg: "bg-purple-500/20" },
  ]; // If user.footprints.length > 0, we can show "First Footprint"

  const userBadges = user.footprints.length > 0 ? mockBadges : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Goals & Achievements</h1>
          <p className="text-slate-400">Track your sustainability goals and view your earned badges.</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl">
          Set New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Active Goals</h2>
          <div className="space-y-4">
            {mockGoals.map((goal) => (
              <GlassCard variant="dark" key={goal.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${goal.bg}`}>
                      <goal.icon className={`w-5 h-5 ${goal.color}`} />
                    </div>
                    <h3 className="font-semibold text-white">{goal.title}</h3>
                  </div>
                  <span className="text-sm text-slate-400">{goal.daysLeft} days left</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full ${goal.color.replace('text', 'bg')}`} 
                    style={{ width: `${(goal.progress / goal.target) * 100}%` }} 
                  />
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{goal.progress}% completed</span>
                  <span>Target: {goal.target}%</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {userBadges.length > 0 ? userBadges.map((badge) => (
              <GlassCard variant="dark" key={badge.id} className="p-5 text-center flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${badge.bg} flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                  <badge.icon className={`w-8 h-8 ${badge.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-1">{badge.title}</h3>
                <p className="text-xs text-slate-400">{badge.description}</p>
              </GlassCard>
            )) : (
              <div className="col-span-2 text-center text-slate-500 py-8">
                Calculate your carbon footprint to earn your first badge!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { GlassCard } from "@/components/ui/glass-card"
import { Users, Globe2, TrendingDown } from "lucide-react"
import { getCommunityLeaderboard } from "@/lib/actions"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function CommunityPage() {
  const result = await getCommunityLeaderboard();
  const session = await getServerSession(authOptions);
  
  const leaderboard = result.success && result.data ? result.data.map((user, index) => ({
    rank: index + 1,
    name: user.name || "Anonymous",
    score: user.carbonScore,
    reduction: `${Math.max(0, user.carbonScore * 2)}kg CO2e`,
    avatar: user.name ? user.name.substring(0, 2).toUpperCase() : "AN",
    isUser: session?.user?.id === user.id
  })) : [];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Community Impact
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            See how you stack up against other EcoTrack users and view our collective global impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <GlassCard className="text-center">
            <Users className="w-8 h-8 mx-auto text-brand-500 mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">12,450</h3>
            <p className="text-slate-500">Active Members</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <Globe2 className="w-8 h-8 mx-auto text-blue-500 mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">540k</h3>
            <p className="text-slate-500">Trees Equivalency</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <TrendingDown className="w-8 h-8 mx-auto text-success-500 mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">2.4M</h3>
            <p className="text-slate-500">kg CO2e Reduced</p>
          </GlassCard>
        </div>

        <GlassCard>
          <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
            Global Leaderboard
          </h2>
          <div className="space-y-4">
            {leaderboard.length > 0 ? leaderboard.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center justify-between p-4 rounded-xl ${user.isUser ? 'bg-brand-500/10 border border-brand-500/20' : 'bg-slate-50 dark:bg-slate-900'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 font-bold text-center ${user.rank <= 3 ? 'text-brand-500' : 'text-slate-400'}`}>
                    #{user.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-semibold text-slate-600 dark:text-slate-300">
                    {user.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {user.name} {user.isUser && "(You)"}
                    </div>
                    <div className="text-xs text-slate-500">Reduced {user.reduction}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-success-500">{user.score}</div>
                  <div className="text-xs text-slate-500">Eco Score</div>
                </div>
              </div>
            )) : (
              <div className="text-center text-slate-500 py-8">No users found. Be the first to calculate your footprint!</div>
            )}
          </div>
        </GlassCard>
      </div>
    </main>
  )
}

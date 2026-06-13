import Link from "next/link"
import { BarChart3, LayoutDashboard, Target, Trophy, Settings } from "lucide-react"
import { getDashboardData } from "@/lib/actions"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/goals", icon: Target, label: "Goals" },
  { href: "/community", icon: Trophy, label: "Community" },
]

export default async function DashboardSidebar() {
  const result = await getDashboardData();
  const score = result.success && result.data ? result.data.carbonScore : 0;
  
  return (
    <aside className="w-64 fixed left-0 top-16 bottom-0 glass-dark border-r border-white/10 p-4 flex flex-col gap-2 z-40">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3 mt-4">
        Menu
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-900/50 to-success-900/50 border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-1">Eco Score</h4>
          <div className="text-2xl font-bold text-success-400 mb-2">{score}<span className="text-sm text-slate-400 font-normal">/100</span></div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-success-500 transition-all duration-1000" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>
    </aside>
  )
}

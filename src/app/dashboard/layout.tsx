import DashboardSidebar from "@/components/DashboardSidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex relative">
      <DashboardSidebar />
      <div className="flex-1 ml-64 p-8">
        {children}
      </div>
    </div>
  )
}

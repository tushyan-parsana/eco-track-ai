"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, LogOut } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            EcoTrack AI
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/calculator" className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
            Calculator
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/community" className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
            Community
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                {session.user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" onClick={() => signIn()} className="hidden sm:inline-flex">Sign In</Button>
              <Button onClick={() => signIn()} className="bg-brand-600 hover:bg-brand-700 rounded-full px-6">Get Started</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

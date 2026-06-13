"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { ArrowRight, Leaf, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingHero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-brand-500 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] opacity-20 bg-success-500 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark text-brand-300 text-sm mb-6 border-white/10"
          >
            <Leaf className="w-4 h-4 text-success-500" />
            <span>EcoTrack AI v2.0 is now live</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Track Your Carbon Footprint with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-success-500 to-brand-500">
              AI-Powered Insights
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Measure your environmental impact, discover smarter lifestyle choices, and achieve meaningful carbon reduction goals.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/calculator">
              <Button size="lg" className="w-full sm:w-auto text-base gap-2 rounded-full px-8 bg-success-600 hover:bg-success-500 text-white border-0">
                Start Tracking
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <GlassCard className="text-center p-8 transform transition hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-brand-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Calculation</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Connect your data for real-time footprint analysis and tracking.
            </p>
          </GlassCard>

          <GlassCard className="text-center p-8 transform transition hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-success-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Personalized, actionable steps to reduce your environmental impact.
            </p>
          </GlassCard>

          <GlassCard className="text-center p-8 transform transition hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Goal Tracking</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Set targets, earn badges, and join a global community of reducers.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

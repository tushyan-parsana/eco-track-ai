import Link from "next/link";
import { Leaf, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                EcoTrack AI
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              Empowering individuals to measure, understand, and reduce their carbon footprint through AI-driven insights and gamification.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="mailto:hello@ecotrack.ai" className="text-slate-400 hover:text-brand-500 transition-colors">
                <Mail className="w-5 h-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/calculator" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Calculator
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} EcoTrack AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            Made with <Leaf className="w-4 h-4 text-brand-500" /> for a greener future
          </div>
        </div>
      </div>
    </footer>
  );
}

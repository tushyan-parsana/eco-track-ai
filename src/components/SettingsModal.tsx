"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { useSettingsStore, type UnitSystem, type Currency } from "@/store/useSettingsStore";
import { AnimatePresence, motion } from "framer-motion";

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { unit, currency, setUnit, setCurrency } = useSettingsStore();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-slate-600 dark:text-slate-300"
        aria-label="Open settings"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Settings</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-white">Preferences</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Unit System */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Measurement Unit
                  </h3>
                  <div className="flex gap-2">
                    {(["imperial", "metric"] as UnitSystem[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                          unit === u
                            ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {u === "imperial" ? "Miles (Imperial)" : "Kilometers (Metric)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Currency
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {(["$", "€", "£", "₹"] as Currency[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                          currency === c
                            ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

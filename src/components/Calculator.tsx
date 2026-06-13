"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Car, Zap, Utensils, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { useSession, signIn } from "next-auth/react"
import { saveFootprint } from "@/lib/actions"
import { useRouter } from "next/navigation"

const steps = [
  { id: "transport", title: "Transportation", icon: Car },
  { id: "energy", title: "Home Energy", icon: Zap },
  { id: "food", title: "Diet & Food", icon: Utensils },
  { id: "lifestyle", title: "Lifestyle", icon: ShoppingBag },
  { id: "results", title: "Your Results", icon: CheckCircle2 },
]

export default function Calculator() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    carMiles: "",
    flights: "",
    electricity: "",
    dietType: "mixed",
    shoppingFrequency: "moderate"
  })

  const [result, setResult] = useState<number | null>(null)

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        // Calculate result
        const transportVal = (Number(formData.carMiles) || 0) * 0.4 + (Number(formData.flights) || 0) * 200;
        const energyVal = (Number(formData.electricity) || 0) * 0.5;
        const foodVal = formData.dietType === "meat" ? 3000 : formData.dietType === "mixed" ? 2000 : 1000;
        const lifestyleVal = formData.shoppingFrequency === "high" ? 1000 : formData.shoppingFrequency === "moderate" ? 500 : 200;
        
        const total = transportVal + energyVal + foodVal + lifestyleVal;
        setResult(total);

        // Save to DB if logged in
        if (session) {
          startTransition(async () => {
            await saveFootprint({
              transport: transportVal,
              energy: energyVal,
              food: foodVal,
              lifestyle: lifestyleVal,
              total,
            });
            setCurrentStep((prev) => prev + 1);
          });
          return; // Early return to wait for transition
        }
      }
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <GlassCard className="w-full relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
        <motion.div 
          className="h-full bg-brand-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        {/* Sidebar Steps */}
        <div className="hidden md:flex flex-col gap-4 min-w-[200px]">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isPast = index < currentStep
            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isActive ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400" : 
                  isPast ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{step.title}</span>
              </div>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[300px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col justify-between"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                  {steps[currentStep].title}
                </h2>
                
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Weekly car miles driven
                      </label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 150" 
                        value={formData.carMiles}
                        onChange={e => setFormData({...formData, carMiles: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Flights per year
                      </label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 2" 
                        value={formData.flights}
                        onChange={e => setFormData({...formData, flights: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Monthly electricity bill ($)
                      </label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 100" 
                        value={formData.electricity}
                        onChange={e => setFormData({...formData, electricity: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Primary Diet Type
                      </label>
                      <select 
                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        value={formData.dietType}
                        onChange={e => setFormData({...formData, dietType: e.target.value})}
                      >
                        <option value="meat">Meat Heavy</option>
                        <option value="mixed">Mixed / Average</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Shopping Frequency for New Items
                      </label>
                      <select 
                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        value={formData.shoppingFrequency}
                        onChange={e => setFormData({...formData, shoppingFrequency: e.target.value})}
                      >
                        <option value="high">High (Weekly)</option>
                        <option value="moderate">Moderate (Monthly)</option>
                        <option value="low">Low (Rarely)</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-32 h-32 rounded-full bg-brand-500/10 mx-auto flex items-center justify-center mb-6"
                    >
                      <div className="text-4xl font-bold text-brand-600 dark:text-brand-400">
                        {Math.round(result || 0)}
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">kg CO2e per year</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                      Based on your inputs, your estimated carbon footprint is {Math.round(result || 0)} kg CO2e annually. This is just a starting point!
                      {!session && (
                        <span className="block mt-4 text-orange-500 font-medium text-sm">
                          Please log in to save these results to your dashboard.
                        </span>
                      )}
                    </p>
                    {session ? (
                      <Button variant="default" size="lg" className="rounded-full" onClick={() => router.push('/dashboard')}>
                        Go to Dashboard
                      </Button>
                    ) : (
                      <Button variant="default" size="lg" className="rounded-full" onClick={() => signIn()}>
                        Sign In to Save
                      </Button>
                    )}
                  </div>
                )}

              </div>

              {/* Actions */}
              {currentStep < steps.length - 1 && (
                <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    variant="ghost" 
                    onClick={handlePrev} 
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={isPending}
                    className="gap-2 bg-brand-600 hover:bg-brand-700"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : currentStep === steps.length - 2 ? "Calculate Result" : "Next"} 
                    {!isPending && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  )
}

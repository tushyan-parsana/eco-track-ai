import Calculator from "@/components/Calculator";

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-slate-900 dark:text-white">
          Calculate Your Carbon Footprint
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12">
          Find out your environmental impact in less than 2 minutes.
        </p>
        <Calculator />
      </div>
    </main>
  );
}

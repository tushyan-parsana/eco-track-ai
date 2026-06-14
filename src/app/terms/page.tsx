import { Leaf } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | EcoTrack AI",
  description: "Terms and conditions for using EcoTrack AI.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <Leaf className="w-8 h-8 text-brand-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Terms & Conditions
        </h1>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">1. Introduction</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Welcome to EcoTrack AI. By accessing or using our platform, you agree to be bound by these Terms & Conditions. Our service allows you to track, monitor, and reduce your carbon footprint through data-driven insights and AI-powered recommendations.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">2. User Accounts</h2>
          <p className="text-slate-600 dark:text-slate-300">
            You must create an account to use most features of our service. You are responsible for maintaining the confidentiality of your account credentials. All activities that occur under your account are your responsibility.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">3. User Data</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We collect and process your inputs regarding your transportation, home energy use, diet, and lifestyle to estimate your carbon emissions. By submitting this data, you grant us permission to use it to provide personalized recommendations and aggregate community metrics.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">4. Limitation of Liability</h2>
          <p className="text-slate-600 dark:text-slate-300">
            EcoTrack AI provides carbon footprint estimates for educational and motivational purposes only. We make no guarantees regarding the absolute accuracy of the footprint calculations or the effectiveness of the recommended strategies. We shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">5. Changes to Terms</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this site. Your continued use of the service after such changes constitutes your acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  );
}

import { Leaf } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | EcoTrack AI",
  description: "Privacy policy and data handling practices for EcoTrack AI.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/10 rounded-xl">
          <Leaf className="w-8 h-8 text-brand-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300">
            <li><strong>Account Information:</strong> Name, email address, and authentication credentials.</li>
            <li><strong>Sustainability Data:</strong> Inputs related to your transportation habits, home energy bills, diet, and shopping frequency.</li>
            <li><strong>Goals & Achievements:</strong> Goals you set and badges you earn within the platform.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We use the collected data to:
          </p>
          <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300">
            <li>Calculate your estimated carbon footprint.</li>
            <li>Provide personalized, AI-driven recommendations to help you reduce your environmental impact.</li>
            <li>Track your progress over time and award achievements.</li>
            <li>Improve the accuracy and user experience of our platform.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">3. Data Sharing and Security</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We do not sell your personal data to third parties. We use industry-standard security measures, including HTTPS encryption and secure database hosting, to protect your data. Your data is only shared with third-party authentication providers (like Google and GitHub) if you choose to use those services to log in.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">4. Your Rights</h2>
          <p className="text-slate-600 dark:text-slate-300">
            You have the right to access, modify, or permanently delete your personal information and footprint data at any time through your account settings or by contacting our support team.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">5. Contact Us</h2>
          <p className="text-slate-600 dark:text-slate-300">
            If you have any questions about this Privacy Policy, please contact us at privacy@ecotrack.ai.
          </p>
        </section>
      </div>
    </div>
  );
}

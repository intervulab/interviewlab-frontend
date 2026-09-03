import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
      <h1 className="text-center text-4xl font-bold font-[family-name:var(--font-display)]">
        Simple, <span className="text-gradient">transparent</span> pricing
      </h1>
      <p className="mt-4 text-center text-lg text-[var(--color-text-secondary)]">
        Start free. Upgrade when you&apos;re ready to go all-in on your career.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {/* Free Tier */}
        <div className="glass rounded-2xl p-8">
          <h3 className="text-lg font-semibold">Starter</h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">For getting started</p>
          <p className="mt-6 text-4xl font-bold">Free</p>
          <ul className="mt-8 space-y-3 text-sm text-[var(--color-text-secondary)]">
            <li>✓ 3 mock interviews / month</li>
            <li>✓ Basic feedback & scoring</li>
            <li>✓ Resume upload</li>
            <li>✓ Behavioral interview track</li>
          </ul>
        </div>

        {/* Pro Tier */}
        <div className="border-gradient glass rounded-2xl p-8 shadow-[var(--shadow-glow)]">
          <div className="mb-4 inline-block rounded-full bg-[var(--color-brand-600)] px-3 py-1 text-xs font-medium text-white">
            Most Popular
          </div>
          <h3 className="text-lg font-semibold">Pro</h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">For serious prep</p>
          <p className="mt-6 text-4xl font-bold">
            $19<span className="text-lg font-normal text-[var(--color-text-secondary)]">/mo</span>
          </p>
          <ul className="mt-8 space-y-3 text-sm text-[var(--color-text-secondary)]">
            <li>✓ Unlimited mock interviews</li>
            <li>✓ All interview types</li>
            <li>✓ Real-time audio analytics</li>
            <li>✓ System design canvas</li>
            <li>✓ Student Passport tracking</li>
            <li>✓ JD-personalized questions</li>
          </ul>
        </div>

        {/* Team Tier */}
        <div className="glass rounded-2xl p-8">
          <h3 className="text-lg font-semibold">Campus</h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">For placement cells</p>
          <p className="mt-6 text-4xl font-bold">Custom</p>
          <ul className="mt-8 space-y-3 text-sm text-[var(--color-text-secondary)]">
            <li>✓ Everything in Pro</li>
            <li>✓ Cohort analytics dashboard</li>
            <li>✓ Faculty admin panel</li>
            <li>✓ Bulk student onboarding</li>
            <li>✓ Priority support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

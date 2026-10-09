/**
 * Full Plan Page
 * Displays complete 30/60/90 day roadmap and Pro upgrade
 */

import { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES, STORAGE_KEYS } from '../constants/config';
import { Button, Card } from '../components';

const PRO_FEATURES = [
  { title: '180-Day Roadmap', icon: '📅' },
  { title: 'AI Resume Rewrite', icon: '📝' },
  { title: 'Recruiter Triage', icon: '📧' },
  { title: 'Networking Intelligence', icon: '🤝' },
  { title: 'Daily Personalization', icon: '✨' },
  { title: 'Priority Support', icon: '💬' },
];

// True when the stored check-in history already has today's date.
function isCheckedInToday() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHECKIN);
    if (!stored) return false;
    const { history = [] } = JSON.parse(stored);
    const last = history[history.length - 1];
    return Boolean(last && last.date === new Date().toISOString().slice(0, 10));
  } catch (err) {
    return false;
  }
}

function PlanPhase({ title, description, items = [] }) {
  const [open, setOpen] = useState(false);
  const hasItems = items.length > 0;
  const toggle = () => hasItems && setOpen((o) => !o);

  return (
    <Card className="p-6 mb-6">
      <div
        role="button"
        tabIndex={hasItems ? 0 : -1}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (hasItems && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggle();
          }
        }}
        className={hasItems ? 'cursor-pointer' : ''}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-meridian-teal mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          {hasItems && (
            <span className="text-meridian-gold text-2xl flex-shrink-0 leading-none">
              {open ? '−' : '+'}
            </span>
          )}
        </div>
        {hasItems && !open && (
          <p className="text-xs text-meridian-teal mt-3 font-semibold">
            View full report ({items.length} steps) →
          </p>
        )}
      </div>

      {open && hasItems && (
        <ul className="space-y-4 mt-4 border-t border-gray-100 pt-4">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-sm">
              <span className="text-meridian-gold flex-shrink-0">→</span>
              <div>
                <p className="font-medium text-gray-800">
                  {typeof item === 'string' ? item : item.title}
                </p>
                {typeof item !== 'string' && item.description && (
                  <p className="text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                )}
                {typeof item !== 'string' && item.successSignal && (
                  <p className="text-xs text-meridian-teal mt-1">✓ {item.successSignal}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ProUpgradeCard() {
  const handleUpgrade = () => {
    // Placeholder for payment handler
    // In Phase 2: Call startProUpgrade(email, 'monthly')
    alert('Pro upgrade coming soon! For now, the essential plan covers:\n\n✅ 30/60/90 day plan\n✅ Daily check-ins\n✅ Email support\n\nStay tuned for Pro features!');
  };

  return (
    <Card className="bg-gradient-to-br from-meridian-gold/15 to-meridian-teal/5 p-8 mb-6 border-2 border-meridian-gold/50 overflow-hidden relative">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-meridian-gold/10 rounded-full -mr-16 -mt-16" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-block bg-meridian-gold/20 text-meridian-gold px-3 py-1 rounded-full text-xs font-semibold mb-3">
            PREMIUM
          </div>
          <h3 className="text-2xl font-semibold text-meridian-teal mb-2">
            Unlock Your Full Potential
          </h3>
          <p className="text-gray-600">
            Get access to extended roadmaps, AI resume writing, and personalized recruiter matching.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {PRO_FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-2">
              <span className="text-2xl flex-shrink-0">{feature.icon}</span>
              <span className="text-sm text-gray-700 font-medium">{feature.title}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-meridian-gold">$7.99</span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-xs text-gray-500">Cancel anytime. No lock-in period.</p>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleUpgrade}
          className="w-full"
        >
          Upgrade to Pro
        </Button>
      </div>
    </Card>
  );
}

export function FullPlanPage() {
  const { state, setStage } = useOnboarding();
  const plan = state.plan || {};
  const email = state.email;
  const [checkedToday] = useState(isCheckedInToday);

  const thirtyDays = plan.thirtyDays || {};
  const sixtyDays = plan.sixtyDays || {};
  const ninetyDays = plan.ninetyDays || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-meridian-teal/5 to-white px-6 py-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-meridian-teal mb-2">
            Your 30/60/90 Day Roadmap
          </h1>
          <p className="text-gray-600">
            A personalized plan to move from uncertainty to clarity in your next 90 days.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 py-8 max-w-3xl mx-auto">
        {/* Confirmation banner */}
        <div className="bg-meridian-cream rounded-xl p-4 mb-8">
          {email ? (
            <p className="text-sm text-gray-700">
              Check your inbox ✨ Your plan is on its way to <strong>{email}</strong>. (Peek in
              Promotions if you don't see it.)
            </p>
          ) : (
            <p className="text-sm text-gray-700">
              ✨ Your plan is saved on this device. Start your first check-in whenever you're ready.
            </p>
          )}
        </div>

        {/* 30-day phase */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-meridian-gold mb-4">
            Days 1–30: Stabilize & Clarify
          </h2>
          <PlanPhase
            title={thirtyDays.title || 'Days 1–30: Stabilize & Clarify'}
            description={thirtyDays.description || 'Stabilize, reflect, clarify, and establish momentum.'}
            items={thirtyDays.items}
          />
        </div>

        {/* 60-day phase */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-meridian-gold mb-4">
            Days 31–60: Build & Connect
          </h2>
          <PlanPhase
            title={sixtyDays.title || 'Days 31–60: Build & Connect'}
            description={sixtyDays.description || 'Build visibility, relationships, skills, applications, opportunities, or experiments.'}
            items={sixtyDays.items}
          />
        </div>

        {/* 90-day phase */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-meridian-gold mb-4">
            Days 61–90: Accelerate & Decide
          </h2>
          <PlanPhase
            title={ninetyDays.title || 'Days 61–90: Accelerate & Decide'}
            description={ninetyDays.description || 'Accelerate execution, evaluate results, strengthen positioning, and decide next moves.'}
            items={ninetyDays.items}
          />
        </div>

        {/* Pro upgrade section */}
        <div className="mb-12">
          <ProUpgradeCard />
        </div>

        {/* CTA to daily check-in */}
        <div className="text-center py-8">
          {checkedToday ? (
            <>
              <p className="text-meridian-teal font-semibold mb-2">
                You're checked in for today 🎉
              </p>
              <p className="text-gray-600 mb-6">
                Come back tomorrow for your next check-in — we'll be here.
              </p>
              <Button variant="primary" size="lg" disabled className="w-full sm:w-auto">
                Checked in for today ✓
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Ready to get started? Check in each day for personalized guidance.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setStage(ONBOARDING_STAGES.DAILY_CHECKIN)}
              >
                Start my first check-in →
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

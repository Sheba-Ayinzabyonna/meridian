/**
 * Plan Preview Page (Aha Moment)
 * Shows personalized 30-day preview and email capture
 */

import { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES } from '../constants/config';
import { validateEmail } from '../services/meridianApi';
import { Button, Card, TextInput } from '../components';

export function PlanPreviewPage() {
  const { state, setStage, setEmail } = useOnboarding();
  const [emailInput, setEmailInput] = useState(state.email);
  const [emailError, setEmailError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plan = state.plan;
  const preview = plan?.preview || {};
  const actions = preview.actions || [];

  const handleEmailSubmit = () => {
    setEmailError(null);

    if (!emailInput.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(emailInput)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    // In a real scenario, you'd send this to a backend
    setTimeout(() => {
      setEmail(emailInput);
      setStage(ONBOARDING_STAGES.FULL_PLAN);
    }, 500);
  };

  const handleSkip = () => {
    setEmail(emailInput || 'anonymous@meridian.local');
    setStage(ONBOARDING_STAGES.FULL_PLAN);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top section - Preview */}
      <div className="bg-gradient-to-b from-meridian-teal/5 to-white px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold text-meridian-teal mb-8 text-center">
            Here's a glimpse of your first 30 days...
          </h1>

          {/* Action preview cards */}
          <div className="space-y-4 mb-8">
            {actions.length > 0 ? (
              actions.map((action, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex gap-4">
                    <div className="text-2xl flex-shrink-0">
                      {['📝', '🤝', '💪', '🎯', '✨'][idx % 5]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-meridian-teal mb-1">
                        {action.title || `Action ${idx + 1}`}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {action.description || action}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                Your personalized actions are being prepared...
              </p>
            )}
          </div>

          {/* CTA message */}
          <div className="bg-meridian-cream rounded-xl p-6 text-center">
            <p className="text-meridian-teal font-semibold mb-2">
              Your full 90-day plan is ready ✨
            </p>
            <p className="text-gray-700 text-sm">
              Including daily check-ins, milestones, and personalized guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Email capture section */}
      <div className="px-6 py-12 bg-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-meridian-teal mb-2">
            Get your full plan
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            We'll send your complete 30/60/90 roadmap to your inbox.
          </p>

          <TextInput
            label="Your email"
            placeholder="you@example.com"
            type="email"
            value={emailInput}
            onChange={setEmailInput}
            error={emailError}
            required
          />

          {/* Privacy note */}
          <p className="text-xs text-gray-500 mt-4 mb-6">
            We respect your privacy. Your email will only be used to send your plan and optional updates.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleEmailSubmit}
              loading={isSubmitting}
              className="w-full"
            >
              Send my full plan →
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSkip}
              className="w-full"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

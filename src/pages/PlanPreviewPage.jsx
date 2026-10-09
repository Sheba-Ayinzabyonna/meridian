/**
 * Plan Preview Page (Aha Moment)
 * Shows personalized 30-day preview and email capture.
 *
 * "Send my full plan" posts { session_id, email } to WF2 (/email-gate) via
 * VITE_MERIDIAN_EMAIL_WEBHOOK_URL. Whatever happens with the email, the user
 * always gets to see the full plan on screen.
 */

import { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES, STORAGE_KEYS } from '../constants/config';
import { validateEmail } from '../services/meridianApi';
import { Button, Card, TextInput } from '../components';

const EMAIL_WEBHOOK_URL = import.meta.env.VITE_MERIDIAN_EMAIL_WEBHOOK_URL;

function getSessionId(state) {
  return state.plan?.sessionId || localStorage.getItem(STORAGE_KEYS.SESSION_ID) || null;
}

export function PlanPreviewPage() {
  const { state, setStage, setEmail, setEmailed } = useOnboarding();
  const [emailInput, setEmailInput] = useState(state.email || '');
  const [emailError, setEmailError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plan = state.plan;
  const preview = plan?.preview || {};
  const actions = preview.actions || [];

  const showFullPlan = (emailValue, emailed) => {
    if (emailValue) setEmail(emailValue);
    setEmailed(emailed);
    setStage(ONBOARDING_STAGES.FULL_PLAN);
  };

  const handleEmailSubmit = async () => {
    setEmailError(null);
    setNotice(null);

    const email = emailInput.trim();

    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Hmm, that email doesn't look right. Mind checking it?");
      return;
    }

    const sessionId = getSessionId(state);

    // No webhook configured (e.g. Render env var missing): still show the plan.
    if (!EMAIL_WEBHOOK_URL) {
      console.warn('VITE_MERIDIAN_EMAIL_WEBHOOK_URL not configured; skipping email send.');
      showFullPlan(email, false);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, email }),
      });
      const data = await res.json().catch(() => ({ ok: false }));

      if (data.ok) {
        showFullPlan(email, true);
      } else if (data.error === 'invalid_email') {
        setEmailError("Hmm, that email doesn't look right. Mind checking it?");
        setIsSubmitting(false);
      } else if (data.error === 'session_not_found') {
        // Rare: the saved plan expired on the server. Show the plan locally.
        setNotice("We couldn't find your saved plan, but here it is on screen.");
        showFullPlan(email, false);
      } else {
        setNotice("We couldn't send the email just now — but your plan is right here.");
        showFullPlan(email, false);
      }
    } catch (err) {
      console.error('Email send failed:', err);
      setNotice("We couldn't send the email just now — but your plan is right here.");
      showFullPlan(email, false);
    }
  };

  const handleSkip = () => {
    // "Maybe later" never calls the backend; it just shows the stored plan.
    setEmailed(false);
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
            <p className="text-meridian-gold font-semibold text-sm mt-3">
              Free. No credit card, no payment, just your email.
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
            No credit card required. Ever. We only use your email to send your plan.
          </p>

          {notice && (
            <p className="text-xs text-meridian-teal bg-meridian-cream rounded-lg px-3 py-2 mb-6">
              {notice}
            </p>
          )}

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

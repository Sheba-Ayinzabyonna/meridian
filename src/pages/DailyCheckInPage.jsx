/**
 * Daily Check-In Page
 * Frontend-only check-in built from the plan already saved in localStorage.
 * Opt-in box -> mood -> today's one thing -> Done. No backend calls.
 */

import { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES, STORAGE_KEYS } from '../constants/config';
import { Button, Card, TextInput } from '../components';

const MOODS = [
  { id: 'rough', emoji: '😩', label: 'Rough' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'good', emoji: '💪', label: 'Good' },
];

const AFFIRMATIONS = {
  rough: [
    'Every big change has small, wobbly days. You showed up anyway.',
    "This is a marathon, not a sprint. Progress over perfection.",
    'Take a breath. Tomorrow is a fresh start.',
  ],
  okay: [
    "You're showing up. That counts for something real.",
    'Steady wins. Keep going.',
    "You're exactly where you need to be right now.",
  ],
  good: [
    "You've got momentum. Keep riding it.",
    'This is what momentum feels like. Hold onto it.',
    "You're building something. See yourself doing it.",
  ],
};

const todayKey = () => new Date().toISOString().slice(0, 10);

function loadCheckin(email) {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHECKIN);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { history: [], day: 1, consent: false, ...parsed };
    }
  } catch (err) {
    console.warn('Could not read check-in state:', err);
  }
  return { email: email || '', consent: false, consent_at: null, day: 1, history: [], started: false };
}

// Build the action queue once: the 3 "start now" actions, then the Day 1-30 actions.
function buildQueue(plan) {
  if (!plan) return [];
  const preview = (plan.preview?.actions || []).map((a) => ({
    title: a.title,
    detail: a.description,
  }));
  const phase30 = (plan.thirtyDays?.items || []).map((a) => ({
    title: typeof a === 'string' ? a : a.title,
    detail: typeof a === 'string' ? '' : a.description,
  }));
  return [...preview, ...phase30].filter((a) => a.title);
}

export function DailyCheckInPage() {
  const { state, setStage } = useOnboarding();
  const [checkin, setCheckin] = useState(() => loadCheckin(state.email));
  const [phase, setPhase] = useState(() => {
    const record = loadCheckin(state.email);
    const last = record.history[record.history.length - 1];
    if (last && last.date === todayKey()) return 'done';
    return record.started ? 'mood' : 'optin';
  });
  const [emailInput, setEmailInput] = useState(state.email || '');
  const [consent, setConsent] = useState(false);
  const [mood, setMood] = useState(null);

  const plan = state.plan;
  const queue = buildQueue(plan);

  const save = (next) => {
    setCheckin(next);
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKIN, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not save check-in:', err);
    }
  };

  const handleStart = () => {
    save({
      ...checkin,
      email: emailInput.trim(),
      consent: consent,
      consent_at: consent ? new Date().toISOString() : checkin.consent_at,
      started: true,
    });
    setPhase('mood');
  };

  const handleMood = (id) => {
    setMood(id);
    setPhase('action');
  };

  const dayIndex = Math.min(Math.max(checkin.day, 1) - 1, Math.max(queue.length - 1, 0));
  const todayAction = queue[dayIndex] || {
    title: "Take one small step toward your plan today.",
    detail: '',
  };
  const affirmation = mood
    ? AFFIRMATIONS[mood][Math.floor(Math.random() * AFFIRMATIONS[mood].length)]
    : null;

  const handleDone = () => {
    const next = {
      ...checkin,
      day: checkin.day + 1,
      history: [
        ...checkin.history,
        { date: todayKey(), mood, action: todayAction.title },
      ],
    };
    save(next);
    setPhase('done');
  };

  // No plan available (e.g. someone lands here directly).
  if (!plan || queue.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-meridian-teal/5 to-white px-6 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-semibold text-meridian-teal mb-4">
            Let's build your plan first
          </h1>
          <p className="text-gray-600 mb-8">
            Once your 30/60/90 plan is ready, your daily check-in unlocks here.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => setStage(ONBOARDING_STAGES.WELCOME)}
          >
            Start over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-meridian-teal/5 to-white px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="text-center mb-10">
          <p className="text-sm text-gray-500 mb-2">Day {checkin.day} of 90</p>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-meridian-gold transition-all duration-300"
              style={{ width: `${Math.min((checkin.day / 90) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Step 0: opt-in box */}
        {phase === 'optin' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-meridian-teal text-center">
              Start your first check-in
            </h1>
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                A quick daily nudge, built from your plan. Totally optional.
              </p>
              <TextInput
                label="Your email"
                placeholder="you@example.com"
                type="email"
                value={emailInput}
                onChange={setEmailInput}
              />
              <label className="flex items-start gap-3 mt-4 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>Yes, email me check-in reminders after my first report.</span>
              </label>
              <p className="text-xs text-gray-500 mt-3">
                No email yet? That's fine — you can still do your check-in on screen.
              </p>
            </Card>
            <Button variant="primary" size="lg" className="w-full" onClick={handleStart}>
              Start my check-in →
            </Button>
          </div>
        )}

        {/* Step 1: mood */}
        {phase === 'mood' && (
          <>
            <h1 className="text-2xl font-semibold text-meridian-teal mb-8 text-center">
              How are you feeling today?
            </h1>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {MOODS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleMood(option.id)}
                  className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-gray-200 hover:border-meridian-gold hover:bg-meridian-gold/5 transition-all active:scale-95"
                >
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: today's one thing -> Done */}
        {phase === 'action' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">You're feeling</p>
              <div className="text-5xl">{MOODS.find((m) => m.id === mood)?.emoji}</div>
            </div>

            <Card className="p-6 bg-gradient-to-br from-meridian-cream to-white">
              <p className="text-center text-gray-800 italic leading-relaxed">{affirmation}</p>
            </Card>

            {mood === 'rough' && (
              <p className="text-center text-sm text-meridian-teal font-medium">
                Small step today: just do the first 10 minutes.
              </p>
            )}

            <Card className="p-6 bg-gradient-to-br from-meridian-gold/10 to-transparent border-meridian-gold/30">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Today's one thing
              </p>
              <p className="text-meridian-teal font-medium leading-relaxed">
                {todayAction.title}
              </p>
              {todayAction.detail && (
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {todayAction.detail}
                </p>
              )}
            </Card>

            <Button variant="primary" size="lg" className="w-full" onClick={handleDone}>
              Done ✓
            </Button>
          </div>
        )}

        {/* Step 3: done for today */}
        {phase === 'done' && (
          <div className="text-center space-y-6 pt-6">
            <div className="text-5xl">🎉</div>
            <h1 className="text-2xl font-semibold text-meridian-teal">
              You're checked in for today
            </h1>
            <p className="text-gray-600">Come back tomorrow for your next step.</p>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => setStage(ONBOARDING_STAGES.FULL_PLAN)}
            >
              Back to my plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

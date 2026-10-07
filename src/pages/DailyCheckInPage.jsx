/**
 * Daily Check-In Page
 * One-question-at-a-time check-in experience
 */

import { useState } from 'react';
import { Button, Card } from '../components';

const FEELING_SCALE = [
  { id: 'struggling', emoji: '😔', label: 'Struggling' },
  { id: 'okay', emoji: '😌', label: 'Okay' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'great', emoji: '🔥', label: 'Great' },
];

const AFFIRMATIONS = {
  struggling: [
    "Every big change has small moments of doubt. You're doing better than you think.",
    "This is a marathon, not a sprint. Progress over perfection.",
    "Take a breath. Tomorrow is a fresh start.",
  ],
  okay: [
    "You're showing up. That counts for something real.",
    "Steady wins. Keep going.",
    "You're exactly where you need to be right now.",
  ],
  good: [
    "You've got momentum. Keep riding it.",
    "This is what momentum feels like. Hold onto it.",
    "You're building something. See yourself doing it.",
  ],
  great: [
    "This is it. This is what clarity feels like.",
    "You're unstoppable. Remember this feeling.",
    "Keep this energy. You're onto something.",
  ],
};

export function DailyCheckInPage() {
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [dayNumber] = useState(1); // In real app, would calculate this

  const affirmation = selectedFeeling
    ? AFFIRMATIONS[selectedFeeling][
        Math.floor(Math.random() * AFFIRMATIONS[selectedFeeling].length)
      ]
    : null;

  const handleFeelingSelect = (feelingId) => {
    setSelectedFeeling(feelingId);
    setShowAffirmation(true);
  };

  const handleContinue = () => {
    // Reset for next day
    setSelectedFeeling(null);
    setShowAffirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-meridian-teal/5 to-white px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-2">Day {dayNumber} of 90</p>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-meridian-gold transition-all duration-300"
              style={{ width: `${(dayNumber / 90) * 100}%` }}
            />
          </div>
        </div>

        {!showAffirmation ? (
          <>
            {/* Question */}
            <h1 className="text-2xl font-semibold text-meridian-teal mb-8 text-center">
              How are you feeling today?
            </h1>

            {/* Feeling scale */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {FEELING_SCALE.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleFeelingSelect(option.id)}
                  className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-gray-200 hover:border-meridian-gold hover:bg-meridian-gold/5 transition-all active:scale-95"
                >
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Affirmation section */}
            <div className="space-y-8">
              {/* Feeling confirmation */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">You're feeling</p>
                <div className="text-5xl">
                  {FEELING_SCALE.find((f) => f.id === selectedFeeling)?.emoji}
                </div>
              </div>

              {/* Affirmation card */}
              <Card className="p-8 bg-gradient-to-br from-meridian-cream to-white">
                <p className="text-center text-gray-800 italic leading-relaxed text-lg">
                  "{affirmation}"
                </p>
              </Card>

              {/* Today's focus */}
              <Card className="p-6 bg-gradient-to-br from-meridian-gold/10 to-transparent border-meridian-gold/30">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Today's Focus
                </p>
                <p className="text-meridian-teal font-medium leading-relaxed">
                  Send one thoughtful message to a former colleague you trust.
                </p>
              </Card>

              {/* CTA */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinue}
                className="w-full"
              >
                Got it, let's go →
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

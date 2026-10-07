/**
 * Building Plan Page
 * Shows animated loading state while API processes intake
 * Respects prefers-reduced-motion
 */

import { useEffect, useState, useRef } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES } from '../constants/config';
import { submitIntakeToPlan } from '../services/meridianApi';
import { CompassRose, ErrorState } from '../components';

const LOADING_MESSAGES = [
  'Reading your story…',
  'Mapping where you\'ve been…',
  'Finding your strengths in there…',
  'Sketching your first 30 days…',
  'Making something beautiful…',
  'Pouring a coffee while this comes together ☕',
  'Just wrapping up…',
  'So close…',
];

export function BuildingPlanPage() {
  const { state, setStage, setPlan, setApiStatus, setApiError } = useOnboarding();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const messageIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Start message rotation every 8 seconds
    if (!showFinalMessage) {
      messageIntervalRef.current = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 8000);
    }

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [showFinalMessage]);

  // After 60 seconds, show final message and stop cycling
  useEffect(() => {
    if (elapsedSeconds === 60) {
      setShowFinalMessage(true);
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    }
  }, [elapsedSeconds]);

  // Submit intake to API
  useEffect(() => {
    const submitIntake = async () => {
      try {
        setApiStatus('loading');
        const plan = await submitIntakeToPlan(state.intake);
        setPlan(plan);
        setApiStatus('success');
        setStage(ONBOARDING_STAGES.PLAN_PREVIEW);
      } catch (error) {
        setApiStatus('error');
        setApiError(error.message || 'Failed to generate plan');
      }
    };

    submitIntake();
  }, []);

  const handleRetry = () => {
    setElapsedSeconds(0);
    setCurrentMessage(0);
    setShowFinalMessage(false);
    setApiStatus('idle');
    setApiError(null);

    // Resubmit
    const submitIntake = async () => {
      try {
        setApiStatus('loading');
        const plan = await submitIntakeToPlan(state.intake);
        setPlan(plan);
        setApiStatus('success');
        setStage(ONBOARDING_STAGES.PLAN_PREVIEW);
      } catch (error) {
        setApiStatus('error');
        setApiError(error.message || 'Failed to generate plan');
      }
    };

    submitIntake();
  };

  if (state.apiStatus === 'error') {
    return (
      <div className="min-h-screen bg-meridian-teal flex items-center justify-center px-6">
        <div className="max-w-md">
          <ErrorState onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-meridian-teal to-meridian-teal flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated compass */}
      <div className="mb-12">
        <CompassRose
          animated={!prefersReducedMotion}
          className="w-32 h-32 text-meridian-gold"
        />
      </div>

      {/* Main message */}
      <div className="text-center max-w-md space-y-8">
        <h1 className="text-2xl font-semibold text-white">
          You've got this. Meridian is building your plan now.
        </h1>

        {/* Rotating messages */}
        <div className="h-12 flex items-center justify-center">
          <p
            className="text-lg text-meridian-cream transition-opacity duration-500"
            key={currentMessage}
          >
            {showFinalMessage
              ? 'Good plans take a minute. Yours is almost here.'
              : LOADING_MESSAGES[currentMessage]}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="text-sm text-meridian-cream/70">
          {elapsedSeconds < 60
            ? `Generating plan... (${elapsedSeconds}s)`
            : 'Final touches...'}
        </div>
      </div>
    </div>
  );
}

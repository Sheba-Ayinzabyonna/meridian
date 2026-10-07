/**
 * AppHeader Component
 * Top navigation with reset option (appears after welcome)
 */

import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES } from '../constants/config';
import { MeridianLogo } from './MeridianLogo';

export function AppHeader() {
  const { state, resetOnboarding, setStage } = useOnboarding();

  // Only show header after welcome screen
  if (state.currentStage === ONBOARDING_STAGES.WELCOME) {
    return null;
  }

  const handleResetJourney = () => {
    if (
      window.confirm(
        'This will clear your current progress. Are you sure you want to start over?'
      )
    ) {
      resetOnboarding();
      setStage(ONBOARDING_STAGES.WELCOME);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="cursor-pointer"
          onClick={() => setStage(ONBOARDING_STAGES.WELCOME)}
          role="button"
          tabIndex={0}
          title="Return to welcome"
        >
          <MeridianLogo size="sm" className="text-2xl" />
        </div>

        {/* Menu */}
        <button
          onClick={handleResetJourney}
          className="text-sm font-medium text-gray-500 hover:text-meridian-teal transition-colors py-2 px-3 rounded-lg hover:bg-gray-100"
          title="Start a new journey"
        >
          Start Over
        </button>
      </div>
    </header>
  );
}

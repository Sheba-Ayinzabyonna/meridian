/**
 * Intake Section 5 - One More Thing
 * Final questions: 90-day win and additional context
 */

import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES } from '../constants/config';
import { FormSection, TextArea } from '../components';

export function IntakeSection5Page() {
  const { state, setStage, updateGoal } = useOnboarding();
  const { goal } = state.intake;

  const handleWinChange = (value) => {
    updateGoal({ ninetyDayWin: value });
  };

  const handleContextChange = (value) => {
    updateGoal({ additionalContext: value });
  };

  const handleNext = () => {
    if (goal.ninetyDayWin) {
      // Submit to API
      setStage(ONBOARDING_STAGES.BUILDING_PLAN);
    }
  };

  const handleBack = () => {
    setStage(ONBOARDING_STAGES.INTAKE_4);
  };

  const isComplete = goal.ninetyDayWin.trim().length > 0;

  return (
    <FormSection
      title="One more thing"
      subtitle="These final answers help Meridian personalize your plan."
      currentSection={5}
      totalSections={5}
      showBackButton={true}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isComplete}
    >
      {/* 90-day win */}
      <TextArea
        label="What would make the next 90 days feel like a win?"
        placeholder="e.g., Landing a role that excites me, shipping my first consulting project, gaining clarity about my next chapter..."
        value={goal.ninetyDayWin}
        onChange={handleWinChange}
        rows={4}
        required
      />

      {/* Additional context */}
      <TextArea
        label="Anything else Meridian should know?"
        placeholder="Optional — share anything that might help personalize your plan"
        value={goal.additionalContext}
        onChange={handleContextChange}
        rows={3}
      />

      {/* Privacy notice */}
      <div className="bg-meridian-cream rounded-lg p-4 text-sm text-gray-600">
        <p>
          Your answers are safe with us. They're used only to build your personalized plan and won't be shared without your consent.
        </p>
      </div>
    </FormSection>
  );
}

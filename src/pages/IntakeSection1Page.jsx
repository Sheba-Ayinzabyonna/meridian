/**
 * Intake Section 1 - What happened?
 * Collects transition reason, timing, and emotional state
 */

import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES, TRANSITION_REASONS, TIME_SINCE, EMOTIONS } from '../constants/config';
import { FormSection, Chip } from '../components';

export function IntakeSection1Page() {
  const { state, setStage, updateTransition } = useOnboarding();
  const { transition } = state.intake;

  const handleTransitionReasonChange = (reason) => {
    const newReasons = transition.reason.includes(reason)
      ? transition.reason.filter((r) => r !== reason)
      : [...transition.reason, reason];
    updateTransition({ reason: newReasons });
  };

  const handleTimeSinceChange = (time) => {
    updateTransition({ timeSince: time });
  };

  const handleFeelingChange = (feeling) => {
    updateTransition({ feeling });
  };

  const handleNext = () => {
    if (transition.reason.length > 0 && transition.timeSince && transition.feeling) {
      setStage(ONBOARDING_STAGES.INTAKE_2);
    }
  };

  const handleBack = () => {
    setStage(ONBOARDING_STAGES.WELCOME);
  };

  const isComplete =
    transition.reason.length > 0 && transition.timeSince && transition.feeling;

  return (
    <FormSection
      title="What brought you here?"
      subtitle="Tell me where you are. No resume needed — just the truth."
      currentSection={1}
      totalSections={5}
      showBackButton={true}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isComplete}
    >
      {/* Transition reason */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          What brought you here? <span className="text-meridian-coral">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {TRANSITION_REASONS.map((reason) => (
            <Chip
              key={reason}
              label={reason}
              selected={transition.reason.includes(reason)}
              onClick={() => handleTransitionReasonChange(reason)}
            />
          ))}
        </div>
      </div>

      {/* Time since transition */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          How long ago did it happen? <span className="text-meridian-coral">*</span>
        </label>
        <div className="space-y-2">
          {TIME_SINCE.map((option) => (
            <label key={option.id} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-meridian-gold transition-colors">
              <input
                type="radio"
                name="timeSince"
                value={option.id}
                checked={transition.timeSince === option.id}
                onChange={() => handleTimeSinceChange(option.id)}
                className="w-4 h-4 accent-meridian-gold"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Emotional state */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          How are you feeling about it? <span className="text-meridian-coral">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EMOTIONS.map((emotion) => (
            <Chip
              key={emotion.id}
              label={emotion.label}
              emoji={emotion.emoji}
              selected={transition.feeling === emotion.id}
              onClick={() => handleFeelingChange(emotion.id)}
            />
          ))}
        </div>
      </div>
    </FormSection>
  );
}

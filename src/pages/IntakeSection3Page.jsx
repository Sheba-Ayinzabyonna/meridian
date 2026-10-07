/**
 * Intake Section 3 - What do you want next?
 * Collects desired work arrangements, priorities, and constraints
 */

import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES, OPEN_TO_OPTIONS, PRIORITIES } from '../constants/config';
import { FormSection, TextInput, Chip } from '../components';

const MAX_PRIORITIES = 3;

export function IntakeSection3Page() {
  const { state, setStage, updateNextStep } = useOnboarding();
  const { nextStep } = state.intake;

  const handleOpenToChange = (option) => {
    const newOpenTo = nextStep.openTo.includes(option)
      ? nextStep.openTo.filter((o) => o !== option)
      : [...nextStep.openTo, option];
    updateNextStep({ openTo: newOpenTo });
  };

  const handlePriorityChange = (priority) => {
    const alreadySelected = nextStep.priorities.includes(priority);
    let newPriorities;

    if (alreadySelected) {
      newPriorities = nextStep.priorities.filter((p) => p !== priority);
    } else if (nextStep.priorities.length < MAX_PRIORITIES) {
      newPriorities = [...nextStep.priorities, priority];
    } else {
      return; // Silently ignore if max reached
    }

    updateNextStep({ priorities: newPriorities });
  };

  const handleAvoidChange = (value) => {
    updateNextStep({ avoid: value });
  };

  const handleNext = () => {
    if (nextStep.openTo.length > 0 && nextStep.priorities.length > 0) {
      setStage(ONBOARDING_STAGES.INTAKE_4);
    }
  };

  const handleBack = () => {
    setStage(ONBOARDING_STAGES.INTAKE_2);
  };

  const isComplete = nextStep.openTo.length > 0 && nextStep.priorities.length > 0;
  const remainingPriorities = MAX_PRIORITIES - nextStep.priorities.length;

  return (
    <FormSection
      title="What do you want next?"
      subtitle="This is the most important section. Be honest — even if the answer is 'I don't know yet.'"
      currentSection={3}
      totalSections={5}
      showBackButton={true}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isComplete}
    >
      {/* Open to options */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          What are you open to? <span className="text-meridian-coral">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {OPEN_TO_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={nextStep.openTo.includes(option)}
              onClick={() => handleOpenToChange(option)}
            />
          ))}
        </div>
      </div>

      {/* Priorities - max 3 */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-2">
          What matters most to you in what's next? <span className="text-meridian-coral">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-4">
          Pick up to 3. {remainingPriorities === 0 ? 'Max reached.' : `${remainingPriorities} left.`}
        </p>
        <div className="flex flex-wrap gap-3">
          {PRIORITIES.map((priority) => (
            <Chip
              key={priority}
              label={priority}
              selected={nextStep.priorities.includes(priority)}
              onClick={() => handlePriorityChange(priority)}
              disabled={!nextStep.priorities.includes(priority) && remainingPriorities === 0}
            />
          ))}
        </div>
      </div>

      {/* What to avoid */}
      <TextInput
        label="Is there anything you absolutely don't want?"
        placeholder="e.g., No more 80-hour weeks, no toxic cultures"
        value={nextStep.avoid}
        onChange={handleAvoidChange}
      />
    </FormSection>
  );
}

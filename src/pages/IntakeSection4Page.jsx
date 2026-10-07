/**
 * Intake Section 4 - Energy Check
 * Collects bandwidth, networking comfort, and job search focus
 */

import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES, TIME_AVAILABLE, NETWORKING_COMFORT, JOB_SEARCH_STATUS } from '../constants/config';
import { FormSection } from '../components';

export function IntakeSection4Page() {
  const { state, setStage, updateEnergy } = useOnboarding();
  const { energy } = state.intake;

  const handleTimeChange = (time) => {
    updateEnergy({ availableTime: time });
  };

  const handleNetworkingChange = (comfort) => {
    updateEnergy({ networkingComfort: comfort });
  };

  const handleFocusChange = (focus) => {
    updateEnergy({ focus });
  };

  const handleNext = () => {
    if (energy.availableTime && energy.networkingComfort && energy.focus) {
      setStage(ONBOARDING_STAGES.INTAKE_5);
    }
  };

  const handleBack = () => {
    setStage(ONBOARDING_STAGES.INTAKE_3);
  };

  const isComplete = energy.availableTime && energy.networkingComfort && energy.focus;

  return (
    <FormSection
      title="Energy check"
      subtitle="Honest answers help Meridian give you a realistic plan — not an aspirational one that burns you out by week 2."
      currentSection={4}
      totalSections={5}
      showBackButton={true}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isComplete}
    >
      {/* Available time */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          How much time can you realistically give this right now? <span className="text-meridian-coral">*</span>
        </label>
        <div className="space-y-2">
          {TIME_AVAILABLE.map((option) => (
            <label key={option.id} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-meridian-gold transition-colors">
              <input
                type="radio"
                name="availableTime"
                value={option.id}
                checked={energy.availableTime === option.id}
                onChange={() => handleTimeChange(option.id)}
                className="w-4 h-4 accent-meridian-gold"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Networking comfort */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          What's your networking comfort level? <span className="text-meridian-coral">*</span>
        </label>
        <div className="space-y-2">
          {NETWORKING_COMFORT.map((option) => (
            <label key={option.id} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-meridian-gold transition-colors">
              <input
                type="radio"
                name="networkingComfort"
                value={option.id}
                checked={energy.networkingComfort === option.id}
                onChange={() => handleNetworkingChange(option.id)}
                className="w-4 h-4 accent-meridian-gold"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Job search focus */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          Are you job searching, building something, or both? <span className="text-meridian-coral">*</span>
        </label>
        <div className="space-y-2">
          {JOB_SEARCH_STATUS.map((option) => (
            <label key={option.id} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-meridian-gold transition-colors">
              <input
                type="radio"
                name="focus"
                value={option.id}
                checked={energy.focus === option.id}
                onChange={() => handleFocusChange(option.id)}
                className="w-4 h-4 accent-meridian-gold"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </FormSection>
  );
}

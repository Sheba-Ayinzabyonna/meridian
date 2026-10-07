/**
 * Intake Section 2 - Who are you professionally?
 * Collects background, industry, and level
 */

import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES, INDUSTRIES, PROFESSIONAL_LEVELS } from '../constants/config';
import { FormSection, TextInput, Chip } from '../components';

export function IntakeSection2Page() {
  const { state, setStage, updateProfessional } = useOnboarding();
  const { professional } = state.intake;

  const handleBackgroundChange = (value) => {
    updateProfessional({ background: value });
  };

  const handleIndustryChange = (industry) => {
    const newIndustries = professional.industries.includes(industry)
      ? professional.industries.filter((i) => i !== industry)
      : [...professional.industries, industry];
    updateProfessional({ industries: newIndustries });
  };

  const handleLevelChange = (level) => {
    updateProfessional({ level });
  };

  const handleNext = () => {
    if (professional.background && professional.industries.length > 0 && professional.level) {
      setStage(ONBOARDING_STAGES.INTAKE_3);
    }
  };

  const handleBack = () => {
    setStage(ONBOARDING_STAGES.INTAKE_1);
  };

  const isComplete =
    professional.background &&
    professional.industries.length > 0 &&
    professional.level;

  return (
    <FormSection
      title="Who are you professionally?"
      subtitle="Not your LinkedIn headline. The real version."
      currentSection={2}
      totalSections={5}
      showBackButton={true}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={!isComplete}
    >
      {/* Background */}
      <TextInput
        label="What's your professional background?"
        placeholder="e.g., Enterprise architect, 20 years in tech"
        value={professional.background}
        onChange={handleBackgroundChange}
        required
      />

      {/* Industry/function */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          What industry or function? <span className="text-meridian-coral">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {INDUSTRIES.map((industry) => (
            <Chip
              key={industry}
              label={industry}
              selected={professional.industries.includes(industry)}
              onClick={() => handleIndustryChange(industry)}
            />
          ))}
        </div>
      </div>

      {/* Professional level */}
      <div>
        <label className="block text-sm font-semibold text-meridian-teal mb-4">
          What level were you operating at? <span className="text-meridian-coral">*</span>
        </label>
        <div className="space-y-2">
          {PROFESSIONAL_LEVELS.map((level) => (
            <label key={level} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-meridian-gold transition-colors">
              <input
                type="radio"
                name="level"
                value={level}
                checked={professional.level === level}
                onChange={() => handleLevelChange(level)}
                className="w-4 h-4 accent-meridian-gold"
              />
              <span className="ml-3 text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>
    </FormSection>
  );
}

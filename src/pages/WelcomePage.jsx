/**
 * Welcome Screen
 * First impression - warm, calm, encouraging
 */

import { useOnboarding } from '../context/OnboardingContext';
import { ONBOARDING_STAGES } from '../constants/config';
import { MeridianLogo, CompassRose, Button } from '../components';

export function WelcomePage() {
  const { setStage } = useOnboarding();

  const handleStartOnboarding = () => {
    setStage(ONBOARDING_STAGES.INTAKE_1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-meridian-teal to-meridian-teal relative overflow-hidden">
      {/* Subtle compass watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
        <CompassRose className="w-96 h-96" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-md space-y-8">
          {/* Logo and tagline */}
          <div className="space-y-3">
            <MeridianLogo size="md" />
            <p className="italic text-meridian-gold text-lg leading-relaxed">
              Find your next point of reference.
            </p>
          </div>

          {/* Main headline */}
          <div className="space-y-4">
            <h2 className="text-4xl font-semibold text-white leading-tight">
              How are you doing, really?
            </h2>
            <p className="text-meridian-cream text-lg leading-relaxed">
              Whatever brought you here — a layoff, a leap, a long time coming — you landed in the right place. This might feel like an ending.
            </p>
            <p className="text-meridian-cream text-lg leading-relaxed">
              It's actually a beginning.
            </p>
          </div>

          {/* Quote */}
          <div className="bg-meridian-teal/50 backdrop-blur-sm rounded-xl p-6 border border-meridian-gold/20">
            <p className="italic text-meridian-cream text-base leading-relaxed">
              "Career shifts open doors you didn't know existed. Time to breathe. Space to build. Permission to finally do the thing."
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartOnboarding}
              className="w-full"
            >
              Let's go →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

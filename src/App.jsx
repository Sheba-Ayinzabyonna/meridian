/**
 * Main App Component
 * Routes to the appropriate page based on onboarding stage
 */

import { useOnboarding } from './context/OnboardingContext';
import { ONBOARDING_STAGES } from './constants/config';
import { AppHeader } from './components/AppHeader';
import {
  WelcomePage,
  IntakeSection1Page,
  IntakeSection2Page,
  IntakeSection3Page,
  IntakeSection4Page,
  IntakeSection5Page,
  BuildingPlanPage,
  PlanPreviewPage,
  FullPlanPage,
  DailyCheckInPage,
} from './pages';

function App() {
  const { state } = useOnboarding();

  const pageMap = {
    [ONBOARDING_STAGES.WELCOME]: <WelcomePage />,
    [ONBOARDING_STAGES.INTAKE_1]: <IntakeSection1Page />,
    [ONBOARDING_STAGES.INTAKE_2]: <IntakeSection2Page />,
    [ONBOARDING_STAGES.INTAKE_3]: <IntakeSection3Page />,
    [ONBOARDING_STAGES.INTAKE_4]: <IntakeSection4Page />,
    [ONBOARDING_STAGES.INTAKE_5]: <IntakeSection5Page />,
    [ONBOARDING_STAGES.BUILDING_PLAN]: <BuildingPlanPage />,
    [ONBOARDING_STAGES.PLAN_PREVIEW]: <PlanPreviewPage />,
    [ONBOARDING_STAGES.FULL_PLAN]: <FullPlanPage />,
    [ONBOARDING_STAGES.DAILY_CHECKIN]: <DailyCheckInPage />,
  };

  return (
    <div className="antialiased bg-white">
      <AppHeader />
      {pageMap[state.currentStage] || <WelcomePage />}
    </div>
  );
}

export default App;

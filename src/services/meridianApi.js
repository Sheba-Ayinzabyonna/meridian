/**
 * Meridian API Service
 * Handles all communication with n8n webhooks and backend services
 */

const API_TIMEOUT = 180000; // 180 seconds

/**
 * Builds the intake payload in the format expected by n8n
 */
export function buildIntakePayload(intakeData) {
  return {
    transition: {
      reason: intakeData.transition.reason,
      timeSince: intakeData.transition.timeSince,
      feeling: intakeData.transition.feeling,
    },
    professional: {
      background: intakeData.professional.background,
      industries: intakeData.professional.industries,
      level: intakeData.professional.level,
    },
    nextStep: {
      openTo: intakeData.nextStep.openTo,
      priorities: intakeData.nextStep.priorities,
      avoid: intakeData.nextStep.avoid,
    },
    energy: {
      availableTime: intakeData.energy.availableTime,
      networkingComfort: intakeData.energy.networkingComfort,
      focus: intakeData.energy.focus,
    },
    goal: {
      ninetyDayWin: intakeData.goal.ninetyDayWin,
      additionalContext: intakeData.goal.additionalContext,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Normalizes n8n webhook response into the application's internal plan model
 */
export function normalizePlanResponse(response) {
  if (!response) {
    throw new Error('Invalid response from plan generator');
  }

  // Handle different possible response structures from n8n
  const planData = typeof response === 'string' ? JSON.parse(response) : response;

  return {
    preview: {
      title: planData.preview?.title || 'Here\'s a glimpse of your first 30 days...',
      message: planData.preview?.message || 'Your full 90-day plan is ready — including actionable steps, goals, and checkpoints.',
      actions: Array.isArray(planData.preview?.actions) ? planData.preview.actions : [],
    },
    thirtyDays: {
      title: planData.thirtyDays?.title || 'Days 1–30: Stabilize & Clarify',
      description: planData.thirtyDays?.description || 'Stabilize, reflect, clarify, and establish momentum.',
      items: Array.isArray(planData.thirtyDays?.items) ? planData.thirtyDays.items : [],
    },
    sixtyDays: {
      title: planData.sixtyDays?.title || 'Days 31–60: Build & Connect',
      description: planData.sixtyDays?.description || 'Build visibility, relationships, skills, applications, opportunities, or experiments.',
      items: Array.isArray(planData.sixtyDays?.items) ? planData.sixtyDays.items : [],
    },
    ninetyDays: {
      title: planData.ninetyDays?.title || 'Days 61–90: Accelerate & Decide',
      description: planData.ninetyDays?.description || 'Accelerate execution, evaluate results, strengthen positioning, and decide next moves.',
      items: Array.isArray(planData.ninetyDays?.items) ? planData.ninetyDays.items : [],
    },
    dailyCheckins: {
      affirmations: Array.isArray(planData.dailyCheckins?.affirmations) ? planData.dailyCheckins.affirmations : [],
      focusAreas: Array.isArray(planData.dailyCheckins?.focusAreas) ? planData.dailyCheckins.focusAreas : [],
    },
  };
}

/**
 * Submits intake data to n8n webhook and returns the generated plan
 * Supports mock data in development mode
 */
export async function submitIntakeToPlan(intakeData) {
  // Support mock data for testing without n8n
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    const { getMockPlan } = await import('./mockData.js');
    logApiResponse('MOCK_DATA', 'Using mock data for testing');
    return getMockPlan(intakeData);
  }

  const webhookUrl = import.meta.env.VITE_MERIDIAN_PLAN_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('VITE_MERIDIAN_PLAN_WEBHOOK_URL not configured');
    // Fallback to mock data if no webhook configured in dev
    if (import.meta.env.DEV) {
      const { getMockPlan } = await import('./mockData.js');
      console.warn('No webhook URL configured. Using mock data for development.');
      return getMockPlan(intakeData);
    }
    throw new Error('API configuration missing. Please set VITE_MERIDIAN_PLAN_WEBHOOK_URL in .env');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const payload = buildIntakePayload(intakeData);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    logApiResponse('SUCCESS', data);
    return normalizePlanResponse(data);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('API request timeout after 180 seconds');
      throw new Error('Request timeout');
    }

    console.error('API error:', error.message);
    throw error;
  }
}

/**
 * Validates email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * In development, logs API responses; in production, only logs errors
 */
export function logApiResponse(type, data) {
  if (import.meta.env.DEV) {
    console.log(`[API ${type}]`, data);
  }
}

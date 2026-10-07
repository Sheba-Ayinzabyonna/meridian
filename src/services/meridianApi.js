/**
 * Meridian API Service
 * Handles all communication with n8n webhooks and backend services
 */

const API_TIMEOUT = 180000; // 180 seconds

import {
  EMOTIONS,
  TIME_SINCE,
  TIME_AVAILABLE,
  NETWORKING_COMFORT,
  JOB_SEARCH_STATUS,
} from '../constants/config.js';

// Turns an option id (e.g. 'recently') into its human label for Claude
const labelFor = (list, id) => list.find((o) => o.id === id)?.label || id || '';

/**
 * Builds the intake payload in the format expected by n8n WF1
 * (flat snake_case fields, human-readable labels)
 */
export function buildIntakePayload(intakeData) {
  const { transition, professional, nextStep, energy, goal } = intakeData;
  return {
    transition_types: transition.reason,
    time_since: labelFor(TIME_SINCE, transition.timeSince),
    feeling: labelFor(EMOTIONS, transition.feeling),
    background: professional.background,
    industries: professional.industries,
    level: professional.level,
    open_to: nextStep.openTo,
    priorities: nextStep.priorities,
    dealbreakers: nextStep.avoid || '',
    bandwidth: labelFor(TIME_AVAILABLE, energy.availableTime),
    networking_comfort: labelFor(NETWORKING_COMFORT, energy.networkingComfort),
    mode: labelFor(JOB_SEARCH_STATUS, energy.focus),
    win_90: goal.ninetyDayWin,
    anything_else: goal.additionalContext || '',
  };
}

/**
 * Normalizes the n8n WF1 response into the app's internal plan model.
 * n8n returns: { session_id, headline, preview: [{title, why}], plan: {...} }
 */
export function normalizePlanResponse(response) {
  if (!response) {
    throw new Error('Invalid response from plan generator');
  }
  const data = typeof response === 'string' ? JSON.parse(response) : response;

  if (data.session_id) {
    localStorage.setItem('meridian_session_id', data.session_id);
  }

  const plan = data.plan || {};
  const phase = (n) => (plan.phases || []).find((p) => Number(p.phase) === n) || {};
  const items = (p) =>
    (p.actions || []).map((a) => ({
      title: a.title,
      description: a.detail,
      successSignal: a.success_signal,
    }));
  const p30 = phase(30);
  const p60 = phase(60);
  const p90 = phase(90);

  return {
    sessionId: data.session_id,
    headline: data.headline,
    preview: {
      title: data.headline || "Here's a glimpse of your first 30 days...",
      message: 'Your full 90-day plan is ready — including actionable steps, goals, and checkpoints.',
      actions: (data.preview || []).map((a) => ({ title: a.title, description: a.why })),
    },
    thirtyDays: {
      title: p30.theme ? `Days 1–30: ${p30.theme}` : 'Days 1–30: Stabilize & Clarify',
      description: (p30.quick || []).join(' · '),
      items: items(p30),
    },
    sixtyDays: {
      title: p60.theme ? `Days 31–60: ${p60.theme}` : 'Days 31–60: Build & Connect',
      description: (p60.quick || []).join(' · '),
      items: items(p60),
    },
    ninetyDays: {
      title: p90.theme ? `Days 61–90: ${p90.theme}` : 'Days 61–90: Accelerate & Decide',
      description: (p90.quick || []).join(' · '),
      items: items(p90),
    },
    winCheck: plan.win_check,
    networkingAdvice: plan.networking_advice,
    recruiterGuidance: plan.recruiter_guidance,
    warnings: plan.warnings || [],
    dailyCheckins: { affirmations: [], focusAreas: [] },
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
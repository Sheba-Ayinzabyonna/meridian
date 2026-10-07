import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { STORAGE_KEYS, ONBOARDING_STAGES } from '../constants/config.js';

export const OnboardingContext = createContext();

const initialState = {
  currentStage: ONBOARDING_STAGES.WELCOME,
  intake: {
    transition: {
      reason: [],
      timeSince: '',
      feeling: '',
    },
    professional: {
      background: '',
      industries: [],
      level: '',
    },
    nextStep: {
      openTo: [],
      priorities: [],
      avoid: '',
    },
    energy: {
      availableTime: '',
      networkingComfort: '',
      focus: '',
    },
    goal: {
      ninetyDayWin: '',
      additionalContext: '',
    },
  },
  plan: null,
  email: '',
  apiStatus: 'idle', // idle, loading, success, error
  apiError: null,
  sessionId: null,
};

function onboardingReducer(state, action) {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, currentStage: action.payload };

    case 'UPDATE_INTAKE':
      return {
        ...state,
        intake: {
          ...state.intake,
          ...action.payload,
        },
      };

    case 'UPDATE_TRANSITION':
      return {
        ...state,
        intake: {
          ...state.intake,
          transition: {
            ...state.intake.transition,
            ...action.payload,
          },
        },
      };

    case 'UPDATE_PROFESSIONAL':
      return {
        ...state,
        intake: {
          ...state.intake,
          professional: {
            ...state.intake.professional,
            ...action.payload,
          },
        },
      };

    case 'UPDATE_NEXT_STEP':
      return {
        ...state,
        intake: {
          ...state.intake,
          nextStep: {
            ...state.intake.nextStep,
            ...action.payload,
          },
        },
      };

    case 'UPDATE_ENERGY':
      return {
        ...state,
        intake: {
          ...state.intake,
          energy: {
            ...state.intake.energy,
            ...action.payload,
          },
        },
      };

    case 'UPDATE_GOAL':
      return {
        ...state,
        intake: {
          ...state.intake,
          goal: {
            ...state.intake.goal,
            ...action.payload,
          },
        },
      };

    case 'SET_PLAN':
      return { ...state, plan: action.payload };

    case 'SET_EMAIL':
      return { ...state, email: action.payload };

    case 'SET_API_STATUS':
      return {
        ...state,
        apiStatus: action.payload,
        apiError: action.payload === 'error' ? state.apiError : null,
      };

    case 'SET_API_ERROR':
      return { ...state, apiStatus: 'error', apiError: action.payload };

    case 'RESET_ONBOARDING':
      return initialState;

    case 'RESTORE_STATE':
      return action.payload;

    default:
      return state;
  }
}

export function OnboardingProvider({ children }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    const dataToStore = {
      intake: state.intake,
      currentStage: state.currentStage,
      email: state.email,
      plan: state.plan,
      sessionId: state.sessionId,
    };
    sessionStorage.setItem(STORAGE_KEYS.INTAKE_DATA, JSON.stringify(dataToStore));
  }, [state.intake, state.currentStage, state.email, state.plan, state.sessionId]);

  // Restore state from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.INTAKE_DATA);
    if (stored) {
      const restoredData = JSON.parse(stored);
      dispatch({
        type: 'RESTORE_STATE',
        payload: {
          ...state,
          ...restoredData,
        },
      });
    }
  }, []);

  const setStage = useCallback((stage) => {
    dispatch({ type: 'SET_STAGE', payload: stage });
  }, []);

  const updateTransition = useCallback((data) => {
    dispatch({ type: 'UPDATE_TRANSITION', payload: data });
  }, []);

  const updateProfessional = useCallback((data) => {
    dispatch({ type: 'UPDATE_PROFESSIONAL', payload: data });
  }, []);

  const updateNextStep = useCallback((data) => {
    dispatch({ type: 'UPDATE_NEXT_STEP', payload: data });
  }, []);

  const updateEnergy = useCallback((data) => {
    dispatch({ type: 'UPDATE_ENERGY', payload: data });
  }, []);

  const updateGoal = useCallback((data) => {
    dispatch({ type: 'UPDATE_GOAL', payload: data });
  }, []);

  const setPlan = useCallback((plan) => {
    dispatch({ type: 'SET_PLAN', payload: plan });
  }, []);

  const setEmail = useCallback((email) => {
    dispatch({ type: 'SET_EMAIL', payload: email });
  }, []);

  const setApiStatus = useCallback((status) => {
    dispatch({ type: 'SET_API_STATUS', payload: status });
  }, []);

  const setApiError = useCallback((error) => {
    dispatch({ type: 'SET_API_ERROR', payload: error });
  }, []);

  const resetOnboarding = useCallback(() => {
    dispatch({ type: 'RESET_ONBOARDING' });
    sessionStorage.removeItem(STORAGE_KEYS.INTAKE_DATA);
  }, []);

  const value = {
    state,
    setStage,
    updateTransition,
    updateProfessional,
    updateNextStep,
    updateEnergy,
    updateGoal,
    setPlan,
    setEmail,
    setApiStatus,
    setApiError,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = React.useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

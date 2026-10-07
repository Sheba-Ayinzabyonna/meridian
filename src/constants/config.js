// Brand colors
export const COLORS = {
  PRIMARY_TEAL: '#0D4F5C',
  ACCENT_GOLD: '#C9A84C',
  BACKGROUND_CREAM: '#F8F4EC',
  ALERT_CORAL: '#E8A9A1',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_DARK: '#1F2937',
  BORDER_LIGHT: '#E5E7EB',
  SUCCESS: '#10B981',
};

// Emotions for feeling selection
export const EMOTIONS = [
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😔' },
  { id: 'unsure', label: 'Unsure', emoji: '😕' },
  { id: 'relieved', label: 'Relieved', emoji: '😌' },
  { id: 'curious', label: 'Curious', emoji: '🤔' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌱' },
  { id: 'ready', label: 'Ready', emoji: '🔥' },
];

// Intake form options
export const TRANSITION_REASONS = [
  'Layoff',
  'Restructure',
  'Burnout exit',
  'Career pivot',
  'Promotion or new role',
  'Left by choice',
  'Returning to work',
  'Something else',
];

export const TIME_SINCE = [
  { id: 'just-happened', label: 'Just happened (0–2 weeks)' },
  { id: 'recently', label: 'Recently (2–8 weeks)' },
  { id: 'a-while', label: 'A little while ago (2–6 months)' },
  { id: 'long-ago', label: 'A while back (6+ months)' },
];

export const PROFESSIONAL_LEVELS = [
  'Early career',
  'Individual contributor',
  'Manager/Team lead',
  'Director/Senior Director',
  'VP/SVP',
  'C-Suite/Executive',
  'Founder/Entrepreneur',
];

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Legal',
  'Marketing',
  'Operations',
  'HR/People',
  'Consulting',
  'Education',
  'Nonprofit',
  'Other',
];

export const OPEN_TO_OPTIONS = [
  'Full-time role (same field)',
  'Full-time role (new field)',
  'Consulting/Fractional',
  'Starting something of my own',
  'Taking a beat before deciding',
  'All of the above',
];

export const PRIORITIES = [
  'Income',
  'Flexibility/remote',
  'Mission/impact',
  'Leadership opportunity',
  'Learning something new',
  'Stability',
  'Autonomy',
  'Being part of a great team',
];

export const TIME_AVAILABLE = [
  { id: 'low', label: 'A few hours a week (low bandwidth)' },
  { id: 'medium', label: 'A solid half-day most days' },
  { id: 'high', label: 'Full time — this IS my job right now' },
];

export const NETWORKING_COMFORT = [
  { id: 'low', label: "I'd rather not (introverted/burnt out)" },
  { id: 'medium', label: 'I can do it but it takes energy' },
  { id: 'high', label: 'I actually enjoy it' },
  { id: 'very-high', label: "I'm a connector — put me in a room" },
];

export const JOB_SEARCH_STATUS = [
  { id: 'searching', label: 'Actively job searching' },
  { id: 'building', label: 'Building something (consulting, startup, side project)' },
  { id: 'both', label: 'Both simultaneously' },
  { id: 'figuring-out', label: 'Still figuring it out' },
];

export const ONBOARDING_STAGES = {
  WELCOME: 'welcome',
  INTAKE_1: 'intake-1',
  INTAKE_2: 'intake-2',
  INTAKE_3: 'intake-3',
  INTAKE_4: 'intake-4',
  INTAKE_5: 'intake-5',
  BUILDING_PLAN: 'building-plan',
  PLAN_PREVIEW: 'plan-preview',
  EMAIL_CAPTURE: 'email-capture',
  FULL_PLAN: 'full-plan',
  DAILY_CHECKIN: 'daily-checkin',
};

export const STORAGE_KEYS = {
  INTAKE_DATA: 'meridian_intake_data',
  PLAN_DATA: 'meridian_plan_data',
  EMAIL: 'meridian_email',
  CURRENT_STAGE: 'meridian_stage',
  SESSION_ID: 'meridian_session_id',
};

// Central status metadata for the To-Do feature, mirroring the pattern in
// statusConfig.js. Status stored as a string (not a number) since todos are
// a newer, unrelated collection with no legacy numeric values to preserve.
export const TODO_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const TODO_STATUS_ORDER = [TODO_STATUS.PENDING, TODO_STATUS.IN_PROGRESS, TODO_STATUS.COMPLETED];

export const TODO_STATUS_META = {
  [TODO_STATUS.PENDING]: {
    label: 'Pending',
    light: { bg: '#FEF3C7', color: '#B45309' },
    dark: { bg: 'rgba(217,119,6,0.20)', color: '#fbbf24' },
    solid: '#D97706',
  },
  [TODO_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    light: { bg: '#DBEAFE', color: '#1D4ED8' },
    dark: { bg: 'rgba(29,78,216,0.22)', color: '#93c5fd' },
    solid: '#1D4ED8',
  },
  [TODO_STATUS.COMPLETED]: {
    label: 'Completed',
    light: { bg: '#DCFCE7', color: '#15803D' },
    dark: { bg: 'rgba(74,222,128,0.18)', color: '#86efac' },
    solid: '#15803D',
  },
};

export function getTodoStatusMeta(status) {
  return TODO_STATUS_META[status] || TODO_STATUS_META[TODO_STATUS.PENDING];
}

export function getTodoStatusLabel(status) {
  return getTodoStatusMeta(status).label;
}

export const TODO_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// High-to-low, matching the order shown in the priority dropdown.
export const TODO_PRIORITY_ORDER = [TODO_PRIORITY.HIGH, TODO_PRIORITY.MEDIUM, TODO_PRIORITY.LOW];

// Ascending sort weight — lower sorts first, so High tasks float to the top
// of a column when due dates tie.
export const TODO_PRIORITY_WEIGHT = {
  [TODO_PRIORITY.HIGH]: 0,
  [TODO_PRIORITY.MEDIUM]: 1,
  [TODO_PRIORITY.LOW]: 2,
};

export const TODO_PRIORITY_META = {
  [TODO_PRIORITY.HIGH]: {
    label: 'High',
    light: { bg: '#FEE2E2', color: '#B91C1C' },
    dark: { bg: 'rgba(248,113,113,0.22)', color: '#fca5a5' },
    solid: '#DC2626',
  },
  [TODO_PRIORITY.MEDIUM]: {
    label: 'Medium',
    light: { bg: '#FEF3C7', color: '#B45309' },
    dark: { bg: 'rgba(217,119,6,0.18)', color: '#fbbf24' },
    solid: '#D97706',
  },
  [TODO_PRIORITY.LOW]: {
    label: 'Low',
    light: { bg: '#DBEAFE', color: '#1D4ED8' },
    dark: { bg: 'rgba(29,78,216,0.20)', color: '#93c5fd' },
    solid: '#1D4ED8',
  },
};

export function getTodoPriorityMeta(priority) {
  return TODO_PRIORITY_META[priority] || TODO_PRIORITY_META[TODO_PRIORITY.MEDIUM];
}

export function getTodoPriorityLabel(priority) {
  return getTodoPriorityMeta(priority).label;
}

// Urgency accents, layered on top of status color when a due date needs
// attention. Kept visually distinct from TODO_STATUS_META (which colors the
// task's stage) so a card can flag "this needs attention" independently of
// "this hasn't been started yet".
export const TODO_URGENCY_META = {
  overdue: {
    label: 'Overdue',
    light: { bg: '#FEE2E2', color: '#B91C1C' },
    dark: { bg: 'rgba(248,113,113,0.22)', color: '#fca5a5' },
    solid: '#DC2626',
  },
  'due-today': {
    label: 'Due today',
    light: { bg: '#FFEDD5', color: '#C2410C' },
    dark: { bg: 'rgba(251,146,60,0.22)', color: '#fdba74' },
    solid: '#EA580C',
  },
  'due-soon': {
    label: 'Due soon',
    light: { bg: '#FEF3C7', color: '#B45309' },
    dark: { bg: 'rgba(217,119,6,0.18)', color: '#fbbf24' },
    solid: '#D97706',
  },
};

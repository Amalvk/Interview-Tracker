// Central status metadata. Numeric values MUST stay in sync with existing
// Firestore documents (initialStatus is stored as a number).
// NO_RESPONSE is 7 (not 5.5) so existing 1-6 values already stored in
// Firestore keep meaning what they always meant — display/pipeline order is
// controlled separately by ACTIVE_STATUS_ORDER below, not by numeric value.
export const STATUS = {
  APPLIED: 1,
  HR_ROUND: 2,
  TECHNICAL_ROUND: 3,
  MANAGEMENT_ROUND: 4,
  OFFER_RECEIVED: 5,
  UNCRACKED: 6,
  NO_RESPONSE: 7,
};

// Order shown in selects / pipeline view (excludes the terminal "Uncracked" bucket).
export const ACTIVE_STATUS_ORDER = [
  STATUS.APPLIED,
  STATUS.HR_ROUND,
  STATUS.TECHNICAL_ROUND,
  STATUS.MANAGEMENT_ROUND,
  STATUS.NO_RESPONSE,
  STATUS.OFFER_RECEIVED,
];

export const STATUS_META = {
  [STATUS.APPLIED]: {
    label: 'Applied',
    light: { bg: '#E2E8F0', color: '#334155' },
    dark: { bg: 'rgba(148,163,184,0.18)', color: '#cbd5e1' },
  },
  [STATUS.HR_ROUND]: {
    label: 'HR Round',
    light: { bg: '#EDE9FE', color: '#6D28D9' },
    dark: { bg: 'rgba(167,139,250,0.18)', color: '#c4b5fd' },
  },
  [STATUS.TECHNICAL_ROUND]: {
    label: 'Technical Round',
    light: { bg: '#E0E7FF', color: '#4338CA' },
    dark: { bg: 'rgba(129,140,248,0.18)', color: '#a5b4fc' },
  },
  [STATUS.MANAGEMENT_ROUND]: {
    label: 'Management Round',
    light: { bg: '#CCFBF1', color: '#0F766E' },
    dark: { bg: 'rgba(45,212,191,0.18)', color: '#5eead4' },
  },
  [STATUS.NO_RESPONSE]: {
    label: 'No Response',
    light: { bg: '#FEF3C7', color: '#92400E' },
    dark: { bg: 'rgba(251,191,36,0.18)', color: '#fcd34d' },
  },
  [STATUS.OFFER_RECEIVED]: {
    label: 'Offer Received',
    light: { bg: '#DCFCE7', color: '#15803D' },
    dark: { bg: 'rgba(74,222,128,0.18)', color: '#86efac' },
  },
  [STATUS.UNCRACKED]: {
    label: 'Uncracked',
    light: { bg: '#FEE2E2', color: '#B91C1C' },
    dark: { bg: 'rgba(248,113,113,0.18)', color: '#fca5a5' },
  },
};

export function getStatusMeta(status) {
  return STATUS_META[status] || STATUS_META[STATUS.APPLIED];
}

export function getStatusLabel(status) {
  return getStatusMeta(status).label;
}

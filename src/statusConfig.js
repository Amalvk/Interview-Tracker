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

// The in-progress pipeline stages. Shown in the Active Interviews status
// filter and the Dashboard pipeline chart. "Applied" was dropped — every
// tracked interview already implies an application, so the pipeline starts
// at HR Round. Offer Received, Uncracked and No Response are terminal
// outcomes handled by their own sections (Cracked / Uncracked) instead of
// living in this list.
export const ACTIVE_STATUS_ORDER = [
  STATUS.HR_ROUND,
  STATUS.TECHNICAL_ROUND,
  STATUS.MANAGEMENT_ROUND,
];

// Statuses that land an interview in the "Uncracked" section.
export const UNCRACKED_STATUSES = [STATUS.UNCRACKED, STATUS.NO_RESPONSE];

// Every status, in the order shown in the Edit Interview form — the only
// place status can be changed. The in-progress stages first, then the
// terminal outcomes. APPLIED is kept out (no longer offered going forward)
// but its STATUS_META entry stays so any legacy record still renders fine.
export const ALL_STATUS_ORDER = [
  ...ACTIVE_STATUS_ORDER,
  STATUS.NO_RESPONSE,
  STATUS.OFFER_RECEIVED,
  STATUS.UNCRACKED,
];

// The pipeline breakdown shown on the Dashboard: in-progress stages plus
// No Response. Cracked and Uncracked each have their own headline stat card
// / dedicated section, so they aren't repeated here.
export const PIPELINE_STATUS_ORDER = [...ACTIVE_STATUS_ORDER, STATUS.NO_RESPONSE];

export function isActiveStage(status) {
  return ACTIVE_STATUS_ORDER.includes(status);
}

export function isCrackedStatus(status) {
  return status === STATUS.OFFER_RECEIVED;
}

export function isUncrackedStatus(status) {
  return UNCRACKED_STATUSES.includes(status);
}

// `solid` is a single mode-invariant hex per status — used wherever a color
// needs to work as a filled shape rather than text-on-tint (the Dashboard
// pipeline chart, and the status dropdown's colored options). This set of
// five (HR/Technical/Management/No Response/Uncracked) was run through the
// dataviz skill's categorical-palette validator for both light and dark
// chart surfaces — every adjacent pair clears the CVD and normal-vision
// separation floors. Don't hand-pick a replacement without re-validating.
export const STATUS_META = {
  [STATUS.APPLIED]: {
    label: 'Applied',
    light: { bg: '#DBEAFE', color: '#1D4ED8' },
    dark: { bg: 'rgba(96,165,250,0.18)', color: '#93c5fd' },
    solid: '#1D4ED8',
  },
  [STATUS.HR_ROUND]: {
    label: 'HR Round',
    light: { bg: '#DBEAFE', color: '#1D4ED8' },
    dark: { bg: 'rgba(29,78,216,0.22)', color: '#93c5fd' },
    solid: '#1D4ED8',
  },
  [STATUS.TECHNICAL_ROUND]: {
    label: 'Technical Round',
    light: { bg: '#CFFAFE', color: '#0E7490' },
    dark: { bg: 'rgba(34,211,238,0.20)', color: '#67e8f9' },
    solid: '#0891B2',
  },
  [STATUS.MANAGEMENT_ROUND]: {
    label: 'Management Round',
    light: { bg: '#DCFCE7', color: '#166534' },
    dark: { bg: 'rgba(34,197,94,0.20)', color: '#4ade80' },
    solid: '#16A34A',
  },
  [STATUS.NO_RESPONSE]: {
    label: 'No Response',
    light: { bg: '#FEF3C7', color: '#B45309' },
    dark: { bg: 'rgba(217,119,6,0.20)', color: '#fbbf24' },
    solid: '#D97706',
  },
  [STATUS.OFFER_RECEIVED]: {
    label: 'Offer Received',
    light: { bg: '#DCFCE7', color: '#15803D' },
    dark: { bg: 'rgba(74,222,128,0.18)', color: '#86efac' },
    solid: '#15803D',
  },
  [STATUS.UNCRACKED]: {
    label: 'Uncracked',
    light: { bg: '#FFE4E6', color: '#BE123C' },
    dark: { bg: 'rgba(190,18,60,0.20)', color: '#fb7185' },
    solid: '#BE123C',
  },
};

export function getStatusMeta(status) {
  return STATUS_META[status] || STATUS_META[STATUS.APPLIED];
}

export function getStatusLabel(status) {
  return getStatusMeta(status).label;
}

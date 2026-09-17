import { formatDistanceToNow } from 'date-fns';
import { ACTIVE_STATUS_ORDER, STATUS } from '../statusConfig';

// Pipeline position, not the raw stored number — STATUS.UNCRACKED (6) and
// STATUS.NO_RESPONSE (7) sit outside the 1-4 contiguous range on purpose so
// existing Firestore values never had to be renumbered.
function statusRank(status) {
  const index = ACTIVE_STATUS_ORDER.indexOf(status);
  if (index !== -1) return index;
  return status === STATUS.UNCRACKED ? ACTIVE_STATUS_ORDER.length : ACTIVE_STATUS_ORDER.length + 1;
}

// Best-effort timestamp for an interview: prefer the explicit updatedAt/createdAt
// fields (added going forward) and fall back to the legacy applicationDate string
// so older records keep sorting/displaying sensibly.
export function getEffectiveTimestamp(item, field = 'updatedAt') {
  const iso = field === 'updatedAt' ? item.updatedAt || item.createdAt : item.createdAt;
  if (iso) {
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (item.applicationDate) {
    const d = new Date(item.applicationDate);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date(0);
}

export function formatRelativeTime(item, field = 'updatedAt') {
  const date = getEffectiveTimestamp(item, field);
  if (date.getTime() === 0) return '—';
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '—';
  }
}

export const SORT_OPTIONS = [
  { value: 'recentlyUpdated', label: 'Recently Updated' },
  { value: 'recentlyAdded', label: 'Recently Added' },
  { value: 'companyAsc', label: 'Company Name A-Z' },
  { value: 'companyDesc', label: 'Company Name Z-A' },
  { value: 'status', label: 'Status' },
];

export function sortInterviews(list, sortKey) {
  const items = [...list];
  switch (sortKey) {
    case 'recentlyAdded':
      return items.sort(
        (a, b) => getEffectiveTimestamp(b, 'createdAt') - getEffectiveTimestamp(a, 'createdAt'),
      );
    case 'companyAsc':
      return items.sort((a, b) => (a.companyName || '').localeCompare(b.companyName || ''));
    case 'companyDesc':
      return items.sort((a, b) => (b.companyName || '').localeCompare(a.companyName || ''));
    case 'status':
      return items.sort((a, b) => statusRank(a.initialStatus) - statusRank(b.initialStatus));
    case 'recentlyUpdated':
    default:
      return items.sort(
        (a, b) => getEffectiveTimestamp(b, 'updatedAt') - getEffectiveTimestamp(a, 'updatedAt'),
      );
  }
}

export function matchesSearch(item, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const notesText = Array.isArray(item.commentList)
    ? item.commentList.map((c) => c.text).join(' ')
    : item.comments || '';
  const haystack = [
    item.companyName,
    item.position,
    item.contactName,
    item.contactEmail,
    item.skills,
    notesText,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

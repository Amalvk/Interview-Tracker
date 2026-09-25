import { formatDistanceToNow } from 'date-fns';
import { ACTIVE_STATUS_ORDER, STATUS } from '../statusConfig';

// Default display order before the sort control is touched: most-advanced
// stage first (Management → Technical → HR) — the reverse of the pipeline's
// natural progression order. On Hold is appended last on purpose: it's a
// paused interview, not active progress, so it should always sink to the
// bottom of the Active Interviews list regardless of its last-updated date.
const DEFAULT_STATUS_ORDER = [...ACTIVE_STATUS_ORDER].reverse().concat(STATUS.ON_HOLD);

function defaultStatusRank(status) {
  const index = DEFAULT_STATUS_ORDER.indexOf(status);
  return index === -1 ? DEFAULT_STATUS_ORDER.length : index;
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
    // date-fns prefixes approximate durations with "about" (e.g. "about 2
    // months ago") — drop it for a terser, cleaner label.
    return formatDistanceToNow(date, { addSuffix: true }).replace(/^about /, '');
  } catch {
    return '—';
  }
}

// Sorts by last-updated date only. `direction` is 'desc' (newest first,
// the default) or 'asc' (oldest first) — toggled via a single icon button
// rather than a field-picking dropdown.
export function sortInterviews(list, direction = 'desc') {
  const items = [...list].sort(
    (a, b) => getEffectiveTimestamp(b, 'updatedAt') - getEffectiveTimestamp(a, 'updatedAt'),
  );
  return direction === 'asc' ? items.reverse() : items;
}

// The list's initial order before anyone touches the sort toggle: grouped by
// stage (Management → Technical → HR), newest-updated first within each
// stage. Once the sort icon is clicked, callers switch to sortInterviews().
export function sortByDefaultOrder(list) {
  return [...list].sort((a, b) => {
    const rankDiff = defaultStatusRank(a.initialStatus) - defaultStatusRank(b.initialStatus);
    if (rankDiff !== 0) return rankDiff;
    return getEffectiveTimestamp(b, 'updatedAt') - getEffectiveTimestamp(a, 'updatedAt');
  });
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
    item.location,
    item.position,
    item.platform,
    item.platformOther,
    item.contactName,
    item.contactEmail,
    item.contactNumber,
    item.skills,
    notesText,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

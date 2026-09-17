import { formatDistanceToNow } from 'date-fns';

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

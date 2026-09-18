import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns';
import { TODO_PRIORITY_WEIGHT, TODO_STATUS, TODO_STATUS_ORDER } from '../todoConfig';

export function parseDueDate(dueDate) {
  if (!dueDate) return null;
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : new Date(dueDate);
  return isValid(d) ? d : null;
}

function startOfToday() {
  return new Date(new Date().toDateString());
}

// Buckets a todo by how urgently it needs attention. Completed tasks and
// tasks without a due date never need attention, no matter how old they are.
export function getDueMeta(todo) {
  if (todo.status === TODO_STATUS.COMPLETED) {
    return { kind: 'completed', daysDiff: null, label: null };
  }

  const due = parseDueDate(todo.dueDate);
  if (!due) {
    return { kind: 'none', daysDiff: null, label: null };
  }

  const daysDiff = differenceInCalendarDays(due, startOfToday());

  if (daysDiff < 0) {
    const overdueDays = Math.abs(daysDiff);
    return { kind: 'overdue', daysDiff, label: `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}` };
  }
  if (daysDiff === 0) {
    return { kind: 'due-today', daysDiff, label: 'Due today' };
  }
  if (daysDiff <= 2) {
    return { kind: 'due-soon', daysDiff, label: `Due in ${daysDiff} day${daysDiff === 1 ? '' : 's'}` };
  }
  return { kind: 'upcoming', daysDiff, label: null };
}

const URGENCY_RANK = {
  overdue: 0,
  'due-today': 1,
  'due-soon': 2,
  upcoming: 3,
  none: 3,
  completed: 4,
};

function priorityRank(todo) {
  return TODO_PRIORITY_WEIGHT[todo.priority] ?? TODO_PRIORITY_WEIGHT.medium;
}

// Surfaces what needs attention first: most-overdue, then due-today, then
// due-soon, then everything else by soonest due date (priority breaks ties),
// with completed tasks pushed to the bottom.
export function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    const aMeta = getDueMeta(a);
    const bMeta = getDueMeta(b);
    const rankDiff = URGENCY_RANK[aMeta.kind] - URGENCY_RANK[bMeta.kind];
    if (rankDiff !== 0) return rankDiff;

    if (aMeta.kind === 'completed') {
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    }

    const aDue = parseDueDate(a.dueDate);
    const bDue = parseDueDate(b.dueDate);
    if (aDue && bDue) {
      const dueDiff = aDue.getTime() - bDue.getTime();
      if (dueDiff !== 0) return dueDiff;
    } else if (aDue || bDue) {
      return aDue ? -1 : 1;
    }

    const priorityDiff = priorityRank(a) - priorityRank(b);
    if (priorityDiff !== 0) return priorityDiff;

    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

// Groups todos into their board columns, each pre-sorted by urgency, due
// date and priority.
export function groupTodosByStatus(todos) {
  const sorted = sortTodos(todos);
  return TODO_STATUS_ORDER.reduce((acc, status) => {
    acc[status] = sorted.filter((t) => t.status === status);
    return acc;
  }, {});
}

export function matchesTodoSearch(todo, query) {
  if (!query?.trim()) return true;
  const q = query.trim().toLowerCase();
  return (todo.title || '').toLowerCase().includes(q) || (todo.description || '').toLowerCase().includes(q);
}

export function formatDueDate(dueDate) {
  const d = parseDueDate(dueDate);
  return d ? format(d, 'MMM d, yyyy') : 'No due date';
}

import { seedUsers } from '../data/users';
import { seedAssignments } from '../data/assignments';

const KEYS = {
  USER: 'assignmenthub_currentUser',
  ASSIGNMENTS: 'assignmenthub_assignments',
  USERS: 'assignmenthub_users',
  INITIALIZED: 'assignmenthub_initialized',
};

export function initializeStorage() {
  if (localStorage.getItem(KEYS.INITIALIZED)) {
    return;
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(seedAssignments));
  localStorage.setItem(KEYS.INITIALIZED, 'true');
}

export function resetDemoData() {
  localStorage.removeItem(KEYS.USER);
  localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(seedAssignments));
  localStorage.setItem(KEYS.INITIALIZED, 'true');
}

export function getCurrentUser() {
  const raw = localStorage.getItem(KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(KEYS.USER);
    return;
  }
  const { password: _, ...safe } = user;
  localStorage.setItem(KEYS.USER, JSON.stringify(safe));
}

export function removeCurrentUser() {
  localStorage.removeItem(KEYS.USER);
}

export function getUsers() {
  const raw = localStorage.getItem(KEYS.USERS);
  if (!raw) return [...seedUsers];
  try {
    return JSON.parse(raw);
  } catch {
    return [...seedUsers];
  }
}

export function getAssignments() {
  const raw = localStorage.getItem(KEYS.ASSIGNMENTS);
  if (!raw) return [...seedAssignments];
  try {
    return JSON.parse(raw);
  } catch {
    return [...seedAssignments];
  }
}

export function saveAssignments(assignments) {
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
}

export function updateSubmission(assignmentId, studentId, submittedAt) {
  const assignments = getAssignments();
  const index = assignments.findIndex((a) => a.id === assignmentId);
  if (index === -1) return null;

  const updated = { ...assignments[index] };
  updated.submissions = {
    ...updated.submissions,
    [studentId]: {
      submitted: true,
      submittedAt,
    },
  };

  const next = [...assignments];
  next[index] = updated;
  saveAssignments(next);
  return updated;
}

export function isValidDriveUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function formatDisplayDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate.includes('T') ? isoDate : `${isoDate}T12:00:00`);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

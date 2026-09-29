import { seedUsers } from '../data/users';
import { seedCourses } from '../data/courses';
import { seedGroups } from '../data/groups';
import { seedAssignments } from '../data/assignments';

const KEYS = {
  USER: 'assignmenthub_currentUser',
  ASSIGNMENTS: 'assignmenthub_assignments',
  USERS: 'assignmenthub_users',
  COURSES: 'assignmenthub_courses',
  GROUPS: 'assignmenthub_groups',
  INITIALIZED_V2: 'assignmenthub_v2_initialized',
};

export function initializeStorage() {
  if (localStorage.getItem(KEYS.INITIALIZED_V2)) {
    return;
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
  localStorage.setItem(KEYS.COURSES, JSON.stringify(seedCourses));
  localStorage.setItem(KEYS.GROUPS, JSON.stringify(seedGroups));
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(seedAssignments));
  localStorage.setItem(KEYS.INITIALIZED_V2, 'true');
}

export function resetDemoData() {
  localStorage.removeItem(KEYS.USER);
  localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
  localStorage.setItem(KEYS.COURSES, JSON.stringify(seedCourses));
  localStorage.setItem(KEYS.GROUPS, JSON.stringify(seedGroups));
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(seedAssignments));
  localStorage.setItem(KEYS.INITIALIZED_V2, 'true');
}

export function getCurrentUser() {
  const raw = localStorage.getItem(KEYS.USER);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    // Normalize role so admin behaves as professor
    if (user && user.role === 'admin') {
      user.role = 'professor';
    }
    return user;
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
  if (safe.role === 'admin') {
    safe.role = 'professor';
  }
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

export function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getCourses() {
  const raw = localStorage.getItem(KEYS.COURSES);
  if (!raw) return [...seedCourses];
  try {
    return JSON.parse(raw);
  } catch {
    return [...seedCourses];
  }
}

export function saveCourses(courses) {
  localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
}

export function getGroups() {
  const raw = localStorage.getItem(KEYS.GROUPS);
  if (!raw) return [...seedGroups];
  try {
    return JSON.parse(raw);
  } catch {
    return [...seedGroups];
  }
}

export function saveGroups(groups) {
  localStorage.setItem(KEYS.GROUPS, JSON.stringify(groups));
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

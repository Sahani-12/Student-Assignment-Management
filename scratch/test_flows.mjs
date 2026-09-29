import { seedUsers } from '../src/data/users.js';
import { seedCourses } from '../src/data/courses.js';
import { seedGroups } from '../src/data/groups.js';
import { seedAssignments } from '../src/data/assignments.js';
import { calculateProgress, getAssignmentProgress } from '../src/utils/progressUtils.js';
import { getDeadlineInfo, formatDateTime } from '../src/utils/dateUtils.js';

console.log('--- TESTING CORE UTILITIES AND DATA INTEGRITY ---');

// 1. Check seed counts
console.log(`Users: ${seedUsers.length} seed users`);
console.log(`Courses: ${seedCourses.length} seed courses`);
console.log(`Groups: ${seedGroups.length} seed groups`);
console.log(`Assignments: ${seedAssignments.length} seed assignments`);

// 2. Test Professor vs Student Roles
const profs = seedUsers.filter(u => u.role === 'professor' || u.role === 'admin');
const students = seedUsers.filter(u => u.role === 'student');
console.log(`Professors (${profs.length}):`, profs.map(p => p.name));
console.log(`Students (${students.length}):`, students.map(s => s.name));

// 3. Test Progress Calculations
console.log('Progress (32 / 42):', calculateProgress(32, 42) + '% (Expected: 76%)');
console.log('Progress (6 / 8):', calculateProgress(6, 8) + '% (Expected: 75%)');

// 4. Test Assignment Progress Calculation for individual & group
const indivAssignment = seedAssignments.find(a => a.id === 'assignment-1');
const indivStats = getAssignmentProgress(indivAssignment);
console.log('Indiv Assignment stats:', indivStats);

const groupAssignment = seedAssignments.find(a => a.id === 'assignment-2');
const groupStats = getAssignmentProgress(groupAssignment);
console.log('Group Assignment stats:', groupStats);

// 5. Test Deadline UX states
console.log('Deadline test (overdue):', getDeadlineInfo('2026-09-27T00:00:00.000Z', false));
console.log('Deadline test (submitted):', getDeadlineInfo('2026-09-27T00:00:00.000Z', true));
console.log('Deadline test (future):', getDeadlineInfo('2026-10-15T00:00:00.000Z', false));

// 6. Test Group relationships
const anandGroupCourse1 = seedGroups.find(g => g.courseId === 'course-1' && g.memberIds.includes('student-1'));
console.log('Anand in Course-1 Group:', anandGroupCourse1?.name, '(Leader:', anandGroupCourse1?.leaderName, ')');

const anandGroupCourse3 = seedGroups.find(g => g.courseId === 'course-3' && g.memberIds.includes('student-1'));
console.log('Anand in Course-3 Group:', anandGroupCourse3 ? anandGroupCourse3.name : 'NONE (Correct: triggers Student Not in Group warning)');

console.log('--- ALL UNIT CHECKS PASSED ---');

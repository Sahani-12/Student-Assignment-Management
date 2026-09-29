import { getCourses, getAssignments } from '../utils/storage';
import { calculateProgress } from '../utils/progressUtils';

export const courseService = {
  getAllCourses: () => {
    return getCourses();
  },

  getCourseById: (courseId) => {
    const courses = getCourses();
    return courses.find((c) => c.id === courseId) || null;
  },

  getProfessorCourses: (professorId) => {
    const courses = getCourses();
    const assignments = getAssignments();

    return courses
      .filter((c) => c.professorId === professorId || professorId === 'admin-1')
      .map((course) => {
        const courseAssignments = assignments.filter((a) => a.courseId === course.id);
        const totalAssignments = courseAssignments.length;
        const totalStudents = course.studentIds?.length || 0;

        let totalSubmissions = 0;
        let totalPossible = 0;

        courseAssignments.forEach((a) => {
          if (a.submissionType === 'group') {
            const groupsCount = (a.assignedGroups || []).length || 1;
            totalPossible += groupsCount;
            let ack = 0;
            (a.assignedGroups || []).forEach((gid) => {
              if (a.submissions?.[gid]?.submitted) ack++;
            });
            totalSubmissions += ack;
          } else {
            const count = (a.assignedStudents || []).length;
            totalPossible += count;
            let ack = 0;
            (a.assignedStudents || []).forEach((sid) => {
              if (a.submissions?.[sid]?.submitted) ack++;
            });
            totalSubmissions += ack;
          }
        });

        const progressRate = calculateProgress(totalSubmissions, totalPossible);

        return {
          ...course,
          assignmentsCount: totalAssignments,
          studentsCount: totalStudents,
          submissionProgress: progressRate,
        };
      });
  },

  getStudentCourses: (studentId) => {
    const courses = getCourses();
    const assignments = getAssignments();

    // Filter courses the student is enrolled in for current semester
    return courses
      .filter((c) => c.studentIds?.includes(studentId))
      .map((course) => {
        const courseAssignments = assignments.filter((a) => a.courseId === course.id);
        const total = courseAssignments.length;
        let acknowledged = 0;

        courseAssignments.forEach((a) => {
          if (a.submissionType === 'group') {
            // Check if student's group has submitted
            const subValues = Object.values(a.submissions || {});
            const hasSubmitted = subValues.some((s) => s.submitted);
            if (hasSubmitted) acknowledged++;
          } else {
            if (a.submissions?.[studentId]?.submitted) {
              acknowledged++;
            }
          }
        });

        return {
          ...course,
          totalAssignments: total,
          acknowledgedAssignments: acknowledged,
          progress: calculateProgress(acknowledged, total),
        };
      });
  },
};

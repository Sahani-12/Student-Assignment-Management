import {
  getAssignments,
  saveAssignments,
  getUsers,
  getGroups,
  getCourses,
} from '../utils/storage';
import { calculateProgress } from '../utils/progressUtils';

export const assignmentService = {
  getAllAssignments: () => {
    return getAssignments();
  },

  getAssignmentsByCourse: (courseId) => {
    const assignments = getAssignments();
    return assignments.filter((a) => a.courseId === courseId);
  },

  getAssignmentById: (id) => {
    const assignments = getAssignments();
    return assignments.find((a) => a.id === id) || null;
  },

  createAssignment: (payload) => {
    const assignments = getAssignments();
    const id = `assignment-${Date.now()}`;
    const submissionType = payload.submissionType || 'individual';

    const courses = getCourses();
    const course = courses.find((c) => c.id === payload.courseId);
    const assignedStudents =
      payload.assignedStudents || course?.studentIds || [];

    const groups = getGroups();
    const courseGroups = groups.filter((g) => g.courseId === payload.courseId);
    const assignedGroups =
      payload.assignedGroups || courseGroups.map((g) => g.id);

    const submissions = {};
    if (submissionType === 'group') {
      assignedGroups.forEach((gid) => {
        const g = groups.find((grp) => grp.id === gid);
        submissions[gid] = {
          submitted: false,
          submittedAt: null,
          submittedBy: null,
          leaderName: g?.leaderName || 'Leader',
        };
      });
    } else {
      assignedStudents.forEach((sid) => {
        submissions[sid] = {
          submitted: false,
          submittedAt: null,
        };
      });
    }

    const newAssignment = {
      id,
      courseId: payload.courseId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      deadline: payload.deadline,
      driveLink: payload.driveLink.trim(),
      submissionType,
      createdBy: payload.createdBy,
      assignedStudents,
      assignedGroups,
      submissions,
      createdAt: new Date().toISOString(),
    };

    const next = [...assignments, newAssignment];
    saveAssignments(next);
    return newAssignment;
  },

  updateAssignment: (id, payload) => {
    const assignments = getAssignments();
    const index = assignments.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = assignments[index];

    // Preserve existing submissions/acknowledgments!
    const updated = {
      ...existing,
      ...payload,
      submissions: existing.submissions, // never lose submissions on edit
    };

    const next = [...assignments];
    next[index] = updated;
    saveAssignments(next);
    return updated;
  },

  deleteAssignment: (id) => {
    const assignments = getAssignments();
    const next = assignments.filter((a) => a.id !== id);
    saveAssignments(next);
    return true;
  },

  acknowledgeIndividualAssignment: (assignmentId, studentId) => {
    const assignments = getAssignments();
    const index = assignments.findIndex((a) => a.id === assignmentId);
    if (index === -1) return null;

    const existing = assignments[index];
    const submittedAt = new Date().toISOString();

    const updated = {
      ...existing,
      submissions: {
        ...existing.submissions,
        [studentId]: {
          submitted: true,
          submittedAt,
        },
      },
    };

    const next = [...assignments];
    next[index] = updated;
    saveAssignments(next);
    return updated;
  },

  acknowledgeGroupAssignment: (assignmentId, groupId, leaderId, leaderName) => {
    const assignments = getAssignments();
    const index = assignments.findIndex((a) => a.id === assignmentId);
    if (index === -1) return null;

    const existing = assignments[index];
    const submittedAt = new Date().toISOString();

    const updated = {
      ...existing,
      submissions: {
        ...existing.submissions,
        [groupId]: {
          submitted: true,
          submittedAt,
          submittedBy: leaderId,
          leaderName,
        },
      },
    };

    const next = [...assignments];
    next[index] = updated;
    saveAssignments(next);
    return updated;
  },

  getAssignmentAnalytics: (id) => {
    const assignments = getAssignments();
    const assignment = assignments.find((a) => a.id === id);
    if (!assignment) return null;

    const allUsers = getUsers();
    const allGroups = getGroups();

    if (assignment.submissionType === 'group') {
      const groupsForCourse = allGroups.filter(
        (g) =>
          g.courseId === assignment.courseId &&
          (assignment.assignedGroups?.length === 0 ||
            assignment.assignedGroups?.includes(g.id))
      );

      const totalGroups = groupsForCourse.length;
      let acknowledgedGroups = 0;

      const groupDetails = groupsForCourse.map((grp) => {
        const sub = assignment.submissions?.[grp.id];
        const isAck = sub?.submitted === true;
        if (isAck) acknowledgedGroups++;

        const members = (grp.memberIds || []).map((mid) => {
          const u = allUsers.find((user) => user.id === mid);
          return {
            id: mid,
            name: u?.name || 'Student',
            email: u?.email || '',
            isLeader: mid === grp.leaderId,
          };
        });

        return {
          groupId: grp.id,
          name: grp.name,
          leaderId: grp.leaderId,
          leaderName: grp.leaderName,
          members,
          submitted: isAck,
          submittedAt: sub?.submittedAt || null,
        };
      });

      const pendingGroups = totalGroups - acknowledgedGroups;
      const completionRate = calculateProgress(acknowledgedGroups, totalGroups);

      return {
        isGroup: true,
        total: totalGroups,
        acknowledged: acknowledgedGroups,
        pending: pendingGroups,
        completion: completionRate,
        groups: groupDetails,
      };
    }

    // Individual assignment analytics
    const assignedIds = assignment.assignedStudents || [];
    const students = allUsers.filter((u) => assignedIds.includes(u.id));
    const totalStudents = students.length;
    let acknowledgedStudents = 0;

    const studentDetails = students.map((std) => {
      const sub = assignment.submissions?.[std.id];
      const isAck = sub?.submitted === true;
      if (isAck) acknowledgedStudents++;

      return {
        id: std.id,
        name: std.name,
        email: std.email,
        rollNo: std.rollNo,
        submitted: isAck,
        submittedAt: sub?.submittedAt || null,
      };
    });

    const pendingStudents = totalStudents - acknowledgedStudents;
    const completionRate = calculateProgress(acknowledgedStudents, totalStudents);

    return {
      isGroup: false,
      total: totalStudents,
      acknowledged: acknowledgedStudents,
      pending: pendingStudents,
      completion: completionRate,
      students: studentDetails,
    };
  },
};

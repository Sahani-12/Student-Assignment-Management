/**
 * Progress and completion rate calculation utilities
 */

export function calculateProgress(completed, total) {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

/**
 * Calculates progress for an assignment (supports both Individual & Group)
 */
export function getAssignmentProgress(assignment, groups = []) {
  if (!assignment) return { completed: 0, total: 0, percentage: 0 };

  if (assignment.submissionType === 'group') {
    // For group assignments, progress is Acknowledged Groups / Total Groups
    const assignedGroupIds = assignment.assignedGroups || [];
    const totalGroups = assignedGroupIds.length;
    let acknowledgedGroups = 0;

    assignedGroupIds.forEach((gid) => {
      if (assignment.submissions?.[gid]?.submitted) {
        acknowledgedGroups++;
      }
    });

    return {
      completed: acknowledgedGroups,
      total: totalGroups,
      percentage: calculateProgress(acknowledgedGroups, totalGroups),
      isGroup: true,
    };
  }

  // Individual assignment
  const assigned = assignment.assignedStudents || [];
  const totalStudents = assigned.length;
  let acknowledgedStudents = 0;

  assigned.forEach((sid) => {
    if (assignment.submissions?.[sid]?.submitted) {
      acknowledgedStudents++;
    }
  });

  return {
    completed: acknowledgedStudents,
    total: totalStudents,
    percentage: calculateProgress(acknowledgedStudents, totalStudents),
    isGroup: false,
  };
}

export function calculateProgress(submittedCount, totalCount) {
  if (!totalCount || totalCount <= 0) {
    return 0;
  }
  return Math.round((submittedCount / totalCount) * 100);
}

export function getStudentAssignmentProgress(submission) {
  return submission?.submitted ? 100 : 0;
}

export function getAssignmentCompletionStats(assignment) {
  const assigned = assignment.assignedStudents || [];
  const total = assigned.length;
  const submitted = assigned.filter(
    (id) => assignment.submissions?.[id]?.submitted === true
  ).length;
  return {
    total,
    submitted,
    percentage: calculateProgress(submitted, total),
  };
}

export function getStudentOverallStats(assignments, studentId) {
  const mine = assignments.filter((a) =>
    a.assignedStudents?.includes(studentId)
  );
  const total = mine.length;
  const submitted = mine.filter(
    (a) => a.submissions?.[studentId]?.submitted === true
  ).length;
  const pending = total - submitted;
  return {
    total,
    submitted,
    pending,
    percentage: calculateProgress(submitted, total),
  };
}

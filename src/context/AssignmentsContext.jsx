import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { assignmentService } from '../services/assignmentService';
import { courseService } from '../services/courseService';
import { groupService } from '../services/groupService';

const AssignmentsContext = createContext(null);

export function AssignmentsProvider({ children }) {
  const [assignments, setAssignments] = useState(() =>
    assignmentService.getAllAssignments()
  );
  const [courses, setCourses] = useState(() => courseService.getAllCourses());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const refresh = useCallback(() => {
    setAssignments(assignmentService.getAllAssignments());
    setCourses(courseService.getAllCourses());
  }, []);

  const addAssignment = useCallback(
    (payload) => {
      const created = assignmentService.createAssignment(payload);
      setAssignments(assignmentService.getAllAssignments());
      return created;
    },
    []
  );

  const updateAssignment = useCallback(
    (id, payload) => {
      const updated = assignmentService.updateAssignment(id, payload);
      setAssignments(assignmentService.getAllAssignments());
      return updated;
    },
    []
  );

  const deleteAssignment = useCallback(
    (id) => {
      assignmentService.deleteAssignment(id);
      setAssignments(assignmentService.getAllAssignments());
    },
    []
  );

  const acknowledgeIndividual = useCallback(
    (assignmentId, studentId) => {
      const updated = assignmentService.acknowledgeIndividualAssignment(
        assignmentId,
        studentId
      );
      setAssignments(assignmentService.getAllAssignments());
      return updated;
    },
    []
  );

  const acknowledgeGroup = useCallback(
    (assignmentId, groupId, leaderId, leaderName) => {
      const updated = assignmentService.acknowledgeGroupAssignment(
        assignmentId,
        groupId,
        leaderId,
        leaderName
      );
      setAssignments(assignmentService.getAllAssignments());
      return updated;
    },
    []
  );

  // Backwards compatibility with Task 1 submitForStudent
  const submitForStudent = useCallback(
    (assignmentId, studentId) => {
      return acknowledgeIndividual(assignmentId, studentId);
    },
    [acknowledgeIndividual]
  );

  const createGroup = useCallback((payload) => {
    const newGroup = groupService.createGroup(payload);
    refresh();
    return newGroup;
  }, [refresh]);

  const joinGroup = useCallback((groupId, studentId) => {
    const updated = groupService.joinGroup(groupId, studentId);
    refresh();
    return updated;
  }, [refresh]);

  const value = useMemo(
    () => ({
      assignments,
      courses,
      loading,
      refresh,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      acknowledgeIndividual,
      acknowledgeGroup,
      submitForStudent,
      createGroup,
      joinGroup,
    }),
    [
      assignments,
      courses,
      loading,
      refresh,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      acknowledgeIndividual,
      acknowledgeGroup,
      submitForStudent,
      createGroup,
      joinGroup,
    ]
  );

  return (
    <AssignmentsContext.Provider value={value}>
      {children}
    </AssignmentsContext.Provider>
  );
}

export function useAssignments() {
  const ctx = useContext(AssignmentsContext);
  if (!ctx)
    throw new Error('useAssignments must be used within AssignmentsProvider');
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getAssignments, saveAssignments } from '../utils/storage';

const AssignmentsContext = createContext(null);

function createEmptySubmissions(studentIds) {
  return studentIds.reduce((acc, id) => {
    acc[id] = { submitted: false, submittedAt: null };
    return acc;
  }, {});
}

export function AssignmentsProvider({ children }) {
  const [assignments, setAssignments] = useState(() => getAssignments());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const refresh = useCallback(() => {
    setAssignments(getAssignments());
  }, []);

  const persist = useCallback((next) => {
    saveAssignments(next);
    setAssignments(next);
  }, []);

  const addAssignment = useCallback(
    (payload) => {
      const id = `assignment-${Date.now()}`;
      const assignedStudents = payload.assignedStudents || [];
      const entry = {
        id,
        ...payload,
        createdBy: payload.createdBy,
        assignedStudents,
        submissions: createEmptySubmissions(assignedStudents),
      };
      const next = [...getAssignments(), entry];
      persist(next);
      return entry;
    },
    [persist]
  );

  const updateAssignment = useCallback(
    (id, payload) => {
      const current = getAssignments();
      const index = current.findIndex((a) => a.id === id);
      if (index === -1) return null;

      const existing = current[index];
      const newAssigned = payload.assignedStudents ?? existing.assignedStudents;
      const submissions = { ...existing.submissions };

      newAssigned.forEach((sid) => {
        if (!submissions[sid]) {
          submissions[sid] = { submitted: false, submittedAt: null };
        }
      });

      Object.keys(submissions).forEach((sid) => {
        if (!newAssigned.includes(sid)) {
          delete submissions[sid];
        }
      });

      const updated = {
        ...existing,
        ...payload,
        assignedStudents: newAssigned,
        submissions,
      };

      const next = [...current];
      next[index] = updated;
      persist(next);
      return updated;
    },
    [persist]
  );

  const deleteAssignment = useCallback(
    (id) => {
      const next = getAssignments().filter((a) => a.id !== id);
      persist(next);
    },
    [persist]
  );

  const submitForStudent = useCallback(
    (assignmentId, studentId) => {
      const current = getAssignments();
      const index = current.findIndex((a) => a.id === assignmentId);
      if (index === -1) return null;

      const existing = current[index];
      const submittedAt = new Date().toISOString();
      const updated = {
        ...existing,
        submissions: {
          ...existing.submissions,
          [studentId]: { submitted: true, submittedAt },
        },
      };
      const next = [...current];
      next[index] = updated;
      persist(next);
      return updated;
    },
    [persist]
  );

  const value = useMemo(
    () => ({
      assignments,
      loading,
      refresh,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      submitForStudent,
    }),
    [
      assignments,
      loading,
      refresh,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      submitForStudent,
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
  if (!ctx) throw new Error('useAssignments must be used within AssignmentsProvider');
  return ctx;
}

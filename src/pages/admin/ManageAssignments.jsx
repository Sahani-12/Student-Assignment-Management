import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';
import SearchBar from '../../components/common/SearchBar';
import AssignmentTable from '../../components/assignments/AssignmentTable';
import ConfirmationModal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAssignmentStatus } from '../../utils/assignmentStatus';

const FILTERS = [
  { id: 'all', label: 'All Assignments' },
  { id: 'submitted', label: 'Fully Submitted' },
  { id: 'pending', label: 'Has Pending' },
  { id: 'overdue', label: 'Has Overdue' },
];

export default function ManageAssignments() {
  const { user } = useAuth();
  const { assignments, loading, deleteAssignment } = useAssignments();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter only assignments created by this admin
  const mine = useMemo(
    () => assignments.filter((a) => a.createdBy === user.id),
    [assignments, user.id]
  );

  const filtered = useMemo(() => {
    let list = mine;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      );
    }

    if (filter === 'all') return list;

    return list.filter((a) => {
      const assigned = a.assignedStudents || [];
      if (!assigned.length) return false;

      if (filter === 'submitted') {
        return assigned.every((sid) => a.submissions?.[sid]?.submitted === true);
      }
      if (filter === 'pending') {
        return assigned.some((sid) => a.submissions?.[sid]?.submitted !== true);
      }
      if (filter === 'overdue') {
        return assigned.some((sid) => {
          const sub = a.submissions?.[sid];
          return getAssignmentStatus(sub, a.dueDate) === 'overdue';
        });
      }
      return true;
    });
  }, [mine, search, filter]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteAssignment(deleteTarget.id);
    showToast('Assignment deleted successfully');
    setDeleteTarget(null);
  };

  if (loading) {
    return <LoadingSpinner label="Loading assignments..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Assignment Management</h1>
          <p className="text-sm font-medium text-slate-500">
            Create, edit, search, and track student submissions.
          </p>
        </div>
        <Link
          to="/admin/assignments/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Assignment
        </Link>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by assignment title or subject..."
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                filter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          title="No assignments created yet"
          description="Create your first assignment to assign students and track their submission progress."
          action={
            <Link
              to="/admin/assignments/create"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
            >
              Create Assignment
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching assignments"
          description="Try adjusting your search query or filter."
        />
      ) : (
        <AssignmentTable assignments={filtered} onDelete={setDeleteTarget} />
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        open={Boolean(deleteTarget)}
        title="Delete Assignment?"
        confirmLabel="Delete Assignment"
        variant="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      >
        Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? All associated student submission records for this assignment will be permanently removed.
      </ConfirmationModal>
    </div>
  );
}

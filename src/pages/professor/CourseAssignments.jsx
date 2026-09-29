import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PlusCircle,
  Search,
  Filter,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';
import { courseService } from '../../services/courseService';
import AssignmentCard from '../../components/assignments/AssignmentCard';
import AssignmentTable from '../../components/assignments/AssignmentTable';
import EmptyState from '../../components/common/EmptyState';
import ConfirmationModal from '../../components/common/Modal';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getAssignmentProgress } from '../../utils/progressUtils';

export default function CourseAssignments() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { assignments, deleteAssignment } = useAssignments();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'individual' | 'group'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [deleteTarget, setDeleteTarget] = useState(null);

  const course = useMemo(() => {
    return courseService.getCourseById(courseId);
  }, [courseId]);

  const courseAssignments = useMemo(() => {
    return assignments.filter((a) => a.courseId === courseId);
  }, [assignments, courseId]);

  const filtered = useMemo(() => {
    let result = courseAssignments;

    // Search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((a) => a.submissionType === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((a) => {
        const stats = getAssignmentProgress(a);
        if (statusFilter === 'completed') {
          return stats.percentage === 100;
        }
        if (statusFilter === 'pending') {
          return stats.percentage < 100;
        }
        return true;
      });
    }

    return result;
  }, [courseAssignments, search, typeFilter, statusFilter]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAssignment(deleteTarget.id);
    showToast(`Assignment "${deleteTarget.title}" deleted.`);
    setDeleteTarget(null);
  };

  if (!course) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Course Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested course does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/professor/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/professor/dashboard', showHomeIcon: true },
          { label: course.name },
          { label: 'Assignments' },
        ]}
      />

      {/* Header */}
      <header className="rounded-2.5xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-4">
        <Link
          to="/professor/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {course.code}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                {course.credits} Credits
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {course.semester}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {course.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {course.studentIds?.length || 0} enrolled students · {courseAssignments.length} total assignments
            </p>
          </div>

          <Link
            to={`/professor/assignments/create?courseId=${course.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] self-start md:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Create Assignment
          </Link>
        </div>
      </header>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments by title or keyword..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition focus:border-indigo-500 focus:outline-none"
            aria-label="Filter by completion status"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Submissions</option>
            <option value="completed">100% Fully Submitted</option>
          </select>

          {/* Submission Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition focus:border-indigo-500 focus:outline-none"
            aria-label="Filter by submission type"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
          </select>

          {(search || statusFilter !== 'all' || typeFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Reset
            </button>
          )}

          {/* Grid / Table View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content: Cards or Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title={search.trim() || statusFilter !== 'all' || typeFilter !== 'all' ? 'No assignments match your filter' : 'No assignments found'}
          description={
            search || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search query or resetting active filters.'
              : 'Create your first assignment for this course to begin.'
          }
          actionLabel={search || statusFilter !== 'all' || typeFilter !== 'all' ? 'Reset Filters' : '+ Create Assignment'}
          onAction={
            search || statusFilter !== 'all' || typeFilter !== 'all'
              ? () => {
                  setSearch('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }
              : () => navigate(`/professor/assignments/create?courseId=${course.id}`)
          }
        />

      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              isProfessor={true}
              onDelete={(target) => setDeleteTarget(target)}
            />
          ))}
        </div>
      ) : (
        <AssignmentTable
          assignments={filtered}
          onDelete={(target) => setDeleteTarget(target)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={Boolean(deleteTarget)}
        title="Delete Assignment?"
        confirmLabel="Delete Assignment"
        variant="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      >
        Are you sure you want to permanently delete &quot;{deleteTarget?.title}&quot;?
        All student submission records for this assignment will also be removed.
      </ConfirmationModal>
    </div>
  );
}

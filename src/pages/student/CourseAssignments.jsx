import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { courseService } from '../../services/courseService';
import AssignmentCard from '../../components/assignments/AssignmentCard';
import EmptyState from '../../components/common/EmptyState';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getDeadlineInfo } from '../../utils/dateUtils';
import { getGroups } from '../../utils/storage';

export default function StudentCourseAssignments() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { assignments } = useAssignments();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'acknowledged' | 'pending' | 'overdue'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'individual' | 'group'

  const course = useMemo(() => {
    return courseService.getCourseById(courseId);
  }, [courseId]);

  const courseAssignments = useMemo(() => {
    return assignments.filter((a) => a.courseId === courseId);
  }, [assignments, courseId]);

  const filtered = useMemo(() => {
    const groups = getGroups();
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
        let isAck = false;
        if (a.submissionType === 'group') {
          const studentGroup = groups.find(
            (g) => g.courseId === a.courseId && g.memberIds?.includes(user?.id)
          );
          if (studentGroup && a.submissions?.[studentGroup.id]?.submitted) {
            isAck = true;
          }
        } else {
          isAck = a.submissions?.[user?.id]?.submitted === true;
        }

        const deadlineInfo = getDeadlineInfo(a.deadline, isAck);

        if (statusFilter === 'acknowledged') return isAck;
        if (statusFilter === 'overdue') return !isAck && deadlineInfo.isOverdue;
        if (statusFilter === 'pending') return !isAck && !deadlineInfo.isOverdue;
        return true;
      });
    }

    return result;
  }, [courseAssignments, search, typeFilter, statusFilter, user?.id]);

  if (!course) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Course Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested course does not exist.
        </p>
        <Link
          to="/student/dashboard"
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
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/student/dashboard', showHomeIcon: true },
          { label: course.name },
          { label: 'Assignments' },
        ]}
      />

      {/* Header */}
      <header className="rounded-2.5xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card space-y-4">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to My Courses
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
              Instructor: <strong className="text-slate-700">{course.professorName}</strong> · {courseAssignments.length} Total Assignments
            </p>
          </div>
        </div>
      </header>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments in this course..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition focus:border-indigo-500 focus:outline-none"
            aria-label="Filter by acknowledgment status"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Submission type filter */}
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
        </div>
      </div>

      {/* Grid of Assignment Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          title={search.trim() || statusFilter !== 'all' || typeFilter !== 'all' ? 'No assignments match your filter' : 'No assignments found'}
          description={
            search.trim() || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try clearing active search criteria or switching status filters.'
              : 'There are no active assignments published for this course yet.'
          }
          actionLabel={search || statusFilter !== 'all' || typeFilter !== 'all' ? 'Clear Filters' : undefined}
          onAction={() => {
            setSearch('');
            setStatusFilter('all');
            setTypeFilter('all');
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              isProfessor={false}
              studentId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}


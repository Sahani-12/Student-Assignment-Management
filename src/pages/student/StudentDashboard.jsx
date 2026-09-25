import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, Clock, Filter, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import StatCard from '../../components/common/StatCard';
import AssignmentCard from '../../components/assignments/AssignmentCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressBar from '../../components/common/ProgressBar';
import SearchBar from '../../components/common/SearchBar';
import { getStudentOverallStats } from '../../utils/progress';
import { getAssignmentStatus } from '../../utils/assignmentStatus';

function greetingName(name) {
  const h = new Date().getHours();
  const prefix = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  return `${prefix}, ${name?.split(' ')[0] ?? 'Student'} 👋`;
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Assignments' },
  { id: 'pending', label: 'Pending' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'overdue', label: 'Overdue' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { assignments, loading } = useAssignments();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Strict student isolation filtering by user.id
  const myAssignments = useMemo(
    () =>
      assignments.filter(
        (a) => a.assignedStudents?.includes(user.id)
      ),
    [assignments, user.id]
  );

  const filteredAssignments = useMemo(() => {
    let result = myAssignments;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      );
    }

    if (filter === 'submitted') {
      result = result.filter((a) => a.submissions?.[user.id]?.submitted === true);
    } else if (filter === 'pending') {
      result = result.filter((a) => {
        const sub = a.submissions?.[user.id];
        const status = getAssignmentStatus(sub, a.dueDate);
        return status === 'pending' || status === 'due-soon';
      });
    } else if (filter === 'overdue') {
      result = result.filter((a) => {
        const sub = a.submissions?.[user.id];
        return getAssignmentStatus(sub, a.dueDate) === 'overdue';
      });
    }

    return result;
  }, [myAssignments, search, filter, user.id]);

  const stats = useMemo(
    () => getStudentOverallStats(assignments, user.id),
    [assignments, user.id]
  );

  if (loading) {
    return <LoadingSpinner label="Loading your assignments..." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {greetingName(user.name)}
        </h1>
        <p className="text-sm font-medium text-slate-500">Here&apos;s your assignment progress.</p>
      </header>

      {/* Statistics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Assignments" value={stats.total} icon={ClipboardList} />
        <StatCard
          label="Submitted"
          value={stats.submitted}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="amber" />
        <StatCard
          label="Overall Progress"
          value={`${stats.percentage}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Overall Completion Progress Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Overall Course Progress</h2>
          <span className="text-sm font-extrabold text-indigo-600">{stats.submitted} of {stats.total} Completed</span>
        </div>
        <ProgressBar value={stats.percentage} showValue={false} />
      </section>

      {/* Assignments Section */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">My Assignments</h2>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((f) => (
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

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by title, subject, or keywords..."
        />

        {myAssignments.length === 0 ? (
          <EmptyState
            title="No assignments assigned 🎉"
            description="You're all caught up! Check back when your professor assigns new work."
          />
        ) : filteredAssignments.length === 0 ? (
          <EmptyState
            title="No matching assignments"
            description="Try changing your search term or filter selection."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAssignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} studentId={user.id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

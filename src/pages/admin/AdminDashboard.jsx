import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, PlusCircle, TrendingUp, UserCheck, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import StatCard from '../../components/common/StatCard';
import ProgressBar from '../../components/common/ProgressBar';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { calculateProgress } from '../../utils/progress';
import { getUsers } from '../../utils/storage';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { assignments, loading } = useAssignments();

  // Filter only assignments created by this logged-in admin
  const mine = useMemo(
    () => assignments.filter((a) => a.createdBy === user.id),
    [assignments, user.id]
  );

  const stats = useMemo(() => {
    const students = getUsers().filter((u) => u.role === 'student');
    let totalSlots = 0;
    let totalSubmitted = 0;

    mine.forEach((a) => {
      const assigned = a.assignedStudents || [];
      totalSlots += assigned.length;
      totalSubmitted += assigned.filter(
        (sid) => a.submissions?.[sid]?.submitted === true
      ).length;
    });

    return {
      assignments: mine.length,
      students: students.length,
      submissions: totalSubmitted,
      completion: calculateProgress(totalSubmitted, totalSlots),
    };
  }, [mine]);

  if (loading) {
    return <LoadingSpinner label="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Overview of your courses, active assignments, and student submissions.
          </p>
        </div>
        <Link
          to="/admin/assignments/create"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4" />
          Create Assignment
        </Link>
      </header>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Assignments" value={stats.assignments} icon={ClipboardList} />
        <StatCard label="Total Students" value={stats.students} icon={Users} />
        <StatCard
          label="Total Submissions"
          value={stats.submissions}
          icon={UserCheck}
          accent="emerald"
        />
        <StatCard
          label="Overall Completion"
          value={`${stats.completion}%`}
          icon={TrendingUp}
        />
      </div>

      {/* My Assignments Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">My Created Assignments</h2>
          <Link
            to="/admin/assignments"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            Manage All ({mine.length})
          </Link>
        </div>

        {mine.length === 0 ? (
          <EmptyState
            title="No assignments created yet"
            description="Create your first assignment to start assigning students and tracking their progress."
            action={
              <Link
                to="/admin/assignments/create"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
              >
                Create Assignment
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mine.map((a) => {
              const assigned = a.assignedStudents || [];
              const submitted = assigned.filter(
                (sid) => a.submissions?.[sid]?.submitted === true
              ).length;
              const pct = calculateProgress(submitted, assigned.length);
              return (
                <article
                  key={a.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:shadow-card-hover hover:border-indigo-200"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      {a.subject}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-slate-900">{a.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      {assigned.length} Enrolled Students · {submitted} Submissions
                    </p>
                  </div>

                  <div className="mt-6">
                    <ProgressBar value={pct} label="Completion Rate" />
                    <Link
                      to={`/admin/assignments/edit/${a.id}`}
                      className="mt-4 block text-center rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                    >
                      View Student Submissions →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

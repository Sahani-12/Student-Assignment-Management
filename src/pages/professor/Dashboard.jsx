import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ClipboardList,
  PlusCircle,
  TrendingUp,
  UserCheck,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import StatCard from '../../components/common/StatCard';
import CourseCard from '../../components/courses/CourseCard';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonCourseCard } from '../../components/common/Skeleton';
import { courseService } from '../../services/courseService';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const { assignments, loading } = useAssignments();

  // Fetch professor courses with calculated submission metrics
  const professorCourses = useMemo(() => {
    return courseService.getProfessorCourses(user?.id);
  }, [user?.id, assignments]);

  // Overall statistics
  const stats = useMemo(() => {
    const totalCourses = professorCourses.length;
    let totalAssignments = 0;
    const studentSet = new Set();
    let totalPossibleSubmissions = 0;
    let totalCompletedSubmissions = 0;

    professorCourses.forEach((c) => {
      totalAssignments += c.assignmentsCount || 0;
      (c.studentIds || []).forEach((sid) => studentSet.add(sid));

      // Calculate aggregate submission percentage
      const cAssignments = assignments.filter((a) => a.courseId === c.id);
      cAssignments.forEach((a) => {
        if (a.submissionType === 'group') {
          const totalGroups = (a.assignedGroups || []).length || 1;
          totalPossibleSubmissions += totalGroups;
          (a.assignedGroups || []).forEach((gid) => {
            if (a.submissions?.[gid]?.submitted) {
              totalCompletedSubmissions++;
            }
          });
        } else {
          const totalStudents = (a.assignedStudents || []).length;
          totalPossibleSubmissions += totalStudents;
          (a.assignedStudents || []).forEach((sid) => {
            if (a.submissions?.[sid]?.submitted) {
              totalCompletedSubmissions++;
            }
          });
        }
      });
    });

    const overallRate =
      totalPossibleSubmissions > 0
        ? Math.round((totalCompletedSubmissions / totalPossibleSubmissions) * 100)
        : 0;

    return {
      totalCourses,
      totalAssignments,
      totalStudents: studentSet.size,
      overallRate,
    };
  }, [professorCourses, assignments]);

  // Recent assignment activity demo stream
  const recentActivities = [
    {
      id: 'act-1',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
      title: 'Team Phoenix acknowledged Full-Stack Capstone',
      time: '2 minutes ago',
      type: 'Group',
      author: 'Rahul Kumar (Leader)',
    },
    {
      id: 'act-2',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
      title: 'Anand Sahani acknowledged React Dashboard',
      time: '12 minutes ago',
      type: 'Individual',
      author: 'Anand Sahani',
    },
    {
      id: 'act-3',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
      title: 'Team Alpha capstone assignment acknowledgment is pending',
      time: '1 hour ago',
      type: 'Group',
      author: 'Team Alpha',
    },
    {
      id: 'act-4',
      icon: CheckCircle2,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
      title: 'Rahul Kumar acknowledged React Dashboard',
      time: '3 hours ago',
      type: 'Individual',
      author: 'Rahul Kumar',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCourseCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Faculty Command Center · Fall 2026
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {getGreeting()}, {user?.name || 'Professor'} 👋
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Here&apos;s an overview of your courses, active assignments, and submission progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/professor/assignments/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99]"
          >
            <PlusCircle className="h-4 w-4" />
            + Create Assignment
          </Link>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          subtitle="Taught this term"
        />
        <StatCard
          label="Total Assignments"
          value={stats.totalAssignments}
          icon={ClipboardList}
          subtitle="Published deliverables"
        />
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          icon={Users}
          subtitle="Across all courses"
        />
        <StatCard
          label="Overall Submission Rate"
          value={`${stats.overallRate}%`}
          icon={TrendingUp}
          accent={stats.overallRate > 70 ? 'emerald' : 'indigo'}
          subtitle="Classroom completion"
        />
      </div>

      {/* Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Your Courses
            </h2>
            <p className="text-xs text-slate-500">
              Select a course to view assignment submissions, manage deadlines, or create assignments.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
            {professorCourses.length} Courses Managed
          </span>
        </div>

        {professorCourses.length === 0 ? (
          <EmptyState
            title="No courses assigned"
            description="You do not have any active courses assigned for this semester."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professorCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isProfessor={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Assignment Activity Feed */}
      <section className="rounded-2.5xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Assignment Activity
              </h3>
              <p className="text-xs text-slate-400">
                Real-time submission acknowledgments and status alerts from your enrolled students.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Feed
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0 hover:bg-slate-50/60 rounded-xl px-2.5 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${act.bgColor} ${act.iconColor} shadow-xs`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {act.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="truncate max-w-[150px] sm:max-w-none">{act.author}</span>
                      <span>·</span>
                      <span className="shrink-0">{act.time}</span>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200/60">
                  {act.type}
                </span>
              </div>

            );
          })}
        </div>
      </section>
    </div>
  );
}

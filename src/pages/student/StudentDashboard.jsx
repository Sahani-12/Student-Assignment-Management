import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ClipboardList,
  Sparkles,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import StatCard from '../../components/common/StatCard';
import ProgressBar from '../../components/common/ProgressBar';
import CourseCard from '../../components/courses/CourseCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonCourseCard } from '../../components/common/Skeleton';
import { courseService } from '../../services/courseService';
import { getDeadlineInfo, formatDateTime } from '../../utils/dateUtils';
import { getGroups } from '../../utils/storage';

function getGreeting(name) {
  const h = new Date().getHours();
  const time = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = name?.split(' ')[0] || 'Student';
  return `${time}, ${firstName} 👋`;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { assignments, loading } = useAssignments();

  // Enrolled courses for current semester
  const studentCourses = useMemo(() => {
    return courseService.getStudentCourses(user?.id);
  }, [user?.id, assignments]);

  // All assignments assigned to the student or student's courses
  const studentAssignments = useMemo(() => {
    const groups = getGroups();
    const enrolledCourseIds = studentCourses.map((c) => c.id);

    return assignments.filter((a) => {
      if (!enrolledCourseIds.includes(a.courseId)) return false;
      if (a.submissionType === 'group') {
        return true; // group assignment in enrolled course
      }
      return (
        !a.assignedStudents ||
        a.assignedStudents.length === 0 ||
        a.assignedStudents.includes(user?.id)
      );
    });
  }, [assignments, studentCourses, user?.id]);

  // Overall student statistics
  const stats = useMemo(() => {
    const groups = getGroups();
    const totalAssignments = studentAssignments.length;
    let acknowledged = 0;

    studentAssignments.forEach((a) => {
      if (a.submissionType === 'group') {
        const studentGroup = groups.find(
          (g) => g.courseId === a.courseId && g.memberIds?.includes(user?.id)
        );
        if (studentGroup && a.submissions?.[studentGroup.id]?.submitted) {
          acknowledged++;
        }
      } else {
        if (a.submissions?.[user?.id]?.submitted) {
          acknowledged++;
        }
      }
    });

    const pending = totalAssignments - acknowledged;
    const progressRate =
      totalAssignments > 0
        ? Math.round((acknowledged / totalAssignments) * 100)
        : 0;

    return {
      enrolledCourses: studentCourses.length,
      totalAssignments,
      acknowledged,
      pending,
      progressRate,
    };
  }, [studentAssignments, studentCourses, user?.id]);

  // Upcoming deadlines (sorted by closest deadline)
  const upcomingAssignments = useMemo(() => {
    const groups = getGroups();
    return [...studentAssignments]
      .map((a) => {
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
        return {
          ...a,
          isAck,
          deadlineInfo,
        };
      })
      .filter((a) => !a.isAck) // Only pending/due assignments
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 4);
  }, [studentAssignments, user?.id]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-4 w-80 bg-slate-200 animate-pulse rounded-lg" />
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
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            <GraduationCap className="h-3.5 w-3.5" />
            Fall 2026 Academic Term
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {getGreeting(user?.name)}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Here&apos;s your academic overview across your enrolled semester courses.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            Student ID: <strong className="text-slate-800">{user?.rollNo || 'CS-2026-001'}</strong>
          </span>
        </div>
      </header>

      {/* Overall Assignment Progress Banner (Section 17 requirement) */}
      <div className="relative overflow-hidden rounded-2.5xl border border-indigo-100 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 backdrop-blur-md border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Overall Assignment Progress</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {stats.acknowledged} of {stats.totalAssignments} assignments acknowledged
            </h2>
            <p className="text-sm text-indigo-200 max-w-lg leading-relaxed">
              {stats.progressRate >= 80
                ? 'Outstanding performance! You are on pace with all required deliverables.'
                : 'Keep pushing! Review pending assignments and synchronize with your group leaders.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="text-center sm:text-right">
              <p className="text-4xl font-black tracking-tight text-white">
                {stats.progressRate}%
              </p>
              <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mt-0.5">
                Completion Rate
              </p>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar inside Banner */}
        <div className="mt-6 relative z-10">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 p-0.5 backdrop-blur-xs">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400 transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${stats.progressRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Enrolled Courses"
          value={stats.enrolledCourses}
          icon={BookOpen}
        />
        <StatCard
          label="Total Assignments"
          value={stats.totalAssignments}
          icon={ClipboardList}
        />
        <StatCard
          label="Acknowledged"
          value={stats.acknowledged}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Pending Submission"
          value={stats.pending}
          icon={Clock}
          accent="amber"
        />
      </div>

      {/* My Courses Section (Section 17: Only courses for the current semester) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              My Courses
            </h2>
            <p className="text-xs text-slate-500">
              Fall 2026 semester enrolled courses and individual course completion status.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
            {studentCourses.length} Active Courses
          </span>
        </div>

        {studentCourses.length === 0 ? (
          <EmptyState
            title="No courses enrolled"
            description="You aren't enrolled in any courses for this semester."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studentCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isProfessor={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Deadlines (Section 50) */}
      <section className="rounded-2.5xl border border-slate-200/90 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Upcoming Deadlines
            </h3>
            <p className="text-xs text-slate-500">
              Prioritized list of pending deliverables due soonest.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            Action Required
          </span>
        </div>

        {upcomingAssignments.length === 0 ? (
          <div className="py-8 text-center text-sm font-semibold text-emerald-700 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            🎉 All assignments are currently acknowledged! Great job keeping up with coursework.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {upcomingAssignments.map((a) => (
              <Link
                key={a.id}
                to={`/student/assignments/${a.id}`}
                className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-card-hover hover:bg-slate-50/40 transition-all duration-200"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {a.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Due: {formatDateTime(a.deadline)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      a.deadlineInfo.urgency === 'red'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : a.deadlineInfo.urgency === 'orange'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {a.deadlineInfo.label}
                  </span>
                  <StatusBadge status={a.submissionType} type="submissionType" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

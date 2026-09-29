import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ClipboardList,
  AlertCircle,
  ExternalLink,
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
      <header className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Academic Term: Fall 2026
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {getGreeting(user?.name)}
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Here&apos;s your academic progress across your enrolled semester courses.
        </p>
      </header>

      {/* Overall Assignment Progress Banner (Section 17 requirement) */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/50 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Overall Assignment Progress
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {stats.acknowledged} of {stats.totalAssignments} assignments acknowledged
            </p>
          </div>
          <span className="text-2xl font-extrabold text-indigo-600">
            {stats.progressRate}%
          </span>
        </div>
        <ProgressBar
          value={stats.progressRate}
          showValue={false}
          size="lg"
          colorScheme={stats.progressRate === 100 ? 'emerald' : 'indigo'}
        />
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
              Current semester enrolled courses and individual course completion status.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Fall 2026 Semester
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
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Upcoming Deadlines
            </h3>
            <p className="text-xs text-slate-500">
              Prioritized list of pending deliverables due soonest.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Action Required
          </span>
        </div>

        {upcomingAssignments.length === 0 ? (
          <div className="py-8 text-center text-sm font-medium text-emerald-700 bg-emerald-50/50 rounded-xl">
            🎉 All assignments currently acknowledged! Keep up the great work.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {upcomingAssignments.map((a) => (
              <Link
                key={a.id}
                to={`/student/assignments/${a.id}`}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 transition"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {a.title}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    Due: {formatDateTime(a.deadline)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      a.deadlineInfo.urgency === 'red'
                        ? 'bg-red-50 text-red-700'
                        : a.deadlineInfo.urgency === 'orange'
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-amber-50 text-amber-700'
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

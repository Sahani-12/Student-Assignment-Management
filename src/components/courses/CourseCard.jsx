import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Users } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';

export default function CourseCard({
  course,
  isProfessor = false,
  to,
}) {
  const destination =
    to ||
    (isProfessor
      ? `/professor/courses/${course.id}/assignments`
      : `/student/courses/${course.id}/assignments`);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-card-hover">
      <div>
        {/* Top Badges & Semester */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {course.code}
          </span>
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {course.semester}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
          {course.name}
        </h3>
        {course.description && (
          <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Quick Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {isProfessor ? 'Students' : 'Role'}
              </p>
              <p className="text-sm font-bold text-slate-800">
                {isProfessor ? `${course.studentsCount || course.studentIds?.length || 0} Enrolled` : 'Student'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Assignments
              </p>
              <p className="text-sm font-bold text-slate-800">
                {isProfessor
                  ? `${course.assignmentsCount || 0} Total`
                  : `${course.acknowledgedAssignments || 0} of ${course.totalAssignments || 0}`}
              </p>
            </div>
          </div>
        </div>

        {/* Submission / Academic Progress Bar */}
        <div className="mt-4 space-y-1">
          <ProgressBar
            value={isProfessor ? course.submissionProgress : course.progress}
            label={isProfessor ? 'Submission Progress' : 'Course Progress'}
            colorScheme={
              (isProfessor ? course.submissionProgress : course.progress) === 100
                ? 'emerald'
                : 'indigo'
            }
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-2">
        <Link
          to={destination}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-bold text-indigo-600 border border-slate-200/80 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-sm"
        >
          {isProfessor ? 'View Course' : 'View Assignments'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

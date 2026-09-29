import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Users, GraduationCap, Award } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';

const THEME_ACCENTS = {
  indigo: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    bar: 'indigo',
    stripe: 'from-indigo-600 to-indigo-400',
  },
  blue: {
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    bar: 'indigo',
    stripe: 'from-blue-600 to-sky-400',
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    bar: 'emerald',
    stripe: 'from-emerald-600 to-teal-400',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    bar: 'auto',
    stripe: 'from-amber-600 to-yellow-400',
  },
};

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

  const accent = THEME_ACCENTS[course.color] || THEME_ACCENTS.indigo;
  const progressVal = isProfessor ? course.submissionProgress : course.progress;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2.5xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/80 hover:shadow-card-hover">
      {/* Top subtle gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent.stripe} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div>
        {/* Top Badges & Semester */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold border ${accent.badge}`}>
            {course.code}
          </span>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {course.semester}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {course.name}
        </h3>
        {course.description && (
          <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Quick Stats Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 shadow-xs">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isProfessor ? 'Students' : 'Role'}
              </p>
              <p className="text-sm font-extrabold text-slate-800">
                {isProfessor ? `${course.studentsCount || course.studentIds?.length || 0} Enrolled` : 'Enrolled'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 shadow-xs">
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Assignments
              </p>
              <p className="text-sm font-extrabold text-slate-800">
                {isProfessor
                  ? `${course.assignmentsCount || 0} Total`
                  : `${course.acknowledgedAssignments || 0} of ${course.totalAssignments || 0}`}
              </p>
            </div>
          </div>
        </div>

        {/* Submission / Academic Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <ProgressBar
            value={progressVal}
            label={isProfessor ? 'Submission Progress' : 'Course Progress'}
            colorScheme={progressVal === 100 ? 'emerald' : 'indigo'}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-2">
        <Link
          to={destination}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50/90 py-2.5 text-sm font-bold text-indigo-600 border border-slate-200/90 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:shadow-indigo-600/20 active:scale-[0.99]"
        >
          <span>{isProfessor ? 'View Course' : 'View Assignments'}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import AssignmentStatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { getAssignmentStatus } from '../../utils/assignmentStatus';
import { getStudentAssignmentProgress } from '../../utils/progress';
import { formatDisplayDate } from '../../utils/storage';

export default function AssignmentCard({ assignment, studentId }) {
  const submission = assignment.submissions?.[studentId];
  const status = getAssignmentStatus(submission, assignment.dueDate);
  const progress = getStudentAssignmentProgress(submission);

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-card-hover">
      <div>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {assignment.subject}
            </p>
          </div>
          <AssignmentStatusBadge status={status} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {assignment.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Due: {formatDisplayDate(assignment.dueDate)}
          </span>
        </div>

        <div className="mb-5">
          <ProgressBar value={progress} label="Progress" />
        </div>

        <Link
          to={`/student/assignments/${assignment.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
        >
          View Assignment
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

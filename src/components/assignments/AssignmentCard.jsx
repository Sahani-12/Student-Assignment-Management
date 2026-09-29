import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  Users,
  User,
  Clock,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { getDeadlineInfo, formatDateTime } from '../../utils/dateUtils';
import { getAssignmentProgress } from '../../utils/progressUtils';
import { getGroups } from '../../utils/storage';

export default function AssignmentCard({
  assignment,
  isProfessor = false,
  studentId,
  onDelete,
}) {
  const isGroup = assignment.submissionType === 'group';

  // Compute acknowledgment for student
  let isAcknowledged = false;

  if (!isProfessor && studentId) {
    if (isGroup) {
      const groups = getGroups();
      const studentGroup = groups.find(
        (g) => g.courseId === assignment.courseId && g.memberIds?.includes(studentId)
      );
      if (studentGroup) {
        const sub = assignment.submissions?.[studentGroup.id];
        isAcknowledged = sub?.submitted === true;
      }
    } else {
      isAcknowledged = assignment.submissions?.[studentId]?.submitted === true;
    }
  }

  const deadlineInfo = getDeadlineInfo(assignment.deadline, isAcknowledged);
  const progressStats = getAssignmentProgress(assignment);

  return (
    <article className="group flex flex-col justify-between rounded-2.5xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/80 hover:shadow-card-hover">
      <div>
        {/* Header with Type and Deadline Urgency Badge */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <StatusBadge status={assignment.submissionType} type="submissionType" />
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                deadlineInfo.urgency === 'red'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : deadlineInfo.urgency === 'orange'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : deadlineInfo.urgency === 'amber'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : deadlineInfo.urgency === 'green'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Clock className="h-3 w-3 shrink-0" />
              {deadlineInfo.label}
            </span>
          </div>

          {!isProfessor && (
            <StatusBadge
              status={
                isAcknowledged
                  ? 'acknowledged'
                  : deadlineInfo.isOverdue
                  ? 'overdue'
                  : 'pending'
              }
            />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
          {assignment.title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {assignment.description}
        </p>

        {/* Due Date Details */}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>Due: <strong className="text-slate-700">{formatDateTime(assignment.deadline)}</strong></span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
        {isProfessor ? (
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
              <span>Submissions</span>
              <span className="font-extrabold text-slate-900">
                {progressStats.completed} / {progressStats.total}{' '}
                {isGroup ? 'Groups' : 'Students'} ({progressStats.percentage}%)
              </span>
            </div>
            <ProgressBar
              value={progressStats.percentage}
              showValue={false}
              colorScheme={progressStats.percentage === 100 ? 'emerald' : 'indigo'}
            />

            {/* Actions for Professor */}
            <div className="mt-4 flex items-center gap-2 pt-1">
              <Link
                to={`/professor/assignments/${assignment.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50/90 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-600 hover:text-white hover:shadow-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                View Analytics
              </Link>
              <Link
                to={`/professor/assignments/edit/${assignment.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-xs"
                aria-label="Edit assignment"
                title="Edit assignment"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(assignment)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-red-600 transition hover:bg-red-50 hover:border-red-200 shadow-xs"
                  aria-label="Delete assignment"
                  title="Delete assignment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <Link
            to={`/student/assignments/${assignment.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50/90 py-2.5 text-sm font-bold text-indigo-600 border border-slate-200/90 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-sm active:scale-[0.99]"
          >
            <span>View Assignment Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

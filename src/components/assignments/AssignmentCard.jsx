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
  let leaderAckName = null;

  if (!isProfessor && studentId) {
    if (isGroup) {
      const groups = getGroups();
      const studentGroup = groups.find(
        (g) => g.courseId === assignment.courseId && g.memberIds?.includes(studentId)
      );
      if (studentGroup) {
        const sub = assignment.submissions?.[studentGroup.id];
        isAcknowledged = sub?.submitted === true;
        leaderAckName = sub?.leaderName;
      }
    } else {
      isAcknowledged = assignment.submissions?.[studentId]?.submitted === true;
    }
  }

  const deadlineInfo = getDeadlineInfo(assignment.deadline, isAcknowledged);

  // Professor progress metrics
  const progressStats = getAssignmentProgress(assignment);

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-card-hover">
      <div>
        {/* Header with Type and Status Badge */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <StatusBadge status={assignment.submissionType} type="submissionType" />
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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
              <Clock className="h-3 w-3" />
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
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {assignment.title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {assignment.description}
        </p>

        {/* Due Date Details */}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>Deadline: {formatDateTime(assignment.deadline)}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
        {isProfessor ? (
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
              <span>Submission Progress</span>
              <span className="font-bold text-slate-900">
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
            <div className="mt-4 flex items-center gap-2 pt-2">
              <Link
                to={`/professor/assignments/${assignment.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" />
                View Analytics
              </Link>
              <Link
                to={`/professor/assignments/edit/${assignment.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Edit assignment"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(assignment)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-red-600 transition hover:bg-red-50 hover:border-red-200"
                  aria-label="Delete assignment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <Link
            to={`/student/assignments/${assignment.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-indigo-600 border border-slate-200/80 transition hover:bg-indigo-600 hover:text-white hover:border-transparent"
          >
            View Assignment Details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

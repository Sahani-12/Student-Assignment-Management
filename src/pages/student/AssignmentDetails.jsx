import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Check, ExternalLink, FileText, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';
import AssignmentStatusBadge from '../../components/common/StatusBadge';
import ConfirmationModal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAssignmentStatus } from '../../utils/assignmentStatus';
import { formatDisplayDate } from '../../utils/storage';

export default function AssignmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { assignments, loading, submitForStudent } = useAssignments();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const assignment = useMemo(
    () => assignments.find((a) => a.id === id),
    [assignments, id]
  );

  if (loading) {
    return <LoadingSpinner label="Loading assignment details..." />;
  }

  if (!assignment) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <h2 className="text-xl font-bold text-slate-900">Assignment Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">The assignment you are looking for does not exist or has been removed.</p>
        <Link
          to="/student/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Privacy Protection: Only allow access if assignment is assigned to logged-in student
  if (!assignment.assignedStudents?.includes(user.id)) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const submission = assignment.submissions?.[user.id];
  const isSubmitted = submission?.submitted === true;
  const status = getAssignmentStatus(submission, assignment.dueDate);

  const handleConfirmSubmit = () => {
    submitForStudent(assignment.id, user.id);
    setConfirmOpen(false);
    showToast('Assignment submitted successfully');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/student/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Dashboard
      </Link>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {assignment.subject}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {assignment.title}
            </h1>
          </div>
          <AssignmentStatusBadge status={status} />
        </div>

        {/* Details Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description
            </h2>
            <p className="mt-2 text-slate-700 leading-relaxed text-base whitespace-pre-line">
              {assignment.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Due Date
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Calendar className="h-4 w-4 text-indigo-600" />
                {formatDisplayDate(assignment.dueDate)}
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Submission Workspace
              </span>
              <a
                href={assignment.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline"
              >
                Open Google Drive Folder
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Double-Verification Submission Section */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Submission Confirmation</h2>
          </div>

          {isSubmitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3 text-emerald-800">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
              <div>
                <p className="font-bold text-base">✓ Assignment Submitted</p>
                <p className="mt-0.5 text-xs text-emerald-700">
                  Submitted on: {formatDisplayDate(submission.submittedAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Please ensure you have uploaded your work to the provided Google Drive link before confirming your submission.
              </p>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Yes, I have submitted
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Double Confirmation Modal */}
      <ConfirmationModal
        open={confirmOpen}
        title="Confirm Submission"
        confirmLabel="Confirm Submission"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
      >
        Have you actually submitted this assignment to the Google Drive link? This action will mark your assignment as submitted.
      </ConfirmationModal>
    </div>
  );
}

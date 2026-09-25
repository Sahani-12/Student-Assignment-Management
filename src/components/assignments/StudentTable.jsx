import AssignmentStatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { getAssignmentStatus } from '../../utils/assignmentStatus';
import { getStudentAssignmentProgress } from '../../utils/progress';
import { formatDisplayDate } from '../../utils/storage';

export default function StudentTable({ students, assignment }) {
  if (!students.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
        No students assigned to this assignment.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left">
                Student
              </th>
              <th scope="col" className="px-6 py-3.5 text-left">
                Submission Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-left">
                Submitted At
              </th>
              <th scope="col" className="px-6 py-3.5 text-left">
                Individual Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const submission = assignment.submissions?.[student.id];
              const status = getAssignmentStatus(submission, assignment.dueDate);
              const progress = getStudentAssignmentProgress(submission);
              return (
                <tr key={student.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <AssignmentStatusBadge status={status} />
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {submission?.submittedAt
                      ? formatDisplayDate(submission.submittedAt)
                      : 'Not submitted yet'}
                  </td>
                  <td className="min-w-[180px] px-6 py-4">
                    <ProgressBar value={progress} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {students.map((student) => {
          const submission = assignment.submissions?.[student.id];
          const status = getAssignmentStatus(submission, assignment.dueDate);
          const progress = getStudentAssignmentProgress(submission);
          return (
            <div key={student.id} className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.email}</p>
                </div>
                <AssignmentStatusBadge status={status} />
              </div>
              <div className="text-xs text-slate-500">
                Submitted At:{' '}
                {submission?.submittedAt
                  ? formatDisplayDate(submission.submittedAt)
                  : 'Not submitted yet'}
              </div>
              <ProgressBar value={progress} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

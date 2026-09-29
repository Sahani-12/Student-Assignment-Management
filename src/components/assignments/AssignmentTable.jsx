import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import { getAssignmentProgress } from '../../utils/progressUtils';
import { formatDateTime } from '../../utils/dateUtils';

export default function AssignmentTable({ assignments, onDelete }) {
  if (!assignments.length) return null;

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card md:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4">
                Assignment
              </th>
              <th scope="col" className="px-6 py-4">
                Type
              </th>
              <th scope="col" className="px-6 py-4">
                Deadline
              </th>
              <th scope="col" className="px-6 py-4">
                Submissions
              </th>
              <th scope="col" className="px-6 py-4">
                Completion Rate
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.map((a) => {
              const stats = getAssignmentProgress(a);
              return (
                <tr key={a.id} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{a.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={a.submissionType} type="submissionType" />
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                    {formatDateTime(a.deadline)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold whitespace-nowrap">
                    {stats.completed} / {stats.total} {stats.isGroup ? 'groups' : 'students'}
                  </td>
                  <td className="min-w-[150px] px-6 py-4">
                    <ProgressBar value={stats.percentage} />
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1.5">
                      <Link
                        to={`/professor/assignments/${a.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 transition hover:bg-indigo-100"
                        title="View Analytics"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <Link
                        to={`/professor/assignments/edit/${a.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 transition hover:bg-slate-200"
                        title="Edit Assignment"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(a)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          title="Delete Assignment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Fallback */}
      <div className="space-y-4 md:hidden">
        {assignments.map((a) => {
          const stats = getAssignmentProgress(a);
          return (
            <article
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900">{a.title}</h3>
                  <div className="mt-1">
                    <StatusBadge status={a.submissionType} type="submissionType" />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {stats.completed}/{stats.total}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Deadline: {formatDateTime(a.deadline)}
              </p>

              <div className="mt-3">
                <ProgressBar value={stats.percentage} label="Submission Progress" />
              </div>

              <div className="mt-4 flex gap-2 pt-3 border-t border-slate-100">
                <Link
                  to={`/professor/assignments/${a.id}`}
                  className="flex-1 rounded-xl bg-indigo-50 py-2 text-center text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                >
                  Analytics
                </Link>
                <Link
                  to={`/professor/assignments/edit/${a.id}`}
                  className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Link>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(a)}
                    className="rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

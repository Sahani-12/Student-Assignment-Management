import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { getAssignmentCompletionStats } from '../../utils/progress';
import { formatDisplayDate } from '../../utils/storage';

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
                Due Date
              </th>
              <th scope="col" className="px-6 py-4">
                Students
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
              const stats = getAssignmentCompletionStats(a);
              return (
                <tr key={a.id} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{a.title}</p>
                    <p className="text-xs font-semibold text-indigo-600">{a.subject}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {formatDisplayDate(a.dueDate)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">
                    {stats.submitted} / {stats.total} submitted
                  </td>
                  <td className="min-w-[160px] px-6 py-4">
                    <ProgressBar value={stats.percentage} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/assignments/edit/${a.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                        aria-label={`Edit ${a.title}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(a)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        aria-label={`Delete ${a.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {assignments.map((a) => {
          const stats = getAssignmentCompletionStats(a);
          return (
            <article
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900">{a.title}</h3>
                  <p className="text-xs font-semibold text-indigo-600">{a.subject}</p>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {stats.submitted}/{stats.total}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Due: {formatDisplayDate(a.dueDate)}
              </p>

              <div className="mt-4">
                <ProgressBar value={stats.percentage} label="Progress" />
              </div>

              <div className="mt-4 flex gap-2 pt-3 border-t border-slate-100">
                <Link
                  to={`/admin/assignments/edit/${a.id}`}
                  className="flex-1 rounded-xl bg-indigo-50 py-2 text-center text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(a)}
                  className="flex-1 rounded-xl bg-red-50 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

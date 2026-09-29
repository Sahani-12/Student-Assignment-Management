import { CheckCircle2, Clock, Users, User, ExternalLink, Calendar } from 'lucide-react';
import StatCard from '../common/StatCard';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/dateUtils';
import GroupMembers from '../groups/GroupMembers';

export default function AssignmentAnalytics({ assignment, analytics }) {
  if (!assignment || !analytics) return null;

  const isGroup = analytics.isGroup;

  return (
    <div className="space-y-8">
      {/* Top Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={isGroup ? 'Total Groups' : 'Total Students'}
          value={analytics.total}
          icon={isGroup ? Users : User}
        />
        <StatCard
          label="Acknowledged"
          value={analytics.acknowledged}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Pending"
          value={analytics.pending}
          icon={Clock}
          accent="amber"
        />
        <StatCard
          label="Completion Rate"
          value={`${analytics.completion}%`}
          icon={CheckCircle2}
          accent={analytics.completion === 100 ? 'emerald' : 'indigo'}
        />
      </div>

      {/* Progress Bar Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-3">
        <div className="flex items-center justify-between text-sm font-bold text-slate-800">
          <span>Overall Submission Progress</span>
          <span className="text-indigo-600">
            {analytics.acknowledged} of {analytics.total} {isGroup ? 'groups' : 'students'} ({analytics.completion}%)
          </span>
        </div>
        <ProgressBar
          value={analytics.completion}
          showValue={false}
          size="lg"
          colorScheme={analytics.completion === 100 ? 'emerald' : 'indigo'}
        />
      </div>

      {/* Breakdown Section: Groups or Students */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isGroup ? 'Group Submissions' : 'Student Submissions'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isGroup
                ? 'Track acknowledgment statuses by student team and designated leader.'
                : 'Individual student submission and verification timestamps.'}
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {isGroup ? 'Group Logic' : 'Individual Logic'}
          </span>
        </div>

        {isGroup ? (
          <div className="divide-y divide-slate-100">
            {analytics.groups?.length === 0 ? (
              <p className="p-6 text-sm text-slate-500 text-center">
                No groups assigned or enrolled in this course yet.
              </p>
            ) : (
              analytics.groups?.map((grp) => (
                <div key={grp.groupId} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{grp.name}</span>
                        <StatusBadge status={grp.submitted ? 'acknowledged' : 'pending'} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Leader: <strong className="text-slate-700">{grp.leaderName}</strong>
                        {grp.submitted && grp.submittedAt && (
                          <span className="ml-2 text-emerald-700">
                            · Acknowledged on {formatDateTime(grp.submittedAt)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Team Members ({grp.members?.length || 0})
                    </p>
                    <GroupMembers
                      members={grp.members}
                      leaderId={grp.leaderId}
                      compact
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Roll / ID
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.students?.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-bold text-xs text-indigo-700">
                          {std.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{std.name}</p>
                          <p className="text-xs text-slate-500">{std.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      {std.rollNo || std.id}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={std.submitted ? 'acknowledged' : 'pending'} />
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {std.submittedAt ? formatDateTime(std.submittedAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

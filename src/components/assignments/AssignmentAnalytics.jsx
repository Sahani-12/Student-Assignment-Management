import { useState, useMemo } from 'react';
import { CheckCircle2, Clock, Users, User, ExternalLink, Calendar, Search, Filter, ShieldCheck } from 'lucide-react';
import StatCard from '../common/StatCard';
import ProgressBar from '../common/ProgressBar';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/dateUtils';
import GroupMembers from '../groups/GroupMembers';

export default function AssignmentAnalytics({ assignment, analytics }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'acknowledged' | 'pending'

  if (!assignment || !analytics) return null;

  const isGroup = analytics.isGroup;

  const filteredGroups = useMemo(() => {
    if (!isGroup || !analytics.groups) return [];
    return analytics.groups.filter((grp) => {
      const matchesSearch =
        !search.trim() ||
        grp.name?.toLowerCase().includes(search.toLowerCase()) ||
        grp.leaderName?.toLowerCase().includes(search.toLowerCase()) ||
        grp.members?.some((m) => m.name?.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        filter === 'all' ||
        (filter === 'acknowledged' && grp.submitted) ||
        (filter === 'pending' && !grp.submitted);

      return matchesSearch && matchesStatus;
    });
  }, [isGroup, analytics.groups, search, filter]);

  const filteredStudents = useMemo(() => {
    if (isGroup || !analytics.students) return [];
    return analytics.students.filter((std) => {
      const matchesSearch =
        !search.trim() ||
        std.name?.toLowerCase().includes(search.toLowerCase()) ||
        std.email?.toLowerCase().includes(search.toLowerCase()) ||
        (std.rollNo && std.rollNo.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        filter === 'all' ||
        (filter === 'acknowledged' && std.submitted) ||
        (filter === 'pending' && !std.submitted);

      return matchesSearch && matchesStatus;
    });
  }, [isGroup, analytics.students, search, filter]);

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
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-slate-900">Submission Rate</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              {analytics.completion === 100 ? '100% Completed' : `${analytics.completion}% Done`}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            <strong className="text-indigo-600 font-bold">{analytics.acknowledged}</strong> of {analytics.total} {isGroup ? 'groups' : 'students'} acknowledged
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
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-card overflow-hidden">
        {/* Header with Title and Type pill */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              {isGroup ? 'Group Logic' : 'Individual Logic'}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50/70 p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isGroup ? 'Filter by team name, leader, or member...' : 'Filter by student name, roll no, email...'}
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-2xs transition focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {['all', 'acknowledged', 'pending'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilter(opt)}
                className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition ${
                  filter === opt
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {isGroup ? (
          <div className="divide-y divide-slate-100">
            {filteredGroups.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                {search || filter !== 'all' ? 'No groups match your search or filter.' : 'No groups assigned or enrolled in this course yet.'}
              </div>
            ) : (
              filteredGroups.map((grp) => (
                <div key={grp.groupId} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{grp.name}</span>
                        <StatusBadge status={grp.submitted ? 'acknowledged' : 'pending'} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Leader: <strong className="text-slate-800">{grp.leaderName}</strong>
                        {grp.submitted && grp.submittedAt && (
                          <span className="ml-2 font-medium text-emerald-700">
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
            {filteredStudents.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                {search || filter !== 'all' ? 'No students match your search or filter.' : 'No students enrolled in this course yet.'}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                  {filteredStudents.map((std) => (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}


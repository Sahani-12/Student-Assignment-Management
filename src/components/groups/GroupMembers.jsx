import { Crown, User } from 'lucide-react';

export default function GroupMembers({ members = [], leaderId, compact = false }) {
  if (!members.length) return null;

  return (
    <div className={`grid gap-2.5 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
      {members.map((member) => {
        const isLeader = member.id === leaderId || member.isLeader;
        const initials = member.name
          ? member.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2)
          : 'U';

        return (
          <div
            key={member.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isLeader
                ? 'border-amber-200 bg-amber-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-xs ${
                isLeader
                  ? 'bg-amber-500 text-white'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-bold text-slate-900">
                  {member.name}
                </p>
                {isLeader && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    <Crown className="h-3 w-3 text-amber-600" />
                    Leader
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-slate-500">
                {member.email || member.rollNo || 'Student Member'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

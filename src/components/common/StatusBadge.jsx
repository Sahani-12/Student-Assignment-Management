import { AlertTriangle, Check, Circle, Clock, Users, User } from 'lucide-react';

export default function StatusBadge({ status, type }) {
  if (type === 'submissionType') {
    const isGroup = status === 'group';
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isGroup
            ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20'
            : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20'
        }`}
      >
        {isGroup ? (
          <Users className="h-3 w-3" aria-hidden="true" />
        ) : (
          <User className="h-3 w-3" aria-hidden="true" />
        )}
        {isGroup ? 'Group' : 'Individual'}
      </span>
    );
  }

  // Status mapping
  const normalized = status?.toLowerCase() || 'pending';
  let label = 'Pending';
  let className = 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
  let Icon = Circle;

  if (normalized === 'submitted' || normalized === 'acknowledged') {
    label = 'Acknowledged';
    className = 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    Icon = Check;
  } else if (normalized === 'overdue') {
    label = 'Overdue';
    className = 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
    Icon = AlertTriangle;
  } else if (normalized === 'due-soon') {
    label = 'Due Soon';
    className = 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20';
    Icon = Clock;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

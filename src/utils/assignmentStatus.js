const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getAssignmentStatus(submission, dueDate) {
  if (submission?.submitted) {
    return 'submitted';
  }

  if (!dueDate) return 'pending';

  const now = new Date();
  const due = new Date(`${dueDate}T23:59:59`);
  const diffDays = (due.getTime() - now.getTime()) / MS_PER_DAY;

  if (now > due) {
    return 'overdue';
  }

  if (diffDays >= 0 && diffDays <= 2) {
    return 'due-soon';
  }

  return 'pending';
}

export const STATUS_CONFIG = {
  submitted: {
    label: 'Submitted',
    icon: 'check',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 border border-emerald-200/50',
  },
  pending: {
    label: 'Pending',
    icon: 'circle',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20 border border-amber-200/50',
  },
  'due-soon': {
    label: 'Due Soon',
    icon: 'clock',
    className: 'bg-orange-50 text-orange-700 ring-orange-600/20 border border-orange-200/50',
  },
  overdue: {
    label: 'Overdue',
    icon: 'alert',
    className: 'bg-red-50 text-red-700 ring-red-600/20 border border-red-200/50',
  },
};

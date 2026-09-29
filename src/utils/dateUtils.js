/**
 * Date and deadline formatting utilities
 */

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}

/**
 * Returns deadline badge info:
 * - label: "Due in 3 days", "Due tomorrow", "Due today", "Overdue", "Submitted"
 * - urgency: 'normal' | 'amber' | 'orange' | 'red' | 'green'
 */
export function getDeadlineInfo(deadlineIso, isSubmitted = false) {
  if (isSubmitted) {
    return {
      label: 'Submitted',
      urgency: 'green',
      isOverdue: false,
    };
  }

  if (!deadlineIso) {
    return {
      label: 'No deadline',
      urgency: 'normal',
      isOverdue: false,
    };
  }

  const now = new Date();
  const due = new Date(deadlineIso);

  if (isNaN(due.getTime())) {
    return { label: deadlineIso, urgency: 'normal', isOverdue: false };
  }

  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) {
    return {
      label: 'Overdue',
      urgency: 'red',
      isOverdue: true,
    };
  }

  if (diffHours <= 24) {
    if (due.getDate() === now.getDate()) {
      return {
        label: 'Due today',
        urgency: 'orange',
        isOverdue: false,
      };
    }
    return {
      label: 'Due tomorrow',
      urgency: 'amber',
      isOverdue: false,
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Due tomorrow',
      urgency: 'amber',
      isOverdue: false,
    };
  }

  if (diffDays <= 5) {
    return {
      label: `Due in ${diffDays} days`,
      urgency: 'amber',
      isOverdue: false,
    };
  }

  return {
    label: `Due in ${diffDays} days`,
    urgency: 'normal',
    isOverdue: false,
  };
}

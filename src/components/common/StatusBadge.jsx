import { AlertTriangle, Check, Circle, Clock } from 'lucide-react';
import { STATUS_CONFIG } from '../../utils/assignmentStatus';

const icons = {
  check: Check,
  circle: Circle,
  clock: Clock,
  alert: AlertTriangle,
};

export default function AssignmentStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = icons[config.icon] || Circle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-xs ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}

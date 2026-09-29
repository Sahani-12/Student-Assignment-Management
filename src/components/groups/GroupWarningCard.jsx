import { UserX, Users } from 'lucide-react';
import Button from '../common/Button';

export default function GroupWarningCard({ onOpenGroupModal }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/70 p-6 sm:p-8 text-center sm:text-left transition-all">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-xs border border-amber-200">
          <UserX className="h-7 w-7" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200/60 text-amber-900">
            <Users className="h-3.5 w-3.5" />
            Group Assignment Required
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            You&apos;re not in a group yet
          </h3>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            You are not part of any group. Form or join one to submit this assignment.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              icon={Users}
              onClick={onOpenGroupModal}
            >
              Create / Join Group
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

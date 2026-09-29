import { useState } from 'react';
import { Plus, Users, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import Button from '../common/Button';
import { groupService } from '../../services/groupService';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';

export default function JoinGroupModal({
  open,
  onClose,
  courseId,
  user,
  onGroupJoined,
}) {
  const { createGroup, joinGroup } = useAssignments();
  const { showToast } = useToast();

  const [mode, setMode] = useState('join'); // 'join' | 'create'
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const courseGroups = groupService.getGroupsByCourse(courseId);

  const handleJoin = () => {
    if (!selectedGroupId) {
      showToast('Please select a group to join', 'error');
      return;
    }
    const updated = joinGroup(selectedGroupId, user.id);
    showToast(`Successfully joined group!`);
    onGroupJoined?.(updated);
    onClose();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      showToast('Please enter a group name', 'error');
      return;
    }
    const newGroup = createGroup({
      name: newGroupName.trim(),
      courseId,
      leaderId: user.id,
      leaderName: user.name,
    });
    showToast(`Group "${newGroup.name}" created! You are the leader.`);
    onGroupJoined?.(newGroup);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Group Management"
      cancelLabel="Cancel"
      confirmLabel={mode === 'join' ? 'Join Group' : 'Create Group'}
      onCancel={onClose}
      onConfirm={mode === 'join' ? handleJoin : handleCreate}
      confirmDisabled={mode === 'join' && !selectedGroupId && courseGroups.length > 0}
    >
      <div className="space-y-4 pt-1">
        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('join')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'join'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Join Existing Group
          </button>
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'create'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Group
          </button>
        </div>

        {mode === 'join' ? (
          <div className="space-y-3">
            {courseGroups.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                No groups created yet for this course. Switch to &quot;Create New Group&quot; to form the first one!
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <p className="text-xs font-semibold text-slate-600">
                  Select a team to join:
                </p>
                {courseGroups.map((grp) => {
                  const isSelected = selectedGroupId === grp.id;
                  return (
                    <div
                      key={grp.id}
                      onClick={() => setSelectedGroupId(grp.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">{grp.name}</p>
                        <p className="text-xs text-slate-500">
                          Leader: {grp.leaderName} · {grp.memberIds?.length || 1} members
                        </p>
                      </div>
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label htmlFor="groupName" className="block text-xs font-bold text-slate-700 mb-1">
                Team / Group Name
              </label>
              <input
                id="groupName"
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Team Phoenix"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <p className="text-xs text-slate-500">
              As the group creator, you will become the designated <strong>Group Leader</strong> and will have submission authorization for group assignments.
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}

import { useNavigate } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';
import AssignmentForm from '../../components/assignments/AssignmentForm';

export default function CreateAssignment() {
  const { user } = useAuth();
  const { addAssignment } = useAssignments();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (payload) => {
    addAssignment({ ...payload, createdBy: user.id });
    showToast('Assignment created successfully');
    navigate('/admin/assignments');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-slate-900">Create New Assignment</h1>
        <p className="text-sm font-medium text-slate-500">
          Fill in the details, set a due date, attach a Google Drive link, and assign students.
        </p>
      </header>

      <AssignmentForm
        submitLabel="Create Assignment"
        onCancelTo="/admin/assignments"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';
import AssignmentForm from '../../components/assignments/AssignmentForm';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function EditAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assignments, updateAssignment } = useAssignments();
  const { showToast } = useToast();

  const assignment = useMemo(() => {
    return assignments.find((a) => a.id === id);
  }, [assignments, id]);

  const handleUpdate = async (payload) => {
    updateAssignment(id, payload);
    showToast(`Assignment updated successfully!`);
    navigate(`/professor/courses/${payload.courseId}/assignments`);
  };

  if (!assignment) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Assignment Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested assignment does not exist or has been removed.
        </p>
        <Link
          to="/professor/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/professor/dashboard', showHomeIcon: true },
          {
            label: 'Course Assignments',
            to: `/professor/courses/${assignment.courseId}/assignments`,
          },
          { label: 'Edit Assignment' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Edit Assignment
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update assignment information. Existing student submissions and acknowledgment records are automatically preserved.
        </p>
      </div>

      <AssignmentForm
        initialValues={assignment}
        submitLabel="Save Changes"
        onSubmit={handleUpdate}
        onCancelTo={`/professor/courses/${assignment.courseId}/assignments`}
        isEditing={true}
      />
    </div>
  );
}

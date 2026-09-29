import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';
import AssignmentForm from '../../components/assignments/AssignmentForm';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function CreateAssignment() {
  const [searchParams] = useSearchParams();
  const preselectedCourseId = searchParams.get('courseId');
  const { user } = useAuth();
  const { addAssignment } = useAssignments();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const created = addAssignment({
      ...payload,
      createdBy: user?.id,
    });
    showToast(`Assignment "${created.title}" created successfully!`);
    navigate(`/professor/courses/${payload.courseId}/assignments`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/professor/dashboard', showHomeIcon: true },
          { label: 'Create Assignment' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Create New Assignment
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure assignment details, select individual or group submission mode, set deadlines, and attach cloud submission folders.
        </p>
      </div>

      <AssignmentForm
        initialValues={{ courseId: preselectedCourseId || '' }}
        submitLabel="Publish Assignment"
        onSubmit={handleCreate}
        onCancelTo={
          preselectedCourseId
            ? `/professor/courses/${preselectedCourseId}/assignments`
            : '/professor/dashboard'
        }
      />
    </div>
  );
}

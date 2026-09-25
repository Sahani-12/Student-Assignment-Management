import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';
import AssignmentForm from '../../components/assignments/AssignmentForm';
import StudentTable from '../../components/assignments/StudentTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getUsers } from '../../utils/storage';

export default function EditAssignment() {
  const { id } = useParams();
  const { user } = useAuth();
  const { assignments, loading, updateAssignment } = useAssignments();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const assignment = useMemo(
    () => assignments.find((a) => a.id === id),
    [assignments, id]
  );

  const assignedStudents = useMemo(() => {
    if (!assignment) return [];
    const users = getUsers().filter((u) => u.role === 'student');
    return users.filter((u) => assignment.assignedStudents?.includes(u.id));
  }, [assignment]);

  if (loading) {
    return <LoadingSpinner label="Loading assignment details..." />;
  }

  if (!assignment || assignment.createdBy !== user.id) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <h2 className="text-xl font-bold text-slate-900">Assignment Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The assignment you are trying to edit does not exist or you do not have permission to access it.
        </p>
        <Link
          to="/admin/assignments"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assignments
        </Link>
      </div>
    );
  }

  const handleSubmit = (payload) => {
    updateAssignment(id, payload);
    showToast('Assignment updated successfully');
    navigate('/admin/assignments');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          to="/admin/assignments"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Assignments
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900">Edit Assignment</h1>
        <p className="text-sm font-medium text-slate-500">
          Modify details or student assignments without affecting existing student submission records.
        </p>
      </div>

      <AssignmentForm
        initialValues={assignment}
        submitLabel="Save Changes"
        onCancelTo="/admin/assignments"
        onSubmit={handleSubmit}
      />

      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Student Submission Tracker
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Monitor real-time submission status and individual progress for &quot;{assignment.title}&quot;.
          </p>
        </div>
        <StudentTable students={assignedStudents} assignment={assignment} />
      </section>
    </div>
  );
}

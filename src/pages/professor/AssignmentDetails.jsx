import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Pencil,
  BookOpen,
} from 'lucide-react';
import { useAssignments } from '../../context/AssignmentsContext';
import { courseService } from '../../services/courseService';
import { assignmentService } from '../../services/assignmentService';
import AssignmentAnalytics from '../../components/assignments/AssignmentAnalytics';
import StatusBadge from '../../components/common/StatusBadge';
import Breadcrumb from '../../components/common/Breadcrumb';
import { formatDateTime } from '../../utils/dateUtils';

export default function AssignmentDetails() {
  const { id } = useParams();
  const { assignments } = useAssignments();

  const assignment = useMemo(() => {
    return assignments.find((a) => a.id === id);
  }, [assignments, id]);

  const course = useMemo(() => {
    if (!assignment) return null;
    return courseService.getCourseById(assignment.courseId);
  }, [assignment]);

  const analytics = useMemo(() => {
    if (!assignment) return null;
    return assignmentService.getAssignmentAnalytics(assignment.id);
  }, [assignment, assignments]);

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/professor/dashboard', showHomeIcon: true },
          {
            label: course?.name || 'Course',
            to: `/professor/courses/${assignment.courseId}/assignments`,
          },
          { label: assignment.title },
        ]}
      />

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {course?.code || 'COURSE'}
              </span>
              <StatusBadge
                status={assignment.submissionType}
                type="submissionType"
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {assignment.title}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {assignment.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/professor/assignments/edit/${assignment.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
            {assignment.driveLink && (
              <a
                href={assignment.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                OneDrive Folder
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Deadline: <strong className="text-slate-700">{formatDateTime(assignment.deadline)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span>Course: <strong className="text-slate-700">{course?.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Analytics Component */}
      <AssignmentAnalytics
        assignment={assignment}
        analytics={analytics}
      />
    </div>
  );
}

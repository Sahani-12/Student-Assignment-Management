import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  ShieldAlert,
  User,
  Users,
  Crown,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useToast } from '../../context/ToastContext';
import { courseService } from '../../services/courseService';
import { groupService } from '../../services/groupService';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmationModal from '../../components/common/Modal';
import GroupWarningCard from '../../components/groups/GroupWarningCard';
import GroupMembers from '../../components/groups/GroupMembers';
import JoinGroupModal from '../../components/groups/JoinGroupModal';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import { formatDateTime, getDeadlineInfo } from '../../utils/dateUtils';

export default function StudentAssignmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    assignments,
    acknowledgeIndividual,
    acknowledgeGroup,
  } = useAssignments();
  const { showToast } = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  const assignment = useMemo(() => {
    return assignments.find((a) => a.id === id);
  }, [assignments, id]);

  const course = useMemo(() => {
    if (!assignment) return null;
    return courseService.getCourseById(assignment.courseId);
  }, [assignment]);

  const isGroup = assignment?.submissionType === 'group';

  // Group context for current student
  const studentGroup = useMemo(() => {
    if (!isGroup || !assignment) return null;
    const rawGroup = groupService.getStudentGroup(assignment.courseId, user?.id);
    if (!rawGroup) return null;
    return groupService.getGroupWithMembers(rawGroup.id);
  }, [isGroup, assignment, user?.id]);

  const isGroupLeader = studentGroup && studentGroup.leaderId === user?.id;

  // Acknowledgment status
  let isAcknowledged = false;
  let acknowledgedAt = null;
  let submittedByLeaderName = null;

  if (assignment) {
    if (isGroup) {
      if (studentGroup) {
        const sub = assignment.submissions?.[studentGroup.id];
        isAcknowledged = sub?.submitted === true;
        acknowledgedAt = sub?.submittedAt;
        submittedByLeaderName = sub?.leaderName || studentGroup.leaderName;
      }
    } else {
      const sub = assignment.submissions?.[user?.id];
      isAcknowledged = sub?.submitted === true;
      acknowledgedAt = sub?.submittedAt;
    }
  }

  const deadlineInfo = getDeadlineInfo(assignment?.deadline, isAcknowledged);

  const handleConfirmSubmit = () => {
    if (isGroup) {
      if (!studentGroup || !isGroupLeader) return;
      acknowledgeGroup(
        assignment.id,
        studentGroup.id,
        user.id,
        user.name
      );
      showToast('Group assignment acknowledged successfully for your team!');
    } else {
      acknowledgeIndividual(assignment.id, user.id);
      showToast('Assignment acknowledged successfully!');
    }
    setConfirmOpen(false);
  };

  if (!assignment) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Assignment Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested assignment does not exist or has been removed.
        </p>
        <Link
          to="/student/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/student/dashboard', showHomeIcon: true },
          {
            label: course?.name || 'Course',
            to: `/student/courses/${assignment.courseId}/assignments`,
          },
          { label: assignment.title },
        ]}
      />

      {/* Main Assignment Card */}
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                {course?.code} · {course?.name}
              </span>
              <StatusBadge
                status={assignment.submissionType}
                type="submissionType"
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {assignment.title}
            </h1>
          </div>

          <StatusBadge
            status={
              isAcknowledged
                ? 'acknowledged'
                : deadlineInfo.isOverdue
                ? 'overdue'
                : 'pending'
            }
          />
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Description & Instructions
          </h2>
          <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {assignment.description}
          </p>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Deadline */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Deadline
            </span>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>{formatDateTime(assignment.deadline)}</span>
            </div>
            <p
              className={`text-xs font-semibold ${
                deadlineInfo.urgency === 'red'
                  ? 'text-red-600'
                  : deadlineInfo.urgency === 'orange'
                  ? 'text-orange-600'
                  : deadlineInfo.urgency === 'amber'
                  ? 'text-amber-600'
                  : deadlineInfo.urgency === 'green'
                  ? 'text-emerald-600'
                  : 'text-slate-500'
              }`}
            >
              Status: {deadlineInfo.label}
            </p>
          </div>

          {/* Submission Workspace Link */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Submission Workspace
            </span>
            {assignment.driveLink ? (
              <a
                href={assignment.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline hover:text-indigo-700 transition"
              >
                Open OneDrive Folder
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span className="text-sm text-slate-400 font-medium">
                No external workspace link provided
              </span>
            )}
            <p className="text-xs text-slate-500">
              Upload your files before confirming submission.
            </p>
          </div>
        </div>

        {/* Section 24: Group Information Card (Only for Group Assignments) */}
        {isGroup && studentGroup && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Group
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {studentGroup.name}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                <Users className="h-3.5 w-3.5" />
                {studentGroup.members?.length || 0} Members
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2.5">
                Group Roster:
              </p>
              <GroupMembers
                members={studentGroup.members}
                leaderId={studentGroup.leaderId}
              />
            </div>
          </div>
        )}

        {/* Acknowledgment Workflow Area */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900">
              Submission Verification & Acknowledgment
            </h2>
          </div>

          {/* CASE 1: Individual Assignment */}
          {!isGroup && (
            <div>
              {isAcknowledged ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3.5 text-emerald-900">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-bold text-base text-emerald-950">
                      ✓ Acknowledged
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-800">
                      Submitted on: {formatDateTime(acknowledgedAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    ○ Not Acknowledged
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Please ensure all required project deliverables have been uploaded to the OneDrive folder above before recording your submission.
                  </p>
                  <div>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={Check}
                      onClick={() => setConfirmOpen(true)}
                    >
                      Yes, I have submitted
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CASE 2: Group Assignment */}
          {isGroup && (
            <div>
              {/* Subcase 2A: Student is NOT in any group (Section 23) */}
              {!studentGroup && (
                <GroupWarningCard
                  onOpenGroupModal={() => setGroupModalOpen(true)}
                />
              )}

              {/* Subcase 2B: Student IS in a group */}
              {studentGroup && (
                <div>
                  {isAcknowledged ? (
                    /* Group is Acknowledged */
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-3.5 text-emerald-900">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-bold text-base text-emerald-950">
                          ✓ Acknowledged
                        </p>
                        <p className="mt-1 text-sm text-emerald-800 font-medium">
                          {isGroupLeader
                            ? `You acknowledged this assignment on ${formatDateTime(acknowledgedAt)}.`
                            : `Your group leader ${submittedByLeaderName || 'Leader'} acknowledged this assignment.`}
                        </p>
                        <p className="mt-0.5 text-xs text-emerald-700">
                          Acknowledged on: {formatDateTime(acknowledgedAt)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Group is Pending */
                    <div>
                      {isGroupLeader ? (
                        /* Student is Leader (Section 22) */
                        <div className="space-y-4">
                          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 space-y-1">
                            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                              <Crown className="h-4 w-4 text-amber-600" />
                              You are the Group Leader.
                            </div>
                            <p className="text-xs text-amber-800">
                              As leader of &quot;{studentGroup.name}&quot;, you are authorized to submit and acknowledge this assignment on behalf of your team.
                            </p>
                          </div>
                          <p className="text-sm text-slate-600">
                            Confirm that your team has finished uploading all required files to the OneDrive folder.
                          </p>
                          <Button
                            variant="primary"
                            size="lg"
                            icon={Check}
                            onClick={() => setConfirmOpen(true)}
                          >
                            Yes, I have submitted
                          </Button>
                        </div>
                      ) : (
                        /* Student is regular Member (Section 22) */
                        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                            <Users className="h-4 w-4 text-indigo-600" />
                            👥 Group Submission
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            Your group leader has not acknowledged this assignment yet. Only the designated leader can submit for the group.
                          </p>
                          <div className="pt-1 text-xs font-semibold text-slate-500">
                            Leader:{' '}
                            <span className="text-slate-900 font-bold">
                              {studentGroup.leaderName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </article>

      {/* Confirmation Modal (Section 20 & Section 30) */}
      <ConfirmationModal
        open={confirmOpen}
        title="Confirm Submission"
        confirmLabel="Confirm Submission"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
      >
        <p className="text-slate-600 leading-relaxed">
          {isGroup
            ? `Please confirm that your team (${studentGroup?.name}) has uploaded all files to the OneDrive folder. This will acknowledge the submission for all members.`
            : 'Please confirm that you have submitted this assignment to the designated OneDrive folder. This will mark your assignment as acknowledged.'}
        </p>
      </ConfirmationModal>

      {/* Join / Create Group Modal (Section 23) */}
      <JoinGroupModal
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        courseId={assignment.courseId}
        user={user}
        onGroupJoined={() => {
          // Trigger re-render
        }}
      />
    </div>
  );
}

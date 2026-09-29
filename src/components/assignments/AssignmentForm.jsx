import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ExternalLink, Link2, User, Users } from 'lucide-react';
import Button from '../common/Button';
import { isValidUrl } from '../../utils/validation';
import { formatDateTime } from '../../utils/dateUtils';
import { getCourses } from '../../utils/storage';

export default function AssignmentForm({
  initialValues = {},
  submitLabel = 'Create Assignment',
  onSubmit,
  onCancelTo = '/professor/dashboard',
  isEditing = false,
}) {
  const courses = useMemo(() => getCourses(), []);

  // Format initial ISO date to datetime-local input string (YYYY-MM-DDTHH:mm)
  const formatInputDate = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const [form, setForm] = useState({
    title: initialValues.title || '',
    courseId: initialValues.courseId || courses[0]?.id || '',
    description: initialValues.description || '',
    deadline: formatInputDate(initialValues.deadline),
    driveLink: initialValues.driveLink || '',
    submissionType: initialValues.submissionType || 'individual',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) {
      errs.title = 'Assignment title is required.';
    }
    if (!form.courseId) {
      errs.courseId = 'Please select a course.';
    }
    if (!form.description.trim()) {
      errs.description = 'Description is required.';
    }
    if (!form.deadline) {
      errs.deadline = 'Please choose a deadline date and time.';
    }
    if (!form.driveLink.trim()) {
      errs.driveLink = 'OneDrive submission link is required.';
    } else if (!isValidUrl(form.driveLink)) {
      errs.driveLink = 'Please enter a valid URL (http:// or https://).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const isoDeadline = new Date(form.deadline).toISOString();
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        deadline: isoDeadline,
        driveLink: form.driveLink.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:p-8"
      noValidate
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-bold text-slate-800">
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. React Dashboard"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {errors.title && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        {/* Course Selector */}
        <div>
          <label htmlFor="courseId" className="block text-sm font-bold text-slate-800">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            id="courseId"
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.courseId}
            </p>
          )}
        </div>

        {/* Deadline with Date & Time */}
        <div>
          <label htmlFor="deadline" className="block text-sm font-bold text-slate-800">
            Deadline (Date & Time) <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              id="deadline"
              type="datetime-local"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          {form.deadline && (
            <p className="mt-1.5 text-xs font-medium text-indigo-700 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Will display as: {formatDateTime(form.deadline)}
            </p>
          )}
          {errors.deadline && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.deadline}
            </p>
          )}
        </div>

        {/* OneDrive / Workspace Link */}
        <div className="md:col-span-2">
          <label htmlFor="driveLink" className="block text-sm font-bold text-slate-800">
            OneDrive / Workspace URL <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="driveLink"
              type="url"
              value={form.driveLink}
              onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
              placeholder="https://onedrive.live.com/?id=..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          {errors.driveLink && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.driveLink}
            </p>
          )}
        </div>

        {/* Submission Type: Radio Cards */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Submission Type <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, submissionType: 'individual' })}
              className={`flex items-start gap-3 rounded-2xl p-4 text-left border transition-all ${
                form.submissionType === 'individual'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  form.submissionType === 'individual'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Individual</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Every student submits and acknowledges their assignment independently.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, submissionType: 'group' })}
              className={`flex items-start gap-3 rounded-2xl p-4 text-left border transition-all ${
                form.submissionType === 'group'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  form.submissionType === 'group'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Group</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Designated Group Leader submits and acknowledges on behalf of the entire team.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-bold text-slate-800">
            Description & Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Outline objectives, requirements, and deliverables..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3.5 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {errors.description && (
            <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-100">
        <Link
          to={onCancelTo}
          className="inline-flex justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={submitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

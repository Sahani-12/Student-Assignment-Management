import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, isValidDriveUrl } from '../../utils/storage';

const emptyForm = {
  title: '',
  subject: '',
  description: '',
  dueDate: '',
  driveLink: '',
  assignedStudents: [],
};

export default function AssignmentForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancelTo,
}) {
  const students = useMemo(
    () => getUsers().filter((u) => u.role === 'student'),
    []
  );

  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initialValues,
    assignedStudents: initialValues?.assignedStudents ?? [],
  }));
  const [errors, setErrors] = useState({});

  const toggleStudent = (id) => {
    setForm((prev) => {
      const set = new Set(prev.assignedStudents);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, assignedStudents: [...set] };
    });
  };

  const toggleAllStudents = () => {
    setForm((prev) => {
      if (prev.assignedStudents.length === students.length) {
        return { ...prev, assignedStudents: [] };
      }
      return { ...prev, assignedStudents: students.map((s) => s.id) };
    });
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.description.trim()) next.description = 'Description is required.';
    if (!form.dueDate) next.dueDate = 'Due date is required.';
    if (!isValidDriveUrl(form.driveLink)) {
      next.driveLink = 'Please enter a valid Google Drive URL (http:// or https://).';
    }
    if (!form.assignedStudents.length) {
      next.assignedStudents = 'Please select at least one student.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title.trim(),
      subject: form.subject.trim() || 'General',
      description: form.description.trim(),
      dueDate: form.dueDate,
      driveLink: form.driveLink.trim(),
      assignedStudents: form.assignedStudents,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:p-8"
      noValidate
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. React Dashboard Project"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {errors.title && (
            <p className="mt-1 text-xs font-medium text-red-600" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">
            Subject
          </label>
          <input
            id="subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="e.g. Web Development"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-semibold text-slate-700">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs font-medium text-red-600" role="alert">
              {errors.dueDate}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Provide detailed instructions for the assignment..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {errors.description && (
            <p className="mt-1 text-xs font-medium text-red-600" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="driveLink" className="block text-sm font-semibold text-slate-700">
            Google Drive Submission Link <span className="text-red-500">*</span>
          </label>
          <input
            id="driveLink"
            type="url"
            value={form.driveLink}
            onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
            placeholder="https://drive.google.com/folder/..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {errors.driveLink && (
            <p className="mt-1 text-xs font-medium text-red-600" role="alert">
              {errors.driveLink}
            </p>
          )}
        </div>
      </div>

      <fieldset className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-3">
          <legend className="text-sm font-semibold text-slate-700">
            Assign Students <span className="text-red-500">*</span>
          </legend>
          <button
            type="button"
            onClick={toggleAllStudents}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {form.assignedStudents.length === students.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {students.map((s) => {
            const isChecked = form.assignedStudents.includes(s.id);
            return (
              <label
                key={s.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                  isChecked
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleStudent(s.id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.email}</p>
                </div>
              </label>
            );
          })}
        </div>
        {errors.assignedStudents && (
          <p className="mt-2 text-xs font-medium text-red-600" role="alert">
            {errors.assignedStudents}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Link
          to={onCancelTo}
          className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="inline-flex justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

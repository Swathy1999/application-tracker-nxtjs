"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAuthHeaders } from "@/library/clientAuth";

type Props = {
  initialData?: Record<string, string>;
  applicationId?: string;
};

export default function ApplicationForm({ initialData, applicationId }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    company: initialData?.company || "",
    role: initialData?.role || "",
    location: initialData?.location || "",
    jobType: initialData?.jobType || "Full-time",
    salary: initialData?.salary || "",
    appliedDate: initialData?.appliedDate
      ? new Date(initialData.appliedDate).toISOString().slice(0, 10)
      : "",
    status: initialData?.status || "Applied",
    interviewDate: initialData?.interviewDate
      ? new Date(initialData.interviewDate).toISOString().slice(0, 10)
      : "",
    jobLink: initialData?.jobLink || "",
    notes: initialData?.notes || "",
  });

  const [saving, setSaving] = useState(false);

  // Set today's date after component mounts
  useEffect(() => {
    if (!initialData?.appliedDate) {
      const today = new Date().toISOString().slice(0, 10);

      setForm((old) => ({
        ...old,
        appliedDate: today,
      }));
    }
  }, [initialData?.appliedDate]);

  function update(key: string, value: string) {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.company.trim() || !form.role.trim() || !form.appliedDate) {
      toast.error("Company, role and applied date are required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        applicationId
          ? `/api/applications/${applicationId}`
          : "/api/applications",
        {
          method: applicationId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            ...form,
            interviewDate: form.interviewDate || null,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to save application");
      }

      toast.success(
        applicationId ? "Application updated" : "Application added",
      );

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const label = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Company name *</label>
          <input
            className={field}
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="e.g. ABC Technologies"
          />
        </div>

        <div>
          <label className={label}>Job role *</label>
          <input
            className={field}
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="e.g. Frontend Developer"
          />
        </div>

        <div>
          <label className={label}>Location</label>
          <input
            className={field}
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Manama, Bahrain"
          />
        </div>

        <div>
          <label className={label}>Job type</label>
          <select
            className={field}
            value={form.jobType}
            onChange={(e) => update("jobType", e.target.value)}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Remote</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </div>

        <div>
          <label className={label}>Salary / range</label>
          <input
            className={field}
            value={form.salary}
            onChange={(e) => update("salary", e.target.value)}
            placeholder="e.g. BHD 300 - 400"
          />
        </div>

        <div>
          <label className={label}>Applied date *</label>
          <input
            type="date"
            className={field}
            value={form.appliedDate}
            onChange={(e) => update("appliedDate", e.target.value)}
          />
        </div>

        <div>
          <label className={label}>Application status</label>
          <select
            className={field}
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>
        </div>

        <div>
          <label className={label}>Interview date</label>
          <input
            type="date"
            className={field}
            value={form.interviewDate}
            onChange={(e) => update("interviewDate", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={label}>Job posting link</label>
        <input
          type="url"
          className={field}
          value={form.jobLink}
          onChange={(e) => update("jobLink", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className={label}>Notes</label>
        <textarea
          rows={4}
          className={field}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Recruiter name, follow-up details, interview preparation..."
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : applicationId
              ? "Save changes"
              : "Add application"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

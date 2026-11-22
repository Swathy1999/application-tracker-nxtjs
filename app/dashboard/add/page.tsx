"use client";
import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";
import { FaBriefcase } from "react-icons/fa";
export default function AddApplication() {
  return (
    <main className="min-h-screen">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <Link href="/dashboard" className="font-bold text-indigo-700">
            <FaBriefcase className="mr-2 inline" /> CareerTrack
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-indigo-600"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-5 text-3xl font-bold">Add a job application</h1>
        <p className="mt-2 text-slate-500">
          Save the details so you can keep track of your progress.
        </p>
        <div className="mt-7 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <ApplicationForm />
        </div>
      </div>
    </main>
  );
}

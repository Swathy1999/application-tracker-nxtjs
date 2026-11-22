"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ApplicationForm from "@/components/ApplicationForm";
import { FaBriefcase } from "react-icons/fa";
import { clearAuth, getAuthHeaders } from "@/library/clientAuth";

interface EditApplicationProps {
  params: Promise<{ id: string }>;
}

export default function EditApplication({ params }: EditApplicationProps) {
  const { id } = use(params);
  const router = useRouter();

  const [item, setItem] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/applications/${id}`, {
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          if (res.status == 401) {
            clearAuth();
          }

          toast.error("Application not found or session expired");
          router.push("/dashboard");
          return;
        }

        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error("Error loading application:", error);
        toast.error("Failed to load application");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, router]);

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

        <h1 className="mt-5 text-3xl font-bold">Edit application</h1>

        <p className="mt-2 text-slate-500">
          Update the details and status of this opportunity.
        </p>

        <div className="mt-7 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {loading ? (
            <p>Loading application...</p>
          ) : !item ? (
            <p>Unable to load application.</p>
          ) : (
            <ApplicationForm initialData={item} applicationId={id} />
          )}
        </div>
      </div>
    </main>
  );
}
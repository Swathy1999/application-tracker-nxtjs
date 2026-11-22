"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBriefcase } from "react-icons/fa";
export default function Register() {
  const router = useRouter();
  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!details.name.trim() || !details.email.trim() || !details.password) {
      toast.error("Please complete all fields");
      return;
    }
    if (details.password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          name: details.name.trim(),
          email: details.email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      toast.success("Account created. Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 to-violet-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-indigo-700"
        >
          <FaBriefcase /> CareerTrack
        </Link>
        <h1 className="mt-8 text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-slate-500">
          Start organizing your career journey today.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Full name
            </label>
            <input
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email address
            </label>
            <input
              type="email"
              value={details.email}
              onChange={(e) =>
                setDetails({ ...details, email: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input
              type="password"
              value={details.password}
              onChange={(e) =>
                setDetails({ ...details, password: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?
          <Link href="/login" className="font-semibold text-indigo-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

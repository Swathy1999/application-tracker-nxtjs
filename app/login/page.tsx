"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBriefcase } from "react-icons/fa";
export default function Login() {
  const router = useRouter();
  const [details, setDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!details.email || !details.password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (!data.token)
        throw new Error("Login response did not include a token");
      localStorage.setItem("careertrack_token", data.token);
      localStorage.setItem("careertrack_user", JSON.stringify(data.user));
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
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
        <h1 className="mt-8 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-slate-500">
          Log in to continue managing your job search.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
              autoComplete="off"
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
              placeholder="Enter your password"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          New to CareerTrack?
          <Link href="/register" className="font-semibold text-indigo-600">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

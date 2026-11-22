import Link from "next/link";
import {FaBriefcase,FaChartLine,FaCalendarCheck,FaArrowRight,} from "react-icons/fa";
export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-indigo-700"
        >
          <FaBriefcase /> CareerTrack
        </Link>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-xl px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            Get started
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            YOUR JOB SEARCH, ORGANIZED
          </span>
          <h1 className="mt-7 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Your next opportunity starts with a{" "}
            <span className="text-indigo-600">better plan.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Keep every application, interview and follow-up in one simple
            workspace. Spend less time tracking and more time preparing for your
            next move.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
            >
              Create free account <FaArrowRight />
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 px-7 py-4 font-semibold text-slate-700 hover:bg-slate-50"
            >
              I already have an account
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-7 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <FaChartLine className="text-indigo-600" /> Track progress
            </span>
            <span className="flex items-center gap-2">
              <FaCalendarCheck className="text-indigo-600" /> Never miss
              interviews
            </span>
          </div>
        </div>
        <div className="rounded-3xl bg-linear-to-br from-indigo-600 to-violet-500 p-6 shadow-2xl shadow-indigo-200">
          <div className="rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Your job search overview
                </p>
                <h2 className="mt-1 text-2xl font-bold">Keep moving forward</h2>
              </div>
              <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FaBriefcase size={24} />
              </span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-indigo-50 p-4">
                <p className="text-sm text-slate-500">Applications</p>
                <p className="mt-2 text-3xl font-bold text-indigo-700">12</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-sm text-slate-500">Interviews</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">03</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-sm text-slate-500">Selected</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">02</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-4">
                <p className="text-sm text-slate-500">Rejected</p>
                <p className="mt-2 text-3xl font-bold text-rose-600">01</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-semibold">Recent activity</p>
              {[
                "Frontend Developer · Northstar",
                "Web Developer · Bright Labs",
                "UI Developer · PixelWorks",
              ].map((item, i) => (
                <div
                  key={item}
                  className="mt-3 flex items-center justify-between border-b border-slate-100 pb-3 text-sm"
                >
                  <span className="text-slate-700">{item}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}
                  >
                    {["Interview", "Applied", "Selected"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-500">
        &copy; 2026 CareerTrack. Make your next move count.
      </footer>
    </main>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FaBriefcase,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrash,
  FaEdit,
  FaChartPie,
} from "react-icons/fa";
import { clearAuth, getAuthHeaders } from "@/library/clientAuth";
type Application = {
  _id: string;
  company: string;
  role: string;
  location: string;
  status: string;
  appliedDate: string;
  interviewDate?: string;
  jobType: string;
  salary: string;
};
const statusStyles: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-amber-100 text-amber-700",
  Selected: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
};
export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<Application[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  async function load() {
    try {
      const [meRes, appRes] = await Promise.all([
        fetch("/api/auth/me", { headers: getAuthHeaders() }),
        fetch("/api/applications", { headers: getAuthHeaders() }),
      ]);
      if (!meRes.ok || !appRes.ok) {
        clearAuth();
        router.push("/login");
        return;
      }
      const me = await meRes.json();
      const apps = await appRes.json();
      setName(me.user.name);
      setItems(apps);
    } catch {
      toast.error("Could not load your dashboard");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    const res = await fetch(`/api/applications/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      setItems((old) => old.filter((x) => x._id !== id));
      toast.success("Application deleted");
    } else toast.error("Could not delete application");
  }
  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();

      router.replace("/login");
      router.refresh();
    }
  }
  const filtered = useMemo(
    () =>
      items.filter(
        (x) =>
          (filter == "All" || x.status == filter) &&
          `${x.company} ${x.role}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, filter, search],
  );
  const count = (s: string) => items.filter((x) => x.status == s).length;
  if (loading)
    return (
      <div className="p-20 text-center text-lg">Loading your dashboard...</div>
    );
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-bold text-indigo-700"
          >
            <FaBriefcase /> CareerTrack
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              Hello, <b>{name}</b>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Your workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Job applications
            </h1>
            <p className="mt-2 text-slate-500">
              A clear view of every opportunity you are pursuing.
            </p>
          </div>
          <Link
            href="/dashboard/add"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow hover:bg-indigo-700"
          >
            <FaPlus /> Add application
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total applications",
              value: items.length,
              icon: <FaBriefcase />,
              color: "text-indigo-600 bg-indigo-50",
            },
            {
              label: "Interviews",
              value: count("Interview"),
              icon: <FaCalendarAlt />,
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Selected",
              value: count("Selected"),
              icon: <FaChartPie />,
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Rejected",
              value: count("Rejected"),
              icon: <FaChartPie />,
              color: "text-rose-600 bg-rose-50",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{card.label}</span>
                <span className={`rounded-xl p-3 ${card.color}`}>
                  {card.icon}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold">
              All applications{" "}
              <span className="text-sm font-normal text-slate-400">
                ({filtered.length})
              </span>
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company or role"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 outline-none focus:border-indigo-500 sm:w-64"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
              >
                <option>All</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
          {filtered.length == 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FaBriefcase size={24} />
              </div>
              <h3 className="mt-4 font-semibold">No applications found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Add an application or change your search filter.
              </p>
              <Link
                href="/dashboard/add"
                className="mt-4 inline-block font-semibold text-indigo-600"
              >
                + Add your first application
              </Link>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-190 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="rounded-l-lg px-4 py-3 font-medium">
                      Company / Role
                    </th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Applied date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="rounded-r-lg px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-800">
                          {item.company}
                        </p>
                        <p className="mt-1 text-slate-500">{item.role}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt />
                          {item.location || "Not specified"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {new Date(item.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[item.status] || "bg-slate-100 text-slate-600"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/dashboard/${item._id}`}
                            title="Edit"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <FaEdit size={17} />
                          </Link>
                          <button
                            title="Delete"
                            onClick={() => remove(item._id)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

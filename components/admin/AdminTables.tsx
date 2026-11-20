"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Trash2 } from "lucide-react";
import type { Report, Role, User } from "@/types";

// ── Users table ──────────────────────────────────────────────────────────────

export function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeRole(userId: string, role: Role) {
    setBusyId(userId);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Could not update role.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update role.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(userId: string) {
    if (!window.confirm("Remove this user? Their data will be deleted.")) return;
    setBusyId(userId);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Could not remove user.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove user.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[13px] text-muted">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Email</th>
              <th className="pb-3 pr-4 font-medium">Role</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-3 pr-4 font-medium text-navy-950">{u.name}</td>
                <td className="py-3 pr-4 text-muted">{u.email}</td>
                <td className="py-3 pr-4">
                  <select
                    aria-label={`Role for ${u.name}`}
                    className="input-field !w-auto !py-1.5 !text-[13px]"
                    value={u.role}
                    disabled={busyId === u.id || u.id === "user-admin"}
                    onChange={(e) => changeRole(u.id, e.target.value as Role)}
                  >
                    <option value="student">student</option>
                    <option value="teacher">teacher</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="py-3">
                  {busyId === u.id ? (
                    <Loader2 className="size-4 animate-spin text-muted" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => remove(u.id)}
                      disabled={u.id === "user-admin"}
                      className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      aria-label={`Remove ${u.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Reports table ────────────────────────────────────────────────────────────

export function ReportsTable({ reports }: { reports: Report[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(reportId: string, status: Report["status"]) {
    setBusyId(reportId);
    setError(null);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Could not update report.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update report.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>
      )}
      {reports.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-paper px-5 py-10 text-center text-sm text-muted">
          No reports yet, reported content will appear here.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {reports.map((r) => (
            <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-navy-950">
                  {r.targetType} · {r.targetId}
                  <span className={`badge ${r.status === "open" ? "!border-red-200 !bg-red-50 !text-red-700" : ""}`}>
                    {r.status}
                  </span>
                </p>
                <p className="mt-1 text-sm text-navy-800">Reason: {r.reason}</p>
                {r.details && <p className="mt-0.5 text-[13px] text-muted">{r.details}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  disabled={busyId === r.id}
                  onClick={() => setStatus(r.id, r.status === "open" ? "resolved" : "open")}
                >
                  <ShieldCheck className="size-3.5" />
                  {r.status === "open" ? "Resolve" : "Reopen"}
                </button>
                {r.status === "open" && (
                  <button type="button" className="btn-ghost btn-sm text-muted" disabled={busyId === r.id} onClick={() => setStatus(r.id, "dismissed")}>
                    Dismiss
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

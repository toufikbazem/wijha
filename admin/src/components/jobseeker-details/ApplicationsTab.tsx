import { useEffect, useRef, useState } from "react";
import { Trash2, Briefcase } from "lucide-react";
import { toast } from "sonner";

import AdminPagination from "@/components/AdminPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";
const limit = 10;

export default function ApplicationsTab({ seekerId }: { seekerId: string }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    fetch(`${BASE}/admin/job-seekers/${seekerId}/applications?${params}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (id !== requestId.current) return;
        setApplications(data?.applications ?? []);
        setTotal(data?.total ?? data?.pagination?.total ?? 0);
      })
      .catch(() => {
        if (id !== requestId.current) return;
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setLoading(false);
      });
  }, [seekerId, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  async function deleteApplication(appId: string) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    setDeletingId(appId);
    try {
      const res = await fetch(
        `${BASE}/admin/job-seekers/${seekerId}/applications/${appId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Failed");
      }
      setApplications((prev) =>
        prev.filter((a) => a.application_id !== appId),
      );
      setTotal((t) => Math.max(0, t - 1));
      toast.success("Application deleted");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete application");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#008CBA] text-white w-10 h-10 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Applications</h2>
        </div>
        {!loading && (
          <span className="text-sm text-gray-500">
            {total} {total === 1 ? "application" : "applications"}
          </span>
        )}
      </div>

      {loading && (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-gray-300" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-4 gap-4 items-center"
            >
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className="h-6 w-full rounded-md bg-gray-300"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && applications.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No applications yet
          </h3>
          <p className="text-gray-500">
            Applications submitted by this job seeker will appear here.
          </p>
        </div>
      )}

      {!loading && applications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-[55%] px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-20 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((a) => {
                  const jobStatus = (a.job_status ?? "").toLowerCase();
                  const isActive = jobStatus === "active";

                  return (
                    <tr
                      key={a.application_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* job title + company logo + company name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {a.logo ? (
                            <img
                              src={a.logo}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                              {a.company_name?.[0] ?? "?"}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div
                              className="font-medium text-gray-900 truncate"
                              title={a.title || undefined}
                            >
                              {a.title || "—"}
                            </div>
                            <div
                              className="text-sm text-gray-500 truncate"
                              title={a.company_name || undefined}
                            >
                              {a.company_name || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* applied date */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {a.applied_at
                          ? new Date(a.applied_at).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* status (active / non-active) */}
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {isActive ? "Active" : "Non-active"}
                        </span>
                      </td>

                      {/* action */}
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={deletingId === a.application_id}
                            onClick={() =>
                              deleteApplication(a.application_id)
                            }
                            className="cursor-pointer p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete application"
                            aria-label="Delete application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <AdminPagination
                totalPages={totalPages}
                page={page}
                setPage={setPage}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

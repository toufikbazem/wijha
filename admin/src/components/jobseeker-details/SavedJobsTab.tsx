import { useEffect, useRef, useState } from "react";
import { Trash2, Bookmark } from "lucide-react";
import { toast } from "sonner";

import AdminPagination from "@/components/AdminPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";
const limit = 10;

export default function SavedJobsTab({ seekerId }: { seekerId: string }) {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    fetch(`${BASE}/admin/job-seekers/${seekerId}/saved?${params}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (id !== requestId.current) return;
        setSavedJobs(data?.savedJobs ?? []);
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

  async function removeSaved(savedId: string) {
    if (!confirm("Unsave this job? This cannot be undone.")) return;
    setRemovingId(savedId);
    try {
      const res = await fetch(
        `${BASE}/admin/job-seekers/${seekerId}/saved/${savedId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Failed");
      }
      setSavedJobs((prev) => prev.filter((s) => s.saved_id !== savedId));
      setTotal((t) => Math.max(0, t - 1));
      toast.success("Saved job removed");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to remove saved job");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#008CBA] text-white w-10 h-10 rounded-lg flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Saved Jobs</h2>
        </div>
        {!loading && (
          <span className="text-sm text-gray-500">
            {total} {total === 1 ? "saved job" : "saved jobs"}
          </span>
        )}
      </div>

      {loading && (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-gray-300" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-4 items-center">
              {Array.from({ length: 3 }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className="h-6 w-full rounded-md bg-gray-300"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && savedJobs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No saved jobs yet
          </h3>
          <p className="text-gray-500">
            Jobs saved by this job seeker will appear here.
          </p>
        </div>
      )}

      {!loading && savedJobs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-[60%] px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Saved
                  </th>
                  <th className="w-20 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {savedJobs.map((s) => (
                  <tr
                    key={s.saved_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* job title + company logo + company name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {s.logo ? (
                          <img
                            src={s.logo}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                            {s.company_name?.[0] ?? "?"}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div
                            onClick={() =>
                              navigate(`/job-posts/${s.job_post_id}`)
                            }
                            className="font-medium text-gray-900 truncate cursor-pointer hover:text-primary-500"
                            title={s.title || undefined}
                          >
                            {s.title || "—"}
                          </div>
                          <div
                            onClick={() =>
                              navigate(`/employers/${s.employer_id}`)
                            }
                            className="text-sm text-gray-500 truncate cursor-pointer hover:text-primary-500"
                            title={s.company_name || undefined}
                          >
                            {s.company_name || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* saved date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {s.saved_at
                        ? new Date(s.saved_at).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* action */}
                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={removingId === s.saved_id}
                          onClick={() => removeSaved(s.saved_id)}
                          className="cursor-pointer p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Unsave job"
                          aria-label="Unsave job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
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

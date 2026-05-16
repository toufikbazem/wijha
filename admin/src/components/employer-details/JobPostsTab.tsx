import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import JobPostItem from "@/components/JobPostItem";
import AdminPagination from "@/components/AdminPagination";
import { Skeleton } from "@/components/ui/skeleton";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";
const limit = 10;

export default function JobPostsTab({ employerId }: { employerId: string }) {
  const [page, setPage] = useState(1);

  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const requestId = useRef(0);
  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      employer_id: employerId,
    });
    return params.toString();
  }, [page, employerId]);

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    fetch(`${BASE}/admin/job-posts?${queryString}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (id !== requestId.current) return;
        setJobPosts(data.jobPosts || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        console.error("Error fetching job posts:", err);
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setLoading(false);
      });
  }, [queryString]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Job Posts</h2>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      {loading && (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-gray-300" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-5 gap-4 items-center"
            >
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className="h-6 w-full rounded-md bg-gray-300"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && jobPosts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No job posts found
          </h3>
          <p className="text-gray-500">
            This employer has not posted any jobs yet.
          </p>
        </div>
      )}

      {!loading && jobPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-96 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Applicants
                  </th>
                  <th className="w-36 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="w-20 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobPosts.map((jp) => (
                  <JobPostItem key={jp.id} jobPost={jp} />
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

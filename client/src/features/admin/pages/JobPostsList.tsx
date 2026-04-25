import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

const JOB_STATUSES = ["Active", "In-review", "Pending", "Paused", "Rejected", "Suspended", "Expired"];

export default function JobPostsList() {
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Reason dialog state
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    jobId: string;
    status: string;
  } | null>(null);
  const [statusReason, setStatusReason] = useState("");

  const fetchJobPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(
        `http://localhost:5000/api/v1/admin/job-posts?${params}`,
        { credentials: "include" },
      );
      const data = await res.json();
      setJobPosts(data.jobPosts || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPosts();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobPosts();
  };

  const handleStatusChange = async (jobId: string, newStatus: string, reason?: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/v1/admin/job-posts/${jobId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus, status_reason: reason || null }),
        },
      );
      fetchJobPosts();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const onSelectChange = (jobId: string, newStatus: string) => {
    if (newStatus === "Rejected" || newStatus === "Suspended") {
      setPendingStatusChange({ jobId, status: newStatus });
      setStatusReason("");
      setReasonDialogOpen(true);
    } else {
      handleStatusChange(jobId, newStatus);
    }
  };

  const confirmReasonDialog = () => {
    if (pendingStatusChange) {
      handleStatusChange(pendingStatusChange.jobId, pendingStatusChange.status, statusReason);
    }
    setReasonDialogOpen(false);
    setPendingStatusChange(null);
    setStatusReason("");
  };

  const cancelReasonDialog = () => {
    setReasonDialogOpen(false);
    setPendingStatusChange(null);
    setStatusReason("");
    fetchJobPosts();
  };

  const statusColors: Record<string, string> = {
    Active: "bg-green-50 text-green-700",
    "In-review": "bg-yellow-50 text-yellow-700",
    Pending: "bg-blue-50 text-blue-700",
    Paused: "bg-gray-100 text-gray-700",
    Rejected: "bg-red-50 text-red-700",
    Suspended: "bg-red-50 text-red-700",
    Expired: "bg-orange-50 text-orange-700",
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Job Posts</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Posted</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : jobPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No job posts found
                  </td>
                </tr>
              ) : (
                jobPosts.map((job) => (
                  <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {job.logo ? (
                          <img src={job.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-600">
                            {job.company_name?.[0]}
                          </div>
                        )}
                        <span className="text-gray-600">{job.company_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{job.location || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{job.job_type || "-"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={job.status}
                        onChange={(e) => onSelectChange(job.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer ${
                          statusColors[job.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {JOB_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                        <option value="Deleted">Delete</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/admin?tab=job-details&id=${job.id}`)}
                        className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reason Dialog for Rejected / Suspended */}
      <AlertDialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatusChange?.status === "Rejected"
                ? "Reject Job Post"
                : "Suspend Job Post"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason that will be visible to the employer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={statusReason}
            onChange={(e) => setStatusReason(e.target.value)}
            placeholder="Enter reason..."
            className="min-h-[100px] text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelReasonDialog}
              className="bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReasonDialog}
              className="bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Info, Plus, X } from "lucide-react";
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
import { industries, jobTypes, jobModes, experienceLevels, educationLevels } from "@/utils/data";

const JOB_STATUSES = ["Active", "In-review", "Pending", "Paused", "Rejected", "Suspended", "Expired"];

const EMPTY_FORM = {
  title: "",
  description: "",
  location: "",
  job_type: "",
  job_mode: "",
  industry: "",
  experience_level: "",
  education_level: "",
  number_of_positions: "",
  min_salary: "",
  max_salary: "",
  deadline: "",
};

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
  const [reasonError, setReasonError] = useState("");

  // Create job post modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [employerSearch, setEmployerSearch] = useState("");
  const [employerResults, setEmployerResults] = useState<any[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null);
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

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
    if (newStatus === "Pending" || newStatus === "Suspended") {
      setPendingStatusChange({ jobId, status: newStatus });
      setStatusReason("");
      setReasonError("");
      setReasonDialogOpen(true);
    } else {
      handleStatusChange(jobId, newStatus);
    }
  };

  const confirmReasonDialog = () => {
    if (!statusReason.trim()) {
      setReasonError("Reason is required.");
      return;
    }
    if (pendingStatusChange) {
      handleStatusChange(pendingStatusChange.jobId, pendingStatusChange.status, statusReason);
    }
    setReasonDialogOpen(false);
    setPendingStatusChange(null);
    setStatusReason("");
    setReasonError("");
  };

  const cancelReasonDialog = () => {
    setReasonDialogOpen(false);
    setPendingStatusChange(null);
    setStatusReason("");
    setReasonError("");
    fetchJobPosts();
  };

  // Employer search for create modal
  const searchEmployers = async (q: string) => {
    if (!q.trim()) { setEmployerResults([]); return; }
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/admin/employers?search=${encodeURIComponent(q)}&limit=10`,
        { credentials: "include" },
      );
      const data = await res.json();
      setEmployerResults(data.employers || []);
    } catch {
      setEmployerResults([]);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => searchEmployers(employerSearch), 300);
    return () => clearTimeout(t);
  }, [employerSearch]);

  const openCreateModal = () => {
    setCreateForm(EMPTY_FORM);
    setIsAnonymous(false);
    setEmployerSearch("");
    setEmployerResults([]);
    setSelectedEmployer(null);
    setCreateError("");
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      setCreateError("Title is required.");
      return;
    }
    if (!isAnonymous && !selectedEmployer) {
      setCreateError("Select a company or enable Anonymous Company.");
      return;
    }
    setCreateLoading(true);
    setCreateError("");
    try {
      const body: any = { ...createForm, is_anonymous: isAnonymous };
      if (!isAnonymous && selectedEmployer) {
        body.employer_id = selectedEmployer.employer_id;
      }
      // Remove empty strings
      for (const key of Object.keys(body)) {
        if (body[key] === "") delete body[key];
      }
      const res = await fetch("http://localhost:5000/api/v1/admin/job-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setCreateError(data.message || "Failed to create job post.");
        return;
      }
      setCreateModalOpen(false);
      setPage(1);
      fetchJobPosts();
    } catch {
      setCreateError("An unexpected error occurred.");
    } finally {
      setCreateLoading(false);
    }
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Job Posts</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Job Post
        </button>
      </div>

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
                            {job.company_name?.[0] ?? "?"}
                          </div>
                        )}
                        <span className="text-gray-600">{job.company_name ?? "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{job.location || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{job.job_type || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
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
                        {(job.status === "Pending" || job.status === "Suspended") && job.status_reason && (
                          <span title={job.status_reason} className="cursor-help text-gray-400 hover:text-gray-600">
                            <Info className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
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

      {/* Reason Dialog for Pending / Suspended */}
      <AlertDialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatusChange?.status === "Pending"
                ? "Set Job Post to Pending"
                : "Suspend Job Post"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason that will be visible to the employer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={statusReason}
            onChange={(e) => { setStatusReason(e.target.value); setReasonError(""); }}
            placeholder="Enter reason..."
            className={`min-h-[100px] text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${reasonError ? "border-red-400" : "border-gray-300"}`}
          />
          {reasonError && <p className="text-xs text-red-500 mt-1">{reasonError}</p>}
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

      {/* Create Job Post Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create Job Post</h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-5">
              {/* Company Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Company</h3>

                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) {
                        setSelectedEmployer(null);
                        setEmployerSearch("");
                        setEmployerResults([]);
                      }
                    }}
                    className="w-4 h-4 rounded accent-primary-600"
                  />
                  <span className="text-sm text-gray-700">Anonymous Company</span>
                </label>

                {!isAnonymous && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search company by name or email..."
                      value={selectedEmployer ? selectedEmployer.company_name : employerSearch}
                      onChange={(e) => {
                        setSelectedEmployer(null);
                        setEmployerSearch(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {employerResults.length > 0 && !selectedEmployer && (
                      <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {employerResults.map((emp) => (
                          <li key={emp.employer_id}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEmployer(emp);
                                setEmployerResults([]);
                                setEmployerSearch("");
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3"
                            >
                              {emp.logo ? (
                                <img src={emp.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-600">
                                  {emp.company_name?.[0]}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{emp.company_name}</p>
                                <p className="text-xs text-gray-500">{emp.email}</p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Job Fields */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Job Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Job title *"
                      value={createForm.title}
                      onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Textarea
                      placeholder="Description"
                      value={createForm.description}
                      onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Location"
                    value={createForm.location}
                    onChange={(e) => setCreateForm((f) => ({ ...f, location: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <select
                    value={createForm.industry}
                    onChange={(e) => setCreateForm((f) => ({ ...f, industry: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Industry</option>
                    {industries.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                  <select
                    value={createForm.job_type}
                    onChange={(e) => setCreateForm((f) => ({ ...f, job_type: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Job Type</option>
                    {jobTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <select
                    value={createForm.job_mode}
                    onChange={(e) => setCreateForm((f) => ({ ...f, job_mode: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Job Mode</option>
                    {jobModes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={createForm.experience_level}
                    onChange={(e) => setCreateForm((f) => ({ ...f, experience_level: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Experience Level</option>
                    {experienceLevels.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <select
                    value={createForm.education_level}
                    onChange={(e) => setCreateForm((f) => ({ ...f, education_level: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Education Level</option>
                    {educationLevels.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Number of positions"
                    value={createForm.number_of_positions}
                    onChange={(e) => setCreateForm((f) => ({ ...f, number_of_positions: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min={1}
                  />
                  <input
                    type="date"
                    placeholder="Deadline"
                    value={createForm.deadline}
                    onChange={(e) => setCreateForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Min salary (DZD)"
                    value={createForm.min_salary}
                    onChange={(e) => setCreateForm((f) => ({ ...f, min_salary: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min={0}
                  />
                  <input
                    type="number"
                    placeholder="Max salary (DZD)"
                    value={createForm.max_salary}
                    onChange={(e) => setCreateForm((f) => ({ ...f, max_salary: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min={0}
                  />
                </div>
              </div>

              {createError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {createError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
                >
                  {createLoading ? "Creating..." : "Create Job Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

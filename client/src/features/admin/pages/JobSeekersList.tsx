import { useEffect, useRef, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Trash2, Plus, UserPlus, Upload, FileText, X } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabaseClient";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  deactivated: "bg-red-50 text-red-700",
  unverified: "bg-yellow-50 text-yellow-700",
  suspended: "bg-orange-50 text-orange-700",
};

const VALID_STATUSES = ["active", "deactivated", "unverified", "suspended"];

const defaultCreateForm = {
  first_name: "",
  last_name: "",
  user_email: "",
  professional_title: "",
  phone_number: "",
  address: "",
  gender: "",
  status: "unverified",
  cv: "",
};

export default function JobSeekersList() {
  const navigate = useNavigate();
  const [jobSeekers, setJobSeekers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(defaultCreateForm);
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const fetchJobSeekers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/job-seekers?${params}`,
        { credentials: "include" },
      );
      const data = await res.json();
      setJobSeekers(data.jobSeekers || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobSeekers();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobSeekers();
  };

  const handleStatusChange = async (jobseekerId: string, newStatus: string) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/job-seekers/${jobseekerId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );
      fetchJobSeekers();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/job-seekers/${deleteModal.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setDeleteModal(null);
      fetchJobSeekers();
    } catch (error) {
      console.error("Error deleting job seeker:", error);
    }
  };

  const handleCvSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setCreateError("Only PDF files are accepted.");
      return;
    }
    setCvFile(file);
    setCreateError("");
    setCvUploading(true);
    try {
      const fileName = `public/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("CV").upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from("CV").getPublicUrl(fileName);
      setCreateForm((prev) => ({ ...prev, cv: data.publicUrl }));
    } catch {
      setCreateError("CV upload failed. Please try again.");
      setCvFile(null);
    } finally {
      setCvUploading(false);
    }
  };

  const handleCvRemove = () => {
    setCvFile(null);
    setCreateForm((prev) => ({ ...prev, cv: "" }));
    if (cvInputRef.current) cvInputRef.current.value = "";
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    if (!createForm.first_name.trim() || !createForm.last_name.trim() || !createForm.user_email.trim()) {
      setCreateError("First name, last name, and email are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.user_email)) {
      setCreateError("Please enter a valid email address.");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/job-seekers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.message || "Failed to create profile.");
        return;
      }
      setCreateModal(false);
      setCreateForm(defaultCreateForm);
      fetchJobSeekers();
    } catch (error) {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button
          onClick={() => { setCreateModal(true); setCreateError(""); setCreateForm(defaultCreateForm); setCvFile(null); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Profile
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Search
          </button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
          <option value="unverified">Unverified</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
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
              ) : jobSeekers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                jobSeekers.map((js) => (
                  <tr key={js.jobseeker_id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {js.profile_image ? (
                          <img src={js.profile_image} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                            {js.first_name?.[0]}{js.last_name?.[0]}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{js.first_name} {js.last_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{js.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{js.phone_number || "-"}</td>
                    <td className="px-4 py-3">
                      {js.is_admin_created ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                          <UserPlus className="w-3 h-3" />
                          Admin Created
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                          Registered
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={js.status}
                        onChange={(e) => handleStatusChange(js.jobseeker_id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer ${
                          STATUS_COLORS[js.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {VALID_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(js.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin?tab=job-seeker-details&id=${js.jobseeker_id}`)}
                          className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ id: js.jobseeker_id, name: `${js.first_name} ${js.last_name}` })}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Profile</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium text-gray-900">{deleteModal.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Profile Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Job Seeker Profile</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.first_name}
                    onChange={(e) => setCreateForm({ ...createForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.last_name}
                    onChange={(e) => setCreateForm({ ...createForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={createForm.user_email}
                  onChange={(e) => setCreateForm({ ...createForm, user_email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={createForm.professional_title}
                  onChange={(e) => setCreateForm({ ...createForm, professional_title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={createForm.phone_number}
                    onChange={(e) => setCreateForm({ ...createForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={createForm.gender}
                    onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CV (PDF)</label>
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleCvSelect}
                />
                {cvFile ? (
                  <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                    <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                    <span className="text-sm text-gray-700 truncate flex-1">{cvFile.name}</span>
                    {cvUploading ? (
                      <span className="text-xs text-gray-400 shrink-0">Uploading...</span>
                    ) : (
                      <button type="button" onClick={handleCvRemove} className="text-gray-400 hover:text-red-500 shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:text-primary-500 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Click to upload PDF
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {VALID_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {createError && (
                <p className="text-sm text-red-600">{createError}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setCreateModal(false); setCvFile(null); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading || cvUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-60"
                >
                  {createLoading ? "Creating..." : cvUploading ? "Uploading CV..." : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

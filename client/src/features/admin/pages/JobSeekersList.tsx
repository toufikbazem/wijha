import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function JobSeekersList() {
  const navigate = useNavigate();
  const [jobSeekers, setJobSeekers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchJobSeekers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(
        `http://localhost:5000/api/v1/admin/job-seekers?${params}`,
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

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/v1/admin/job-seekers/${userId}/status`,
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

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this job seeker?")) return;
    try {
      await fetch(`http://localhost:5000/api/v1/admin/job-seekers/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchJobSeekers();
    } catch (error) {
      console.error("Error deleting job seeker:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Job Seekers</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
          <option value="active">Active</option>
          <option value="desactivated">Deactivated</option>
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
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : jobSeekers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No job seekers found
                  </td>
                </tr>
              ) : (
                jobSeekers.map((js) => (
                  <tr key={js.id} className="border-b border-gray-50 hover:bg-gray-50">
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
                    <td className="px-4 py-3 text-gray-600">{js.email}</td>
                    <td className="px-4 py-3 text-gray-600">{js.phone_number || "-"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={js.status}
                        onChange={(e) => handleStatusChange(js.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer ${
                          js.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="desactivated">Deactivated</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(js.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin?tab=job-seeker-details&id=${js.id}`)}
                          className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(js.id)}
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
              <span className="px-3 py-1 text-sm text-gray-700">
                {page} / {totalPages}
              </span>
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
    </div>
  );
}

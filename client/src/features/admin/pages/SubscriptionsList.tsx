import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";

export default function SubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Extend modal state
  const [extendModal, setExtendModal] = useState<{ id: string; days: number } | null>(null);
  // Custom modal state
  const [customModal, setCustomModal] = useState<{
    id: string;
    custom_job_post_limit: string;
    custom_profile_access_limit: string;
  } | null>(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(
        `http://localhost:5000/api/v1/admin/subscriptions?${params}`,
        { credentials: "include" },
      );
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubscriptions();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/v1/admin/subscriptions/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );
      fetchSubscriptions();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleExtend = async () => {
    if (!extendModal) return;
    try {
      await fetch(
        `http://localhost:5000/api/v1/admin/subscriptions/${extendModal.id}/extend`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ days: extendModal.days }),
        },
      );
      setExtendModal(null);
      fetchSubscriptions();
    } catch (error) {
      console.error("Error extending subscription:", error);
    }
  };

  const handleCustom = async () => {
    if (!customModal) return;
    try {
      await fetch(
        `http://localhost:5000/api/v1/admin/subscriptions/${customModal.id}/custom`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            custom_job_post_limit: customModal.custom_job_post_limit
              ? Number(customModal.custom_job_post_limit) : null,
            custom_profile_access_limit: customModal.custom_profile_access_limit
              ? Number(customModal.custom_profile_access_limit) : null,
          }),
        },
      );
      setCustomModal(null);
      fetchSubscriptions();
    } catch (error) {
      console.error("Error assigning custom plan:", error);
    }
  };

  const statusColors: Record<string, string> = {
    "in-review": "bg-yellow-50 text-yellow-700",
    active: "bg-green-50 text-green-700",
    suspended: "bg-red-50 text-red-700",
    paused: "bg-blue-50 text-blue-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company name..."
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
          <option value="in-review">In Review</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Usage</th>
                <th className="px-4 py-3 font-medium">Custom</th>
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
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No subscriptions found</td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{sub.company_name}</td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-gray-900">{sub.plan_name}</span>
                        <span className="text-gray-400 text-xs ml-1">({sub.plan_type})</span>
                      </div>
                      <div className="text-xs text-gray-500">{sub.plan_price} DZD</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={sub.status}
                        onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer ${
                          statusColors[sub.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <option value="in-review">In Review</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      <div>{new Date(sub.start_day).toLocaleDateString()}</div>
                      <div className="text-gray-400">to {new Date(sub.end_day).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="text-gray-600">
                        Jobs: {sub.job_post_used}/{sub.is_custom ? sub.custom_job_post_limit : sub.plan_job_post_limit ?? "∞"}
                      </div>
                      <div className="text-gray-600">
                        Profiles: {sub.profile_access_used}/{sub.is_custom ? sub.custom_profile_access_limit : sub.plan_profile_access_limit ?? "∞"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {sub.is_custom ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                          Custom
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setExtendModal({ id: sub.id, days: 30 })}
                          className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
                        >
                          Extend
                        </button>
                        <button
                          onClick={() =>
                            setCustomModal({
                              id: sub.id,
                              custom_job_post_limit: sub.custom_job_post_limit ? String(sub.custom_job_post_limit) : "",
                              custom_profile_access_limit: sub.custom_profile_access_limit ? String(sub.custom_profile_access_limit) : "",
                            })
                          }
                          className="p-1 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded transition-colors"
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Extend Modal */}
      {extendModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Extend Subscription</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of days</label>
            <input
              type="number"
              value={extendModal.days}
              onChange={(e) => setExtendModal({ ...extendModal, days: Number(e.target.value) })}
              min={1}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setExtendModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleExtend}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
              >
                Extend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Plan Modal */}
      {customModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Custom Limits</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Post Limit</label>
                <input
                  type="number"
                  value={customModal.custom_job_post_limit}
                  onChange={(e) => setCustomModal({ ...customModal, custom_job_post_limit: e.target.value })}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Access Limit</label>
                <input
                  type="number"
                  value={customModal.custom_profile_access_limit}
                  onChange={(e) => setCustomModal({ ...customModal, custom_profile_access_limit: e.target.value })}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setCustomModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCustom}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Save Custom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  type: string;
  duration: number;
  price: number;
  job_post_limit: number | null;
  profile_access_limit: number | null;
}

const emptyPlan = {
  name: "",
  type: "pack",
  duration: 30,
  price: 0,
  job_post_limit: "",
  profile_access_limit: "",
};

export default function PlansList() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPlan);

  const fetchPlans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/admin/plans", {
        credentials: "include",
      });
      const data = await res.json();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreate = () => {
    setForm(emptyPlan);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (plan: Plan) => {
    setForm({
      name: plan.name,
      type: plan.type,
      duration: plan.duration,
      price: plan.price,
      job_post_limit: plan.job_post_limit !== null ? String(plan.job_post_limit) : "",
      profile_access_limit: plan.profile_access_limit !== null ? String(plan.profile_access_limit) : "",
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      type: form.type,
      duration: Number(form.duration),
      price: Number(form.price),
      job_post_limit: form.job_post_limit ? Number(form.job_post_limit) : null,
      profile_access_limit: form.profile_access_limit ? Number(form.profile_access_limit) : null,
    };

    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/v1/admin/plans/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:5000/api/v1/admin/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/plans/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete");
        return;
      }
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Plan" : "Create Plan"}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="free">Free</option>
                <option value="pack">Pack</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Post Limit</label>
              <input
                type="number"
                value={form.job_post_limit}
                onChange={(e) => setForm({ ...form, job_post_limit: e.target.value })}
                placeholder="Leave empty for unlimited"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Access Limit</label>
              <input
                type="number"
                value={form.profile_access_limit}
                onChange={(e) => setForm({ ...form, profile_access_limit: e.target.value })}
                placeholder="Leave empty for unlimited"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Job Limit</th>
                <th className="px-4 py-3 font-medium">Profile Limit</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No plans found</td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{plan.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        plan.type === "unlimited"
                          ? "bg-purple-50 text-purple-700"
                          : plan.type === "free"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        {plan.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{plan.duration} days</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{plan.price} DZD</td>
                    <td className="px-4 py-3 text-gray-600">{plan.job_post_limit ?? "Unlimited"}</td>
                    <td className="px-4 py-3 text-gray-600">{plan.profile_access_limit ?? "Unlimited"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(plan)}
                          className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
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
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Users, Building2, Briefcase, CreditCard } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalEmployers: number;
  totalJobSeekers: number;
  totalJobPosts: number;
  jobPostsByStatus: Record<string, number>;
  activeSubscriptions: number;
  recentUsers: any[];
  recentJobPosts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/dashboard`, {
          credentials: "include",
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Job Seekers", value: stats.totalJobSeekers, icon: Users, color: "text-green-600 bg-green-50" },
    { label: "Employers", value: stats.totalEmployers, icon: Building2, color: "text-purple-600 bg-purple-50" },
    { label: "Job Posts", value: stats.totalJobPosts, icon: Briefcase, color: "text-orange-600 bg-orange-50" },
    { label: "Active Subscriptions", value: stats.activeSubscriptions, icon: CreditCard, color: "text-cyan-600 bg-cyan-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{card.label}</span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Job Posts by Status */}
      {Object.keys(stats.jobPostsByStatus).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Posts by Status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.jobPostsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-600">{status}</span>
                <span className="text-sm font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-50">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{user.name || "N/A"}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === "employer"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-green-50 text-green-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Job Posts */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Job Posts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentJobPosts.map((job: any) => (
                  <tr key={job.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">{job.title}</td>
                    <td className="py-3 text-gray-500">{job.company_name}</td>
                    <td className="py-3">
                      <StatusBadge status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-green-50 text-green-700",
    "In-review": "bg-yellow-50 text-yellow-700",
    Pending: "bg-blue-50 text-blue-700",
    Paused: "bg-gray-100 text-gray-700",
    Rejected: "bg-red-50 text-red-700",
    Expired: "bg-orange-50 text-orange-700",
  };

  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";
import { Users, Building2, Briefcase, FileText, CreditCard, Eye } from "lucide-react";

interface Stats {
  totalJobSeekers: number;
  totalEmployers: number;
  totalJobPosts: number;
  totalApplications: number;
  totalSubscriptions: number;
  totalProfileAccess: number;
  newJobSeekersToday: number;
  newEmployersToday: number;
  newJobPostsToday: number;
  newApplicationsToday: number;
  newSubscriptionsToday: number;
  newProfileAccessToday: number;
}

const cards = [
  { key: "totalJobSeekers", todayKey: "newJobSeekersToday", label: "Job Seekers", icon: Users, color: "text-blue-600 bg-blue-50" },
  { key: "totalEmployers", todayKey: "newEmployersToday", label: "Employers", icon: Building2, color: "text-purple-600 bg-purple-50" },
  { key: "totalJobPosts", todayKey: "newJobPostsToday", label: "Job Posts", icon: Briefcase, color: "text-green-600 bg-green-50" },
  { key: "totalApplications", todayKey: "newApplicationsToday", label: "Applications", icon: FileText, color: "text-orange-600 bg-orange-50" },
  { key: "totalSubscriptions", todayKey: "newSubscriptionsToday", label: "Subscriptions", icon: CreditCard, color: "text-indigo-600 bg-indigo-50" },
  { key: "totalProfileAccess", todayKey: "newProfileAccessToday", label: "Profile Access", icon: Eye, color: "text-pink-600 bg-pink-50" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then((d) => setStats(d)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ key, todayKey, label, icon: Icon, color }) => (
          <div key={key} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                {loading ? (
                  <div className="mt-1 h-8 w-20 animate-pulse rounded bg-gray-200" />
                ) : (
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {(stats as any)?.[key] ?? 0}
                  </p>
                )}
              </div>
              <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon className="size-5" />
              </div>
            </div>
            {loading ? (
              <div className="mt-3 h-4 w-28 animate-pulse rounded bg-gray-100" />
            ) : (
              <p className="mt-3 text-xs text-gray-500">
                <span className="font-semibold text-green-600">
                  +{(stats as any)?.[todayKey] ?? 0}
                </span>{" "}
                new today
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

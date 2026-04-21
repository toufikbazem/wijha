import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  FileText,
  BookmarkIcon,
  Search,
  User,
  MapPin,
  Building2,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface RecentApplication {
  application_id: string;
  applied_at: string;
  job_post_id: string;
  title: string;
  location: string;
  job_type: string;
  job_status: string;
  company_name: string;
  logo: string;
}

interface DashboardStats {
  totalApplications: number;
  savedJobs: number;
  recentApplications: RecentApplication[];
}

export default function DashMain() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const { t } = useTranslation("jobseeker");
  const { t: tc } = useTranslation("common");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobseekers/dashboard-stats`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          console.error("Error fetching dashboard stats:", data.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: t("applicationsSent"),
      value: stats?.totalApplications ?? 0,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: t("savedJobs"),
      value: stats?.savedJobs ?? 0,
      icon: BookmarkIcon,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mb-2 bg-gray-300" />
          <Skeleton className="h-4 w-96 mb-8 bg-gray-300" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl bg-gray-300" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tc("dashboard")}</h1>
            <p className="mt-1 text-gray-600">
              {t("welcome")} {user?.first_name} {user?.last_name}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/jobSearch")}
              className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-[#008CBA] text-white font-medium rounded-lg hover:bg-[#007399] transition-colors shadow-md hover:shadow-lg"
            >
              <Search className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              {t("browseJobs")}
            </button>
            <button
              onClick={() => navigate("/dashboard?tab=profile")}
              className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <User className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              {t("editProfile")}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("recentApplications")}
            </h2>
            <button
              onClick={() => navigate("/dashboard?tab=applications")}
              className="text-sm text-[#008CBA] hover:underline cursor-pointer"
            >
              {tc("viewAll")}
            </button>
          </div>
          {stats?.recentApplications.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">
              {t("noApplicationsYet")}
            </p>
          ) : (
            <div className="space-y-4">
              {stats?.recentApplications.map((app) => (
                <div
                  key={app.application_id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/jobPost/${app.job_post_id}`)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {app.logo ? (
                      <img src={app.logo} alt={app.company_name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{app.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center text-xs text-gray-500">
                        <Building2 className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                        {app.company_name}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                        {app.location}
                      </span>
                    </div>
                  </div>
                  <div className="ltr:text-right rtl:text-left shrink-0">
                    <p className="text-xs text-gray-500">{formatDate(app.applied_at)}</p>
                    <span className="text-xs font-medium text-gray-500">{app.job_type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

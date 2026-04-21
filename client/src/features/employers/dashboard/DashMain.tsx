import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Users,
  Play,
  Plus,
  Eye,
  MapPin,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface RecentJob {
  id: string;
  title: string;
  status: string;
  location: string;
  job_type: string;
  created_at: string;
  applicants: number;
}

interface RecentApplicant {
  application_id: string;
  applied_at: string;
  job_post_id: string;
  job_title: string;
  first_name: string;
  last_name: string;
  professional_title: string;
  profile_image: string;
}

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  recentJobs: RecentJob[];
  recentApplicants: RecentApplicant[];
}

export default function DashMain() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const { t } = useTranslation("employer");
  const { t: tc } = useTranslation("common");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/employers/dashboard-stats`,
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
      label: t("totalJobPosts"),
      value: stats?.totalJobs ?? 0,
      icon: Briefcase,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: t("activeJobs"),
      value: stats?.activeJobs ?? 0,
      icon: Play,
      color: "bg-green-50 text-green-600",
    },
    {
      label: t("totalApplicants"),
      value: stats?.totalApplicants ?? 0,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mb-2 bg-gray-300" />
          <Skeleton className="h-4 w-96 mb-8 bg-gray-300" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl bg-gray-300" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl bg-gray-300" />
            <Skeleton className="h-80 rounded-xl bg-gray-300" />
          </div>
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
              {t("welcome")} {user?.company_name}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard?tab=createJobPost")}
            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-[#008CBA] text-white font-medium rounded-lg hover:bg-[#007399] transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            {t("createNewJob")}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Job Posts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("recentJobPosts")}
              </h2>
              <button
                onClick={() => navigate("/dashboard?tab=jobPosts")}
                className="text-sm text-[#008CBA] hover:underline cursor-pointer"
              >
                {tc("viewAll")}
              </button>
            </div>
            {stats?.recentJobs.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">
                {t("noJobPostsYet")}
              </p>
            ) : (
              <div className="space-y-4">
                {stats?.recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          <Users className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                          {job.applicants} {t("applicants")}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        job.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : job.status === "Paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : job.status === "In-review"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applicants */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("recentApplicants")}
              </h2>
            </div>
            {stats?.recentApplicants.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">
                {t("noApplicantsYet")}
              </p>
            ) : (
              <div className="space-y-4">
                {stats?.recentApplicants.map((applicant) => (
                  <div
                    key={applicant.application_id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {applicant.profile_image ? (
                        <img
                          src={applicant.profile_image}
                          alt={applicant.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {applicant.first_name} {applicant.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {applicant.professional_title}
                      </p>
                    </div>
                    <div className="ltr:text-right rtl:text-left shrink-0">
                      <p className="text-xs text-gray-500">{t("appliedFor")}</p>
                      <p className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                        {applicant.job_title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

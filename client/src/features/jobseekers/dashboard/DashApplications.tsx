import { useEffect, useState } from "react";
import { MapPin, Clock, DollarSign, FileText } from "lucide-react";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import JobPostCard from "../components/JobPostCard";
import { useTranslation } from "react-i18next";
import DashJobPostsPagination from "@/features/employers/components/DashJobPostsPagination";

export default function DashApplication() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const { user } = useSelector((state: any) => state.user);
  const { t } = useTranslation("jobseeker");

  useEffect(() => {
    const getApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/applications?jobseekerId=${user.id}&page=${page}&limit=${limit}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok) {
          setApplications(data.applications || []);
          setTotal(data.total || 0);
        } else {
          console.error("Failed to fetch applications", data);
        }
      } catch (error) {
        console.error("Error fetching applications", error);
      } finally {
        setLoading(false);
      }
    };
    getApplications();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("myApplications")}
          </h1>
          <p className="text-gray-600">{t("trackApplications")}</p>
        </div>

        {applications.length == 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
                <FileText
                  className="w-12 h-12 text-slate-400"
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                {t("noApplications")}
              </h2>
            </div>
          </div>
        )}

        {loading && (
          <>
            {[1, 2, 3].map((index) => (
              <div key={index} className="space-y-3 py-4">
                {/* Job title */}
                <Skeleton className="h-4 w-2/3 bg-gray-300" />

                {/* Company name */}
                <Skeleton className="h-3 w-1/3 bg-gray-300" />

                {/* Location · Job type · Time */}
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-20 bg-gray-300" />
                  <Skeleton className="h-3 w-16 bg-gray-300" />
                  <Skeleton className="h-3 w-14 bg-gray-300" />
                </div>

                {/* Short description */}
                <Skeleton className="h-3 w-11/12 bg-gray-300" />
              </div>
            ))}
          </>
        )}

        {applications.length > 0 && !loading && (
          <>
            <div className="grid grid-cols-1 gap-6">
              {applications.map((application) => (
                <JobPostCard key={application.id} job={application} />
              ))}
            </div>

            <DashJobPostsPagination
              totalPages={totalPages}
              page={page}
              setPage={setPage}
            />
          </>
        )}
      </main>
    </div>
  );
}

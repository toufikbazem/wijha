import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, FileText, RotateCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import JobPostCard from "@/features/job-posts/components/JobPostCard";
import DashJobPostsPagination from "./DashJobPostsPagination";

function CompanyJobPosts({ employerId }: { employerId?: string }) {
  const { t } = useTranslation("jobs");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const limit = 6;
  const totalPages = Math.max(1, Math.ceil(totalJobs / limit));

  const fetchJobs = async () => {
    if (!employerId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/job-posts?page=${page}&limit=${limit}&employerId=${employerId}&status=Active`,
      );
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs);
        setTotalJobs(Number(data.total) || 0);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching company job posts:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [employerId, page]);

  /* ===== Loading state ===== */
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-13 h-13 rounded-xl bg-gray-200" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 bg-gray-200" />
                <Skeleton className="h-3 w-24 bg-gray-200" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-md bg-gray-200" />
              <Skeleton className="h-6 w-16 rounded-md bg-gray-200" />
              <Skeleton className="h-6 w-16 rounded-md bg-gray-200" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <Skeleton className="h-6 w-24 rounded-md bg-gray-200" />
              <Skeleton className="h-9 w-24 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ===== Error state ===== */
  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {t("jobPostsLoadError")}
        </h3>
        <p className="text-gray-500 mb-6">{t("jobPostsLoadErrorHint")}</p>
        <button
          onClick={fetchJobs}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#008CBA] text-white rounded-xl hover:bg-[#006d91] transition font-medium"
        >
          <RotateCw className="w-4 h-4" />
          {t("retry")}
        </button>
      </div>
    );
  }

  /* ===== Empty state ===== */
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {t("noJobsFound")}
        </h3>
        <p className="text-gray-500">{t("companyNoJobs")}</p>
      </div>
    );
  }

  /* ===== Loaded state ===== */
  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <JobPostCard key={job.id} job={job} />
      ))}

      {totalPages > 1 && (
        <DashJobPostsPagination
          totalPages={totalPages}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
}

export default CompanyJobPosts;

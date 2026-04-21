import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import JobPostCard from "./JobPostCard";

function JobPostsList({ loading, jobs }: { loading: boolean; jobs: any }) {
  const { t } = useTranslation("jobs");

  return (
    <main className="flex-1 min-w-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {t("jobsFound", { count: jobs.length })}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t("basedOnFilters")}
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 py-4">
              <Skeleton className="h-4 w-2/3 bg-gray-300" />
              <Skeleton className="h-3 w-1/3 bg-gray-300" />
              <div className="flex gap-3">
                <Skeleton className="h-3 w-20 bg-gray-300" />
                <Skeleton className="h-3 w-16 bg-gray-300" />
                <Skeleton className="h-3 w-14 bg-gray-300" />
              </div>
              <Skeleton className="h-3 w-11/12 bg-gray-300" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-4">
          {jobs.map((job: any) => (
            <JobPostCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("noJobsFound")}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("tryAdjusting")}
          </p>
          <button className="px-6 py-2.5 bg-[#008CBA] text-white rounded-xl hover:bg-[#006d91] transition font-medium">
            {t("clearAllFilters")}
          </button>
        </div>
      )}
    </main>
  );
}

export default JobPostsList;

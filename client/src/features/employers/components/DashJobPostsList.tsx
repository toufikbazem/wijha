import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import DashJobItem from "./DashJobItem";
import DashJobPostsPagination from "./DashJobPostsPagination";
import { useTranslation } from "react-i18next";

function DashJobPostsList({
  loading,
  jobs,
  totalpages,
  page = 1,
  setPage,
  onStatusChange,
}: {
  loading: boolean;
  jobs: any[];
  totalpages: string | number;
  page: number;
  setPage: (page: number) => void;
  onStatusChange: () => void;
}) {
  const { t } = useTranslation("employer");
  return (
    <>
      {loading && (
        <div className="w-full space-y-4">
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-gray-300" />
            ))}
          </div>

          {/* Table rows */}
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-4 items-center">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className="h-6 w-full rounded-md bg-gray-300"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("noJobsFound")}
          </h3>
          <p className="text-gray-500 mb-6">{t("adjustFilters")}</p>
          <button className="px-6 py-2.5 bg-[#008CBA] text-white rounded-xl hover:bg-[#006d91] transition font-medium">
            {t("clearAllFilters")}
          </button>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
          <div className="w-full overflow-x-auto">
            <table className="whitespace-nowrap w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 ltr:text-left rtl:text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("jobTitle")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("status")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("datePosted")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("applications")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("numberOfPositions")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <DashJobItem
                    key={job.id}
                    job={job}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </tbody>
            </table>
            <DashJobPostsPagination
              totalPages={totalpages}
              setPage={setPage}
              page={page}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default DashJobPostsList;

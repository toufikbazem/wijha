import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import DashApplicantItem from "./DashApplicantItem";
import DashJobPostsPagination from "./DashJobPostsPagination";
import { useTranslation } from "react-i18next";

function DashApplicantsList({
  loading,
  applicants,
  totalpages,
  page = 1,
  setPage,
}: {
  loading: boolean;
  applicants: any[];
  totalpages: string | number;
  page: number;
  setPage: (page: number) => void;
}) {
  const { t } = useTranslation("employer");
  return (
    <>
      {/* Loading skeletons — card grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3 bg-gray-200" />
                  <Skeleton className="h-3 w-1/2 bg-gray-200" />
                </div>
              </div>
              <Skeleton className="h-3 w-3/4 bg-gray-200" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-20 bg-gray-200" />
                <Skeleton className="h-3 w-24 bg-gray-200" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
                <Skeleton className="h-6 w-14 rounded-full bg-gray-200" />
                <Skeleton className="h-6 w-18 rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && applicants.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("noApplicantsYetList")}
          </h3>
          <p className="text-gray-500">
            {t("applicantsWillAppear")}
          </p>
        </div>
      )}

      {/* Cards grid + pagination */}
      {!loading && applicants.length > 0 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applicants.map((applicant) => (
              <DashApplicantItem
                key={applicant.application_id}
                applicant={applicant}
              />
            ))}
          </div>
          <DashJobPostsPagination
            totalPages={Number(totalpages)}
            setPage={setPage}
            page={page}
          />
        </div>
      )}
    </>
  );
}

export default DashApplicantsList;

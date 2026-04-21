import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import DashApplicantsList from "../components/DashApplicantsList";
import { useTranslation } from "react-i18next";

export default function DashApplicants() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("employer");

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const jobPostId = new URLSearchParams(location.search).get("jobPost");

  useEffect(() => {
    if (!jobPostId) {
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/applications/by-job/${jobPostId}?page=${page}&limit=${limit}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok) {
          setApplicants(data.applicants || []);
          setTotal(data.total || 0);
          setJobTitle(data.jobTitle || "");
        } else {
          console.error("Error fetching applicants:", data.message);
          setApplicants([]);
          setTotal(0);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobPostId, page]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/dashboard?tab=jobPosts")}
              className="cursor-pointer inline-flex items-center text-sm text-gray-600 hover:text-[#008CBA] mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 ltr:mr-1 rtl:ml-1" />
              {t("backJobPosts")}
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{t("sidebar.applicants")}</h1>
            <p className="mt-1 text-gray-600">
              {jobTitle
                ? t("appliedToTitle", { title: jobTitle })
                : t("appliedToGeneric")}
              {!loading && total > 0 && (
                <span className="ltr:ml-2 rtl:mr-2 text-sm text-gray-500">
                  ({total} {t("total")})
                </span>
              )}
            </p>
          </div>
        </div>

        {!jobPostId ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("noJobPostSelected")}
            </h3>
            <p className="text-gray-500">
              {t("openFromJobPost")}
            </p>
          </div>
        ) : (
          <DashApplicantsList
            loading={loading}
            applicants={applicants}
            totalpages={totalPages}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
}

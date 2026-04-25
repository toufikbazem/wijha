import { saveJobPost, unsaveJobPost } from "@/features/auth/userSlice";
import { Bookmark, Briefcase, Clock, Globe, MapPin } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import moment from "moment/min/moment-with-locales";
import { useTranslation } from "react-i18next";
import addressData from "@/utils/address.json";

interface AddressEntry {
  label: string;
  labelAr: string;
  communeFr: string;
  communeAr: string;
  wilayaFr: string;
  wilayaAr: string;
}

const addresses = addressData as AddressEntry[];

function resolveLocation(frenchLabel: string, lang: string): string {
  if (!frenchLabel) return frenchLabel;
  if (lang === "ar") {
    const entry = addresses.find((a) => a.label === frenchLabel);
    return entry ? entry.labelAr : frenchLabel;
  }
  return frenchLabel;
}

function JobPostCard({
  job,
  savedJobs,
  setSavedJobs,
}: {
  job: any;
  savedJobs?: any[];
  setSavedJobs?: (jobs: any[]) => void;
}) {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("jobseeker");
  const [onSaving, setOnSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(
    user?.saved?.includes(job.id) ? true : false,
  );

  i18n.on("languageChanged", (lng) => {
    moment.locale(lng);
  });

  const handleSave = async (job: any) => {
    setOnSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/saved-jobs`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ jobId: job.id, userId: user.id }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      console.log("not ok");
      if (!res.ok) {
        if (data.error_code === "ACCOUNT_INACTIVE") {
          toast.error(t("accountInactive"));
        } else {
          toast.error(t("failedSaveJob"));
        }
      } else {
        console.log("ok");
        setSavedJobs && savedJobs && setSavedJobs([...savedJobs, job]);
        toast.success(t("saveJobSuccess"));
        setIsSaved(true);
        dispatch(saveJobPost(job.id));
      }
    } catch (error) {
      toast.error(t("failedSaveJob"));
    } finally {
      setOnSaving(false);
    }
  };

  const handleUnsave = async (job: any) => {
    setOnSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/saved-jobs`,
        {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({ jobId: job.id, userId: user.id }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        console.log("Error unsaving job:", data);
        if (data.error_code === "ACCOUNT_INACTIVE") {
          toast.error(t("accountInactive"));
        } else {
          toast.error(t("failedSaveJob"));
        }
      } else {
        setSavedJobs &&
          savedJobs &&
          setSavedJobs(savedJobs.filter((savedJob) => savedJob.id !== job.id));
        toast.success(t("unsaveJobSuccess"));
        setIsSaved(false);
        dispatch(unsaveJobPost(job.id));
      }
    } catch (error) {
      toast.error(t("failedUnsaveJob"));
    } finally {
      setOnSaving(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-none hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="font-semibold w-13 h-13 bg-[#E6F7FB] rounded-xl hidden sm:flex items-center justify-center text-xl shrink-0 border border-gray-100">
            {job.logo ? (
              <img src={job.logo} alt="logo" />
            ) : (
              job.company_name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h4 className="text-[15px] font-medium text-gray-900 mb-0.5">
              {job.title}
            </h4>
            <Link
              to={`/companyProfile/${job.employer_id}`}
              className="block text-[13px] text-gray-500"
            >
              {job.company_name}
            </Link>
          </div>
        </div>
        {/* <span className="px-2 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-xl absolute top-3 right-3">
          expired
        </span> */}
        {user && user.role === "jobseeker" && (
          <button
            disabled={onSaving}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            {isSaved ? (
              <Bookmark
                onClick={() => handleUnsave(job)}
                className="w-[18px] h-[18px] text-yellow-500"
              />
            ) : (
              <Bookmark
                onClick={() => handleSave(job)}
                className="w-[18px] h-[18px]"
              />
            )}
          </button>
        )}
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-2">
        <span
          key={1}
          className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-50 rounded-md px-2.5 py-1"
        >
          <MapPin className="w-3 h-3" />
          {resolveLocation(job.location, i18n.language)}
        </span>
        <span
          key={2}
          className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-50 rounded-md px-2.5 py-1"
        >
          <Globe className="w-3 h-3" />
          {t(job.job_mode)}
        </span>
        <span
          key={3}
          className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-50 rounded-md px-2.5 py-1"
        >
          <Briefcase className="w-3 h-3" />
          {t(job.job_type)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="flex items-center text-[12px] font-medium text-sky-700 bg-sky-50 rounded-md px-2.5 py-1">
          <Clock className="w-3 h-3 inline-block rtl:ml-2 ltr:mr-2" />
          {moment(job.created_at).locale(i18n.language).fromNow()}
        </span>
        <button
          onClick={() => navigate(`/jobPost/${job.id}`)}
          className="cursor-pointer text-[13px] font-medium text-white bg-[#008CBA] hover:bg-[#00668C] transition-colors rounded-lg py-2 px-5"
        >
          {t("seeDetails")}
        </button>
      </div>
    </div>
  );
}

export default JobPostCard;

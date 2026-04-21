import { saveJobPost, unsaveJobPost } from "@/features/auth/userSlice";
import { Bookmark, Briefcase, Clock, Globe, MapPin } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import moment from "moment";
import { useTranslation } from "react-i18next";

function JobPostCard({ job }: { job: any }) {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [onSaving, setOnSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(
    user?.saved?.includes(job.id) ? true : false,
  );
  const { t } = useTranslation("jobs");
  const { t: tc } = useTranslation("common");

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
      if (!res.ok) {
        toast.error(t("failedSave"));
      } else {
        toast.success(t("successSave"));
        setIsSaved(true);
        dispatch(saveJobPost(job.id));
      }
    } catch (error) {
      toast.error(t("failedSave"));
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
      if (!res.ok) {
        toast.error(t("failedUnsave"));
      } else {
        toast.success(t("successUnsave"));
        setIsSaved(false);
        dispatch(unsaveJobPost(job.id));
      }
    } catch (error) {
      toast.error(t("failedUnsave"));
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
        {[
          { icon: MapPin, label: job.location },
          { icon: Globe, label: job.job_mode },
          { icon: Briefcase, label: job.job_type },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-50 rounded-md px-2.5 py-1"
          >
            <Icon className="w-3 h-3" />
            {label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="flex items-center text-[12px] font-medium text-sky-700 bg-sky-50 rounded-md px-2.5 py-1">
          <Clock className="w-3 h-3 inline-block ltr:mr-2 rtl:ml-2" />
          {moment(job.created_at).fromNow()}
        </span>
        <button
          onClick={() => navigate(`/jobPost/${job.id}`)}
          className="cursor-pointer text-[13px] font-medium text-white bg-[#008CBA] hover:bg-[#00668C] transition-colors rounded-lg py-2 px-5"
        >
          {tc("seeDetails")}
        </button>
      </div>
    </div>
  );
}

export default JobPostCard;

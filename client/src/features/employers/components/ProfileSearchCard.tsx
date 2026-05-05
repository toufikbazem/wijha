import { useState } from "react";
import {
  User,
  Briefcase,
  MapPin,
  Lock,
  Eye,
  FileX,
  FileCheck,
  GraduationCap,
  Mars,
  Venus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function ProfileSearchCard({
  profile,
  onAccessGranted,
}: {
  profile: any;
  onAccessGranted: (jobSeekerId: string) => void;
}) {
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("employer");
  const { t: td } = useTranslation("data");
  const { t: tc } = useTranslation("common");

  const skills: string[] = Array.isArray(profile.skills) ? profile.skills : [];
  const isFemale = profile.gender === "female";

  const handleRequestAccess = async () => {
    setRequesting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile-access/request/${profile.id}`,
        { method: "POST", credentials: "include" },
      );
      const data = await res.json();
      if (res.ok) {
        onAccessGranted(profile.id);
      } else if (data.code === "NO_SUBSCRIPTION") {
        toast.error(t("noSubscriptionAccess"), {
          action: {
            label: t("subscribe"),
            onClick: () => navigate("/dashboard?tab=subscription"),
          },
        });
      } else if (data.code === "LIMIT_REACHED") {
        toast.error(t("limitReachedAccess"), {
          action: {
            label: t("viewPlans"),
            onClick: () => navigate("/dashboard?tab=subscription"),
          },
        });
      } else {
        console.error("Error requesting access:", data.message);
      }
    } catch (error) {
      console.error("Error requesting access:", error);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-[#008CBA] via-[#00a8db] to-[#008CBA]" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header: avatar + title + CV badge */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#008CBA]/15 to-[#008CBA]/5 text-[#008CBA] flex items-center justify-center ring-2 ring-white shadow-sm">
              <User className="w-6 h-6" />
            </div>
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3
              title={profile.professional_title || t("untitledProfile")}
              className="font-semibold text-gray-900 truncate leading-tight"
            >
              {profile.professional_title || t("untitledProfile")}
            </h3>
            {profile.address && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 truncate max-w-full">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{profile.address}</span>
              </p>
            )}
          </div>

          {profile.has_cv ? (
            <span
              className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-medium"
              title={t("hasCv")}
            >
              <FileCheck className="w-3 h-3" />
              {t("hasCv")}
            </span>
          ) : (
            <span
              className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-medium"
              title={t("noCv")}
            >
              <FileX className="w-3 h-3" />
              {t("noCv")}
            </span>
          )}
        </div>

        {/* Info grid: experience / education / gender */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {profile.experience_level && (
            <div className="col-span-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
              <Briefcase className="w-4 h-4 text-[#008CBA] shrink-0" />
              <span className="text-xs text-gray-500 shrink-0">
                {tc("experienceLevel")}:
              </span>
              <span className="text-xs font-medium text-gray-800 truncate">
                {td(profile.experience_level)}
              </span>
            </div>
          )}

          {profile.education_level && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
              <GraduationCap className="w-4 h-4 text-[#008CBA] shrink-0" />
              <span className="text-xs font-medium text-gray-800 truncate">
                {td(profile.education_level)}
              </span>
            </div>
          )}

          {profile.gender && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border min-w-0 ${
                isFemale
                  ? "bg-pink-50 border-pink-100"
                  : "bg-blue-50 border-blue-100"
              }`}
            >
              {isFemale ? (
                <Venus className="w-4 h-4 text-pink-500 shrink-0" />
              ) : (
                <Mars className="w-4 h-4 text-blue-500 shrink-0" />
              )}
              <span
                className={`text-xs font-medium truncate ${
                  isFemale ? "text-pink-700" : "text-blue-700"
                }`}
              >
                {tc(profile.gender)}
              </span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 5).map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#008CBA]/8 text-[#008CBA] border border-[#008CBA]/15 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-xs font-medium">
                  +{skills.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="mt-auto pt-4">
          {profile.has_access ? (
            <Button
              type="button"
              onClick={() =>
                navigate(`/dashboard?tab=profileView&id=${profile.id}`)
              }
              className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008CBA] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#007399] hover:shadow-md transition-all"
            >
              <Eye className="w-4 h-4" />
              {t("viewProfile")}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleRequestAccess}
              disabled={requesting}
              className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#008CBA] border border-[#008CBA] text-sm font-medium rounded-lg hover:bg-[#008CBA] hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#008CBA]"
            >
              <Lock className="w-4 h-4" />
              {requesting ? t("requesting") : t("requestAccess")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileSearchCard;

import { useState } from "react";
import { User, Briefcase, MapPin, Lock, Eye } from "lucide-react";
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

  const skills: string[] = Array.isArray(profile.skills) ? profile.skills : [];

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
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col">
      {/* Top: avatar + title */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#008CBA] flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {profile.professional_title || t("untitledProfile")}
          </h3>
        </div>
      </div>

      {/* Meta: experience + location */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
        {profile.experience_years != null && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            {profile.experience_years}{" "}
            {profile.experience_years === 1 ? "year" : "years"}
          </span>
        )}
        {profile.address && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {profile.address}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-blue-50 text-[#008CBA] rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Action button */}
      <div className="mt-auto pt-4">
        {profile.has_access ? (
          <Button
            type="button"
            onClick={() =>
              navigate(
                `/dashboard?tab=profileView&id=${profile.user_id || profile.id}`,
              )
            }
            className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008CBA] text-white text-sm font-medium rounded-lg hover:bg-[#007399] transition-colors"
          >
            <Eye className="w-4 h-4" />
            {t("viewProfile")}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleRequestAccess}
            disabled={requesting}
            className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {requesting ? t("requesting") : t("requestAccess")}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProfileSearchCard;

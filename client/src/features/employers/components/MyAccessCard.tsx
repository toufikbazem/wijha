import { Button } from "@/components/ui/button";
import {
  FileText,
  Mail,
  User,
  Briefcase,
  Clock,
  Eye,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

function MyAccessCard({ profile }: { profile: any }) {
  const navigate = useNavigate();
  const { t } = useTranslation("employer");

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "Unnamed";

  const initials =
    (profile.first_name?.[0] || "") + (profile.last_name?.[0] || "");

  const skills: string[] = Array.isArray(profile.skills)
    ? profile.skills
    : [];

  const expiresAt = profile.expire_at
    ? new Date(profile.expire_at).toLocaleDateString("en-GB")
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col">
      {/* Top row: avatar + name + CV */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#008CBA] flex items-center justify-center font-semibold text-sm shrink-0">
              {initials || <User className="w-5 h-5" />}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
            {profile.professional_title && (
              <p className="text-sm text-gray-600 truncate">
                {profile.professional_title}
              </p>
            )}
          </div>
        </div>

        {/* CV button */}
        {profile.CV ? (
          <Button
            className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#008CBA] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            title="View CV"
            asChild
          >
            <a href={profile.CV} target="_blank" rel="noopener noreferrer">
              <FileText className="w-4 h-4" />
              CV
            </a>
          </Button>
        ) : (
          <span
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-50 rounded-lg"
            title="No CV uploaded"
          >
            <FileText className="w-4 h-4" />
            CV
          </span>
        )}
      </div>

      {/* Contact */}
      <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
        <Mail className="w-3.5 h-3.5" />
        <span className="truncate">{profile.email}</span>
      </div>

      {/* Meta: experience + location */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
        {profile.experience_years != null && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            {profile.experience_years}{" "}
            {profile.experience_years === 1 ? t("yearExperience") : t("yearsExperience")}
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

      {/* Expiry + View button */}
      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
        {expiresAt && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {t("expires")} {expiresAt}
          </span>
        )}
        <Button
          onClick={() =>
            navigate(`/dashboard?tab=profileView&id=${profile.user_id}`)
          }
          className="cursor-pointer ltr:ml-auto rtl:mr-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[#008CBA] text-white text-sm font-medium rounded-lg hover:bg-[#007399] transition-colors"
        >
          <Eye className="w-4 h-4" />
          {t("viewFullProfile")}
        </Button>
      </div>
    </div>
  );
}

export default MyAccessCard;

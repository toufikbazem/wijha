import { Button } from "@/components/ui/button";
import {
  FileText,
  Mail,
  User,
  Briefcase,
  Clock,
  Eye,
  MapPin,
  GraduationCap,
  Mars,
  Venus,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

function MyAccessCard({ profile }: { profile: any }) {
  const navigate = useNavigate();
  const { t } = useTranslation("employer");
  const { t: td } = useTranslation("data");
  const { t: tc } = useTranslation("common");

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "Unnamed";

  const initials =
    (profile.first_name?.[0] || "") + (profile.last_name?.[0] || "");

  const skills: string[] = Array.isArray(profile.skills) ? profile.skills : [];

  const expiresAt = profile.expire_at
    ? new Date(profile.expire_at).toLocaleDateString("en-GB")
    : null;

  const isFemale = profile.gender === "female";

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-[#008CBA]/40 hover:shadow-lg hover:shadow-[#008CBA]/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-[#008CBA] via-[#00a8db] to-[#008CBA]" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header: avatar + name/title + CV */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={fullName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#008CBA]/15 to-[#008CBA]/5 text-[#008CBA] flex items-center justify-center font-semibold text-base ring-2 ring-white shadow-sm">
                {initials.toUpperCase() || <User className="w-6 h-6" />}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3
              title={fullName}
              className="font-semibold text-gray-900 truncate leading-tight"
            >
              {fullName}
            </h3>
            {profile.professional_title && (
              <p
                title={profile.professional_title}
                className="mt-0.5 text-sm text-gray-600 truncate"
              >
                {profile.professional_title}
              </p>
            )}
          </div>

          {profile.cv ? (
            <Button
              asChild
              title={t("viewCv") || "View CV"}
              className="cursor-pointer shrink-0 inline-flex items-center gap-1 px-2.5 py-1 h-auto text-[11px] font-medium text-[#008CBA] bg-[#008CBA]/8 hover:bg-[#008CBA]/15 border border-[#008CBA]/15 rounded-full transition-colors"
            >
              <a href={profile.cv} target="_blank" rel="noopener noreferrer">
                <FileText className="w-3 h-3" />
                CV
              </a>
            </Button>
          ) : (
            <span
              title={t("noCv") || "No CV"}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-full"
            >
              <FileText className="w-3 h-3" />
              CV
            </span>
          )}
        </div>

        {/* Info grid: experience / education / gender / location */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {profile.email && (
            <div className="col-span-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
              <Mail className="w-4 h-4 text-[#008CBA] shrink-0" />
              <span className="text-xs text-gray-500 shrink-0">
                {tc("email")}:
              </span>
              <span className="text-xs font-medium text-gray-800 truncate">
                {td(profile.email)}
              </span>
            </div>
          )}
          {profile.experience_level && (
            <div className="col-span-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
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
              <span
                title={td(profile.education_level)}
                className="text-xs font-medium text-gray-800 truncate"
              >
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

          {profile.address && (
            <div className="col-span-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
              <MapPin className="w-4 h-4 text-[#008CBA] shrink-0" />
              <span
                title={profile.address}
                className="text-xs font-medium text-gray-800 truncate"
              >
                {profile.address}
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

        {/* Footer: expiry + view button */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          {expiresAt ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-medium text-amber-700">
              <Clock className="w-3 h-3" />
              {t("expires")} {expiresAt}
            </span>
          ) : (
            <span />
          )}
          <Button
            onClick={() =>
              navigate(`/dashboard?tab=profileView&id=${profile.jobseeker_id}`)
            }
            className="cursor-pointer ltr:ml-auto rtl:mr-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[#008CBA] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#007399] hover:shadow-md transition-all"
          >
            <Eye className="w-4 h-4" />
            {t("viewFullProfile")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MyAccessCard;

import { Button } from "@/components/ui/button";
import { FileText, Mail, User, Briefcase, Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

function DashApplicantItem({ applicant }: { applicant: any }) {
  const { t } = useTranslation("employer");
  const fullName =
    [applicant.first_name, applicant.last_name].filter(Boolean).join(" ") ||
    "Unnamed Applicant";

  const initials =
    (applicant.first_name?.[0] || "") + (applicant.last_name?.[0] || "");

  const skills: string[] = Array.isArray(applicant.skills)
    ? applicant.skills
    : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">
      {/* Top row: avatar + name + CV button */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {applicant.profile_image ? (
            <img
              src={applicant.profile_image}
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
            {applicant.professional_title && (
              <p className="text-sm text-gray-600 truncate">
                {applicant.professional_title}
              </p>
            )}
          </div>
        </div>

        {/* CV button */}
        {applicant.cv ? (
          <Button
            className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#008CBA] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            title="View CV"
            asChild
          >
            <a href={applicant.cv} target="_blank" rel="noopener noreferrer">
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
        <span className="truncate">{applicant.email}</span>
      </div>

      {/* Meta row: experience + applied date */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
        {applicant.experience_level && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            {t(applicant.experience_level)}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {t("applied")}{" "}
          {new Date(applicant.applied_at).toLocaleDateString("en-GB")}
        </span>
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

      {/* Summary preview */}
      {applicant.professional_summary && (
        <p className="mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {applicant.professional_summary}
        </p>
      )}
    </div>
  );
}

export default DashApplicantItem;

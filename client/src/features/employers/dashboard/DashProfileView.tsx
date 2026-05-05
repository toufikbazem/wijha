import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Award,
  Link2,
  FileText,
  Calendar,
  Download,
  CheckCircle2,
  Share2,
  TrendingUp,
  Mars,
  Venus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function DashProfileView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  const jobSeekerId = new URLSearchParams(location.search).get("id");
  const { t } = useTranslation("employer");
  const { t: td } = useTranslation("data");

  useEffect(() => {
    if (!jobSeekerId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobseekers/${jobSeekerId}`,
          { method: "GET", credentials: "include" },
        );
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [jobSeekerId]);

  if (!jobSeekerId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("noProfileSelected")}
          </h3>
          <p className="text-gray-500">{t("goBackProfileAccess")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-64 w-full rounded-3xl bg-gray-200" />
          <Skeleton className="h-32 w-full rounded-2xl bg-gray-200" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl bg-gray-200" />
              <Skeleton className="h-48 w-full rounded-2xl bg-gray-200" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-2xl bg-gray-200" />
              <Skeleton className="h-40 w-full rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <h3 className="text-xl font-bold text-red-600 mb-2">
            {t("accessDenied")}
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    t("untitledProfile");

  const skills: string[] = Array.isArray(profile.skills) ? profile.skills : [];
  const experiences: any[] = Array.isArray(profile.experiences)
    ? profile.experiences
    : [];
  const educations: any[] = Array.isArray(profile.educations)
    ? profile.educations
    : [];
  const languages: any[] = Array.isArray(profile.languages)
    ? profile.languages
    : [];

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        })
      : "";

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard?tab=profileAccess")}
          className="cursor-pointer inline-flex items-center text-sm text-gray-600 hover:text-[#008CBA] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 ltr:mr-1 rtl:ml-1 rtl:rotate-180" />
          {t("backProfileAccess")}
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 relative">
          <div className="h-32 bg-[#008CBA]"></div>
          <div className="px-6 md:px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-16">
              {/* Avatar */}
              <div className="m-auto sm:m-0 w-fit h-fit">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={fullName}
                    className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
                  />
                ) : (
                  <div className="bg-[#008CBA] w-32 h-32 flex items-center justify-center rounded-xl border-4 border-white shadow-lg">
                    <User className="text-white w-24 h-24" />
                  </div>
                )}
              </div>

              {/* Name + meta */}
              <div className="flex-1 mt-4 md:mt-6">
                <h2 className="text-3xl font-bold text-gray-900 md:text-gray-100">
                  {fullName}
                </h2>
                <p className="text-xl text-[#008CBA] font-medium mt-1">
                  {profile.professional_title || t("untitledProfile")}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  {profile.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile.address}</span>
                    </div>
                  )}
                  {profile.education_level && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-sm">
                        {td(profile.education_level)}
                      </span>
                    </div>
                  )}
                  {profile.experience_level && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">
                        {td(profile.experience_level)}
                      </span>
                    </div>
                  )}
                  {profile.gender && (
                    <div className="flex items-center gap-2 text-gray-600">
                      {profile.gender === "female" ? (
                        <Venus className="w-4 h-4 text-pink-500" />
                      ) : (
                        <Mars className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="text-sm">
                        {t(profile.gender, { ns: "common" })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highly visible CV section right under the header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-[#008CBA] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">
              {t("cvSection")}
            </h3>
          </div>

          {profile.cv ? (
            <div className="rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#E6F7FB] flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7 text-[#008CBA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-800 truncate">
                    {fullName} — {t("cvSection")}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <p className="text-xs text-green-600 font-medium">
                      {t("cvAvailable")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#008CBA] text-[#008CBA] text-sm font-medium hover:bg-[#E6F7FB] transition"
                  >
                    <FileText className="w-4 h-4" />
                    {t("viewCV")}
                  </a>
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#008CBA] text-white text-sm font-medium hover:bg-[#007399] transition"
                  >
                    <Download className="w-4 h-4" />
                    {t("downloadCV")}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#008CBA]" />
              </div>
              <p className="text-gray-800 font-semibold mb-1">
                {t("noCVUploaded")}
              </p>
              <p className="text-sm text-gray-500">{t("noCVUploadedDesc")}</p>
            </div>
          )}
        </div>

        {/* Two-column main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#008CBA] rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t("professionalSummary")}
                </h3>
              </div>
              {profile.professional_summary ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.professional_summary}
                </p>
              ) : (
                <EmptyState message={t("noSummaryAdded")} />
              )}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-[#008CBA]" />
                <h3 className="text-xl font-bold text-gray-900">
                  {t("experience")}
                </h3>
              </div>
              {experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.map((exp: any) => (
                    <div
                      key={exp.id}
                      className="ltr:border-l-2 rtl:border-r-2 border-[#008CBA] ltr:pl-4 rtl:pr-4 py-2"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {exp.title}
                      </h4>
                      <p className="text-sm text-[#008CBA] font-medium">
                        {exp.company}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(exp.start_date)}
                        {" - "}
                        {exp.is_current
                          ? t("present")
                          : formatDate(exp.end_date)}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message={t("noExperienceAdded")} />
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-[#008CBA]" />
                <h3 className="text-xl font-bold text-gray-900">
                  {t("education")}
                </h3>
              </div>
              {educations.length > 0 ? (
                <div className="space-y-4">
                  {educations.map((edu: any) => (
                    <div
                      key={edu.id}
                      className="ltr:border-l-2 rtl:border-r-2 border-[#008CBA] ltr:pl-4 rtl:pr-4 py-2"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-[#008CBA] font-medium">
                        {edu.school}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(edu.start_date)}
                        {" - "}
                        {edu.is_current
                          ? t("present")
                          : formatDate(edu.end_date)}
                      </div>
                      {edu.description && (
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message={t("noEducationAdded")} />
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Contacts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-[#008CBA]" />
                <h3 className="text-lg font-bold text-gray-900">
                  {t("contacts")}
                </h3>
              </div>
              <div className="space-y-3">
                {profile.email && (
                  <Link
                    to={`mailto:${profile.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                  >
                    <Mail className="w-5 h-5 text-[#008CBA] shrink-0" />
                    <span className="overflow-hidden text-ellipsis text-sm text-gray-700 group-hover:text-[#008CBA] transition">
                      {profile.email}
                    </span>
                  </Link>
                )}
                {profile.phone_number && (
                  <Link
                    to={`tel:${profile.phone_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                  >
                    <Phone className="w-5 h-5 text-[#008CBA] shrink-0" />
                    <span className="overflow-hidden text-ellipsis text-sm text-gray-700 group-hover:text-[#008CBA] transition">
                      {profile.phone_number}
                    </span>
                  </Link>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
                  >
                    <Share2 className="w-5 h-5 text-[#008CBA] shrink-0" />
                    <span className="overflow-hidden text-ellipsis text-sm text-gray-700 group-hover:text-[#008CBA] transition truncate">
                      {profile.linkedin}
                    </span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                  >
                    <Globe className="w-5 h-5 text-gray-700 shrink-0" />
                    <span className="overflow-hidden text-ellipsis text-sm text-gray-700 group-hover:text-gray-900 transition truncate">
                      {profile.github}
                    </span>
                  </a>
                )}
                {profile.portfolio && (
                  <a
                    href={
                      profile.portfolio.startsWith("http")
                        ? profile.portfolio
                        : `https://${profile.portfolio}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition group"
                  >
                    <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="overflow-hidden text-ellipsis text-sm text-gray-700 group-hover:text-indigo-600 transition truncate">
                      {profile.portfolio}
                    </span>
                  </a>
                )}
                {!profile.email &&
                  !profile.phone_number &&
                  !profile.linkedin &&
                  !profile.github &&
                  !profile.portfolio && (
                    <EmptyState message={t("noContactsAdded")} />
                  )}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#008CBA]" />
                <h3 className="text-lg font-bold text-gray-900">
                  {t("languages")}
                </h3>
              </div>
              {languages.length > 0 ? (
                <div className="space-y-2">
                  {languages.map((lang: any) => (
                    <div
                      key={lang.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {lang.language}
                      </span>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message={t("noLanguagesAdded")} />
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#008CBA]" />
                <h3 className="text-lg font-bold text-gray-900">
                  {t("skills")}
                </h3>
              </div>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#E6F7FB] text-[#008CBA] rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState message={t("noSkillsAdded")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

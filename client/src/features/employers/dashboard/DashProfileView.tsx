import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
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
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function DashProfileView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  const jobSeekerId = new URLSearchParams(location.search).get("id");
  const { t } = useTranslation("employer");

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
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("noProfileSelected")}
          </h3>
          <p className="text-gray-500">
            {t("goBackProfileAccess")}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl bg-gray-200" />
          <Skeleton className="h-48 w-full rounded-2xl bg-gray-200" />
          <Skeleton className="h-48 w-full rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <h3 className="text-xl font-bold text-red-600 mb-2">{t("accessDenied")}</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "Unnamed";

  const skills: string[] = Array.isArray(profile.skills)
    ? profile.skills
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard?tab=profileAccess")}
          className="cursor-pointer inline-flex items-center text-sm text-gray-600 hover:text-[#008CBA] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 ltr:mr-1 rtl:ml-1" />
          {t("backProfileAccess")}
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-[#008CBA]"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-16">
              {/* Avatar */}
              <div className="shrink-0">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={fullName}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="bg-[#008CBA] w-32 h-32 flex items-center justify-center rounded-xl border-4 border-white shadow-lg">
                    <User className="text-white w-18 h-18" />
                  </div>
                )}
              </div>

              {/* Name + contact */}
              <div className="flex-1 mt-4 md:mt-6">
                <h2 className="text-3xl font-bold text-gray-900">{fullName}</h2>
                <p className="text-xl text-[#008CBA] font-medium mt-1">
                  {profile.professional_title}
                </p>

                <div className="flex flex-wrap gap-4 mt-4">
                  {profile.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{profile.phone_number}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile.address}</span>
                    </div>
                  )}
                  {profile.experience_years != null && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">
                        {profile.experience_years} {profile.experience_years === 1 ? t("yearExperience") : t("yearsExperience")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CV button */}
              {profile.CV && (
                <div className="mt-4 md:mt-6">
                  <Button
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#008CBA] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    asChild
                  >
                    <a
                      href={profile.CV}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="w-4 h-4" />
                      {t("downloadCV")}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#008CBA] rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t("professionalSummary")}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {profile.professional_summary || t("noSummary")}
              </p>
            </div>

            {/* Experience */}
            {profile.experiences && profile.experiences.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-[#008CBA]" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {t("experience")}
                  </h3>
                </div>
                <div className="space-y-4">
                  {profile.experiences.map((exp: any) => (
                    <div
                      key={exp.id}
                      className="border-l-2 border-[#008CBA] pl-4 py-2"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {exp.title}
                      </h4>
                      <p className="text-sm text-[#008CBA] font-medium">
                        {exp.company}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {exp.start_date &&
                          new Date(exp.start_date).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric",
                          })}
                        {" - "}
                        {exp.is_current
                          ? t("present")
                          : exp.end_date &&
                            new Date(exp.end_date).toLocaleDateString("en-GB", {
                              month: "short",
                              year: "numeric",
                            })}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.educations && profile.educations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-[#008CBA]" />
                  <h3 className="text-xl font-bold text-gray-900">{t("education")}</h3>
                </div>
                <div className="space-y-4">
                  {profile.educations.map((edu: any) => (
                    <div
                      key={edu.id}
                      className="border-l-2 border-[#008CBA] pl-4 py-2"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-[#008CBA] font-medium">
                        {edu.school}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {edu.start_date &&
                          new Date(edu.start_date).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric",
                          })}
                        {" - "}
                        {edu.is_current
                          ? t("present")
                          : edu.end_date &&
                            new Date(edu.end_date).toLocaleDateString("en-GB", {
                              month: "short",
                              year: "numeric",
                            })}
                      </div>
                      {edu.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-[#008CBA]" />
                <h3 className="text-lg font-bold text-gray-900">{t("links")}</h3>
              </div>
              <div className="space-y-3">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition truncate">
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
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition truncate">
                      {profile.github}
                    </span>
                  </a>
                )}
                {profile.portfolio && (
                  <a
                    href={`https://${profile.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition group"
                  >
                    <Globe className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition truncate">
                      {profile.portfolio}
                    </span>
                  </a>
                )}
                {!profile.linkedin &&
                  !profile.github &&
                  !profile.portfolio && (
                    <p className="text-sm text-gray-400">{t("noLinksAvailable")}</p>
                  )}
              </div>
            </div>

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-[#008CBA]" />
                  <h3 className="text-lg font-bold text-gray-900">{t("languages")}</h3>
                </div>
                <div className="space-y-2">
                  {profile.languages.map((lang: any) => (
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
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#008CBA]" />
                  <h3 className="text-lg font-bold text-gray-900">{t("skills")}</h3>
                </div>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

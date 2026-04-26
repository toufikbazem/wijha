import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  deactivated: "bg-red-50 text-red-700 border-red-200",
  unverified: "bg-yellow-50 text-yellow-700 border-yellow-200",
  suspended: "bg-orange-50 text-orange-700 border-orange-200",
};

const VALID_STATUSES = ["active", "deactivated", "unverified", "suspended"];

export default function JobSeekerDetails({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/admin/job-seekers/${userId}`,
          { credentials: "include" },
        );
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching job seeker details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/v1/admin/job-seekers/${userId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );
      setProfile((prev: any) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Job seeker not found.</p>
      </div>
    );
  }

  const displayEmail = profile.email || profile.user_email;

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/admin?tab=job-seekers")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {profile.profile_image ? (
            <img src={profile.profile_image} alt="" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-2xl font-bold text-primary-500">
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.is_admin_created && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                  <UserPlus className="w-3 h-3" />
                  Admin Created
                </span>
              )}
            </div>
            {profile.professional_title && (
              <p className="text-gray-500 mt-1">{profile.professional_title}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              {displayEmail && (
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {displayEmail}</span>
              )}
              {profile.phone_number && (
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {profile.phone_number}</span>
              )}
              {profile.address && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.address}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={profile.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer ${
                STATUS_COLORS[profile.status] || "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {VALID_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Summary */}
        {profile.professional_summary && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h2>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{profile.professional_summary}</p>
          </div>
        )}

        {/* Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <div className="space-y-3 text-sm">
            <InfoRow label="Gender" value={profile.gender} />
            <InfoRow label="Experience" value={profile.experience_years ? `${profile.experience_years} years` : undefined} />
            {profile.is_admin_created ? (
              <InfoRow label="Account Type" value="Admin Created (No Account)" />
            ) : (
              <InfoRow label="Email Verified" value={profile.is_email_verified ? "Yes" : "No"} />
            )}
            <InfoRow label="Joined" value={new Date(profile.account_created_at || profile.created_at).toLocaleDateString()} />
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <span className="text-gray-500">Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(Array.isArray(profile.skills) ? profile.skills : [profile.skills]).map((skill: string, i: number) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
          <div className="space-y-3 text-sm">
            <InfoRow label="LinkedIn" value={profile.linkedin} />
            <InfoRow label="GitHub" value={profile.github} />
            <InfoRow label="Portfolio" value={profile.portfolio} />
            <InfoRow label="CV" value={profile.cv ? "Uploaded" : "Not uploaded"} />
          </div>
        </div>

        {/* Experiences */}
        {profile.experiences?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <Briefcase className="w-5 h-5 inline mr-2" />Experiences
            </h2>
            <div className="space-y-4">
              {profile.experiences.map((exp: any) => (
                <div key={exp.id} className="border-l-2 border-primary-200 pl-4">
                  <p className="font-medium text-gray-900">{exp.title}</p>
                  <p className="text-gray-600 text-sm">{exp.company}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {exp.start_date && new Date(exp.start_date).toLocaleDateString()} — {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "Present"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.educations?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <Calendar className="w-5 h-5 inline mr-2" />Education
            </h2>
            <div className="space-y-4">
              {profile.educations.map((edu: any) => (
                <div key={edu.id} className="border-l-2 border-purple-200 pl-4">
                  <p className="font-medium text-gray-900">{edu.degree}</p>
                  <p className="text-gray-600 text-sm">{edu.school}</p>
                  <p className="text-gray-400 text-xs mt-1">{edu.field_of_study}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {profile.languages?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang: any) => (
                <span key={lang.id} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg">
                  {lang.language} — {lang.level}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value || "-"}</span>
    </div>
  );
}

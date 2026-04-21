import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Globe, Link } from "lucide-react";
import { useNavigate } from "react-router";

export default function EmployerDetails({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/admin/employers/${userId}`,
          { credentials: "include" },
        );
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching employer details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/v1/admin/employers/${userId}/status`,
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
        <p className="text-gray-500">Employer not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate("/admin?tab=employers")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Employers
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {profile.logo ? (
            <img src={profile.logo} alt="" className="w-20 h-20 rounded-xl object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-purple-50 flex items-center justify-center text-2xl font-bold text-purple-500">
              {profile.company_name?.[0]}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{profile.company_name}</h1>
            <p className="text-gray-500 mt-1">{profile.industry}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {profile.email}</span>
              {profile.phone_number && (
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {profile.phone_number}</span>
              )}
              {profile.address && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.address}</span>
              )}
            </div>
          </div>
          <select
            value={profile.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer ${
              profile.status === "active"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <option value="active">Active</option>
            <option value="desactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profile.description && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{profile.description}</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h2>
          <div className="space-y-3 text-sm">
            <InfoRow label="Size" value={profile.size} />
            <InfoRow label="Industry" value={profile.industry} />
            <InfoRow label="Founded" value={profile.founding_year ? String(profile.founding_year) : undefined} />
            <InfoRow label="Email Verified" value={profile.is_email_verified ? "Yes" : "No"} />
            <InfoRow label="Joined" value={new Date(profile.created_at).toLocaleDateString()} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
          <div className="space-y-3 text-sm">
            {profile.website && (
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{profile.website}</span>
              </div>
            )}
            {profile.linkedin && (
              <div className="flex items-center gap-2 text-gray-600">
                <Link className="w-4 h-4" />
                <span>{profile.linkedin}</span>
              </div>
            )}
            {!profile.website && !profile.linkedin && (
              <p className="text-gray-400">No links provided</p>
            )}
          </div>
        </div>

        {profile.mission && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Missions</h2>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{profile.mission}</p>
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

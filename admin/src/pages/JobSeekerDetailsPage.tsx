import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronLeft, Edit2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import JobSeekerProfileHeader from "@/components/jobseeker-details/JobSeekerProfileHeader";
import ProfileTab from "@/components/jobseeker-details/ProfileTab";
import ApplicationsTab from "@/components/jobseeker-details/ApplicationsTab";
import SavedJobsTab from "@/components/jobseeker-details/SavedJobsTab";
import AccountTab from "@/components/jobseeker-details/AccountTab";
import JobSeekerDetailsSkeleton from "@/components/jobseeker-details/JobSeekerDetailsSkeleton";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

const tabs = ["Profile", "Applications", "Saved Jobs", "Account"] as const;
type Tab = (typeof tabs)[number];

const editSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  professional_title: z.string().optional(),
  professional_summary: z.string().optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  experience_level: z.string().optional(),
  education_level: z.string().optional(),
  linkedin: z.string().optional(),
  skills: z.array(z.string()).optional(),
  profile_image: z.string().optional(),
  cv: z.string().optional(),
});

type EditValues = z.infer<typeof editSchema>;
type ProfileStatus = "active" | "unverified" | "suspended" | "deactivated";

export default function JobSeekerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("Profile");
  const [seeker, setSeeker] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const navigate = useNavigate();

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      professional_title: "",
      professional_summary: "",
      phone_number: "",
      address: "",
      gender: "",
      experience_level: "",
      education_level: "",
      linkedin: "",
      skills: [],
      profile_image: "",
      cv: "",
    },
  });

  function seekerToFormValues(s: any): EditValues {
    return {
      first_name: s.first_name ?? "",
      last_name: s.last_name ?? "",
      professional_title: s.professional_title ?? "",
      professional_summary: s.professional_summary ?? "",
      phone_number: s.phone_number ?? "",
      address: s.address ?? "",
      gender: s.gender ?? "",
      experience_level: s.experience_level ?? "",
      education_level: s.education_level ?? "",
      linkedin: s.linkedin ?? "",
      skills: s.skills ?? [],
      profile_image: s.profile_image ?? "",
      cv: s.cv ?? "",
    };
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetch(`${BASE}/admin/job-seekers/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSeeker(data);
        setExperiences(data.experiences ?? []);
        setEducations(data.educations ?? []);
        setLanguages(data.languages ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!seeker) return;
    form.reset(seekerToFormValues(seeker));
  }, [seeker]);

  async function onSave(values: EditValues) {
    if (!id) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`${BASE}/admin/job-seekers/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message ?? "Failed");
      setSeeker((prev: any) => ({
        ...prev,
        ...(result.jobSeeker ?? values),
      }));
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update profile");
    } finally {
      setSavingEdit(false);
    }
  }

  function cancelEdit() {
    if (seeker) form.reset(seekerToFormValues(seeker));
    setIsEditing(false);
  }

  async function changeStatus(status: ProfileStatus) {
    if (!id) return;
    const prev = seeker?.status;
    setSeeker((s: any) => ({ ...s, status }));
    try {
      const res = await fetch(`${BASE}/admin/job-seekers/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message ?? "Failed");
      toast.success("Status updated");
    } catch (e: any) {
      setSeeker((s: any) => ({ ...s, status: prev }));
      toast.error(e.message ?? "Failed to update status");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <JobSeekerDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (!seeker) {
    return <div className="p-8 text-gray-500">Job seeker not found.</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSave)}>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="size-4" /> Job Seekers
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto px-6 py-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Job Seeker Details
            </h1>
            <p className="mt-1 text-gray-600">
              View and manage this job seeker's profile and activity
            </p>
          </div>

          {tab === "Profile" && (
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-[#008CBA] text-white rounded-xl hover:bg-[#007B9E] transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 text-white rounded-xl bg-[#008CBA] hover:bg-[#007B9E] transition disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {savingEdit ? "Saving…" : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <JobSeekerProfileHeader
            profile={seeker}
            isEditing={isEditing && tab === "Profile"}
            form={form}
            setProfile={(updater) => setSeeker((prev: any) => updater(prev))}
            onChangeStatus={changeStatus}
          />

          {/* Tabs */}
          <div className="mb-6 flex gap-1 border-b border-gray-200 overflow-x-auto">
            {tabs.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  tab === t
                    ? "border-b-2 border-[#008CBA] text-[#008CBA]"
                    : "text-gray-500 hover:text-gray-900",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Profile" && (
            <ProfileTab
              profile={seeker}
              isEditing={isEditing}
              form={form}
              setProfile={(updater) => setSeeker((prev: any) => updater(prev))}
              experiences={experiences}
              setExperiences={setExperiences}
              educations={educations}
              setEducations={setEducations}
              languages={languages}
              setLanguages={setLanguages}
            />
          )}

          {tab === "Applications" && id && <ApplicationsTab seekerId={id} />}

          {tab === "Saved Jobs" && id && <SavedJobsTab seekerId={id} />}

          {tab === "Account" && seeker.user_id && (
            <AccountTab
              userId={seeker.user_id}
              email={seeker.email ?? ""}
              isVerified={!!seeker.is_email_verified}
            />
          )}

          {tab === "Account" && !seeker.user_id && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
              This job seeker was created by an admin and has no linked user
              account.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

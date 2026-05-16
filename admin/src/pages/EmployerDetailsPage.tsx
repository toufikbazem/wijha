import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronLeft, Edit2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import EmployerProfileHeader from "@/components/employer-details/EmployerProfileHeader";
import EmployerProfileTab from "@/components/employer-details/EmployerProfileTab";
import SubscriptionTab from "@/components/employer-details/SubscriptionTab";
import ProfileAccessTab from "@/components/employer-details/ProfileAccessTab";
import JobPostsTab from "@/components/employer-details/JobPostsTab";
import AccountTab from "@/components/jobseeker-details/AccountTab";
import EmployerDetailsSkeleton from "@/components/employer-details/EmployerDetailsSkeleton";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

const tabs = [
  "Profile",
  "Job Posts",
  "Subscription",
  "Profile Access",
  "Account",
] as const;
type Tab = (typeof tabs)[number];

const editSchema = z.object({
  company_name: z.string().min(1, "Required"),
  industry: z.string().optional(),
  size: z.string().optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  description: z.string().optional(),
  founding_year: z.string().optional(),
  logo: z.string().optional(),
  cover_image: z.string().optional(),
  missions: z.array(z.string()).optional(),
});

type EditValues = z.infer<typeof editSchema>;
type ProfileStatus = "active" | "unverified" | "suspended" | "deactivated";

function employerToFormValues(e: any): EditValues {
  return {
    company_name: e.company_name ?? "",
    industry: e.industry ?? "",
    size: e.size ?? e.company_size ?? "",
    phone_number: e.phone_number ?? "",
    address: e.address ?? "",
    website: e.website ?? "",
    linkedin: e.linkedin ?? "",
    description: e.description ?? "",
    founding_year: e.founding_year ?? "",
    logo: e.logo ?? "",
    cover_image: e.cover_image ?? "",
    missions: e.missions ?? [],
  };
}

export default function EmployerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("Profile");
  const [employer, setEmployer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      company_name: "",
      industry: "",
      size: "",
      phone_number: "",
      address: "",
      website: "",
      linkedin: "",
      description: "",
      founding_year: "",
      logo: "",
      cover_image: "",
      missions: [],
    },
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetch(`${BASE}/admin/employers/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setEmployer(data);
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
    if (!employer) return;
    form.reset(employerToFormValues(employer));
  }, [employer]);

  async function onSave(values: EditValues) {
    if (!id) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`${BASE}/admin/employers/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message ?? "Failed");
      setEmployer((prev: any) => ({
        ...prev,
        ...(result.employer ?? values),
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
    if (employer) form.reset(employerToFormValues(employer));
    setIsEditing(false);
  }

  async function changeStatus(status: ProfileStatus) {
    if (!id) return;
    const prev = employer?.status;
    setEmployer((e: any) => ({ ...e, status }));
    try {
      const res = await fetch(`${BASE}/admin/employers/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message ?? "Failed");
      toast.success("Status updated");
    } catch (e: any) {
      setEmployer((s: any) => ({ ...s, status: prev }));
      toast.error(e.message ?? "Failed to update status");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <EmployerDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (!employer) {
    return <div className="p-8 text-gray-500">Employer not found.</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSave)}>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <Link
            to="/employers"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="size-4" /> Employers
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto px-6 py-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Employer Details
            </h1>
            <p className="mt-1 text-gray-600">
              View and manage this employer's profile and activity
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

        {/* Main */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <EmployerProfileHeader
            companyInfo={employer}
            setCompanyInfo={(updater) =>
              setEmployer((prev: any) => updater(prev))
            }
            isEditing={isEditing && tab === "Profile"}
            form={form}
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
            <EmployerProfileTab
              companyInfo={employer}
              setCompanyInfo={(updater) =>
                setEmployer((prev: any) => updater(prev))
              }
              isEditing={isEditing}
              form={form}
            />
          )}

          {tab === "Job Posts" && employer?.id && (
            <JobPostsTab employerId={String(employer.id)} />
          )}

          {tab === "Subscription" && id && <SubscriptionTab employerId={id} />}

          {tab === "Profile Access" && id && (
            <ProfileAccessTab employerId={id} />
          )}

          {tab === "Account" && employer.user_id && (
            <AccountTab
              userId={employer.user_id}
              email={employer.email ?? ""}
              isVerified={!!employer.is_email_verified}
            />
          )}

          {tab === "Account" && !employer.user_id && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
              This employer was created by an admin and has no linked user
              account.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Briefcase,
  ChevronLeft,
  Edit2,
  LayoutGrid,
  Save,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import JobPostDetailsHeader from "@/components/jobpost-details/JobPostDetailsHeader";
import JobPostDetailsTab from "@/components/jobpost-details/JobPostDetailsTab";
import JobApplicationsTab from "@/components/jobpost-details/JobApplicationsTab";
import StatusReasonDialog, {
  type ReasonRequiredStatus,
} from "@/components/jobpost-details/StatusReasonDialog";

const REASON_REQUIRED_STATUSES: ReasonRequiredStatus[] = ["Pending", "Rejected"];

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

const tabs = [
  { key: "Details", icon: LayoutGrid },
  { key: "Applications", icon: Users },
] as const;
type TabKey = (typeof tabs)[number]["key"];

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
  job_type: z.string().optional(),
  job_mode: z.string().optional(),
  experience_level: z.string().optional(),
  education_level: z.string().optional(),
  min_salary: z.string().optional(),
  max_salary: z.string().optional(),
  number_of_positions: z.string().optional(),
  deadline: z.string().nullable().optional(),
  is_anonymous: z.boolean().optional(),
});
type EditValues = z.infer<typeof editSchema>;

function postToFormValues(p: any): EditValues {
  return {
    title: p.title ?? "",
    description: p.description ?? "",
    location: p.location ?? "",
    industry: p.industry ?? "",
    job_type: p.job_type ?? "",
    job_mode: p.job_mode ?? "",
    experience_level: p.experience_level ?? "",
    education_level: p.education_level ?? "",
    min_salary: p.min_salary != null ? String(p.min_salary) : "",
    max_salary: p.max_salary != null ? String(p.max_salary) : "",
    number_of_positions:
      p.number_of_positions != null ? String(p.number_of_positions) : "",
    deadline: p.deadline
      ? new Date(p.deadline).toISOString().slice(0, 10)
      : null,
    is_anonymous: !!p.is_anonymous,
  };
}

function formValuesToPayload(v: EditValues) {
  const num = (s?: string) =>
    s == null || s === "" ? null : Number.isFinite(Number(s)) ? Number(s) : s;
  return {
    title: v.title,
    description: v.description ?? "",
    location: v.location ?? "",
    industry: v.industry ?? "",
    job_type: v.job_type ?? "",
    job_mode: v.job_mode ?? "",
    experience_level: v.experience_level ?? "",
    education_level: v.education_level ?? "",
    min_salary: num(v.min_salary),
    max_salary: num(v.max_salary),
    number_of_positions: num(v.number_of_positions),
    deadline: v.deadline || null,
    is_anonymous: !!v.is_anonymous,
  };
}

export default function JobPostDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<TabKey>("Details");
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusChanging, setStatusChanging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Reason dialog state — required when moving to Pending or Rejected
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] =
    useState<ReasonRequiredStatus | null>(null);

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: postToFormValues({}),
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetch(`${BASE}/admin/job-posts/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setPost(d);
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
    if (!post) return;
    form.reset(postToFormValues(post));
  }, [post]);

  async function applyStatusChange(status: string, status_reason?: string) {
    if (!id) return;
    const prev = post?.status;
    const prevReason = post?.status_reason;
    setStatusChanging(true);
    setPost((p: any) => ({
      ...p,
      status,
      status_reason: status_reason ?? null,
    }));
    try {
      const res = await fetch(`${BASE}/admin/job-posts/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, status_reason: status_reason ?? null }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message ?? "Failed");
      if (result?.jobPost) {
        setPost((p: any) => ({ ...p, ...result.jobPost }));
      }
      toast.success("Status updated");
    } catch (e: any) {
      setPost((p: any) => ({ ...p, status: prev, status_reason: prevReason }));
      toast.error(e.message ?? "Failed to update status");
    } finally {
      setStatusChanging(false);
    }
  }

  function changeStatus(status: string) {
    if (status === post?.status) return;
    if (REASON_REQUIRED_STATUSES.includes(status as ReasonRequiredStatus)) {
      setPendingStatus(status as ReasonRequiredStatus);
      setReasonDialogOpen(true);
      return;
    }
    applyStatusChange(status);
  }

  function confirmReasonDialog(reason: string) {
    if (!pendingStatus) return;
    const status = pendingStatus;
    setReasonDialogOpen(false);
    setPendingStatus(null);
    applyStatusChange(status, reason);
  }

  function cancelReasonDialog() {
    setReasonDialogOpen(false);
    setPendingStatus(null);
  }

  async function deletePost() {
    if (!id) return;
    if (!confirm("Delete this job post? This cannot be undone.")) return;
    try {
      const res = await fetch(`${BASE}/admin/job-posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Failed");
      }
      toast.success("Job post deleted");
      window.history.back();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete job post");
    }
  }

  async function onSave(values: EditValues) {
    if (!id) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`${BASE}/admin/job-posts/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValuesToPayload(values)),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message ?? "Failed");
      setPost((prev: any) => ({ ...prev, ...(result.jobPost ?? {}) }));
      toast.success("Job post updated");
      setIsEditing(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update job post");
    } finally {
      setSavingEdit(false);
    }
  }

  function cancelEdit() {
    if (post) form.reset(postToFormValues(post));
    setIsEditing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-32 w-full animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Job post not found.</p>
          <Link
            to="/job-posts"
            className="inline-flex items-center gap-1 mt-4 text-sm text-[#008CBA] hover:underline"
          >
            <ChevronLeft className="size-4" /> Back to job posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSave)}>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <Link
            to="/job-posts"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="size-4" /> Job Posts
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto px-6 py-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Job Post Details
            </h1>
            <p className="mt-1 text-gray-600">
              Review, manage and moderate this job post
            </p>
          </div>

          {tab === "Details" && (
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-[#008CBA] text-white rounded-xl hover:bg-[#007B9E] transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Job Post
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

        <div className="max-w-7xl mx-auto px-6 py-4">
          <JobPostDetailsHeader
            post={post}
            statusChanging={statusChanging}
            onChangeStatus={changeStatus}
            onDelete={deletePost}
          />

          {/* Modern segmented tab bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-6 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {tabs.map(({ key, icon: Icon }) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer",
                      active
                        ? "bg-[#008CBA] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {key}
                  </button>
                );
              })}
            </div>
          </div>

          {tab === "Details" && (
            <JobPostDetailsTab
              post={post}
              isEditing={isEditing}
              form={form}
            />
          )}
          {tab === "Applications" && id && <JobApplicationsTab postId={id} />}
        </div>

        <StatusReasonDialog
          open={reasonDialogOpen}
          status={pendingStatus}
          onCancel={cancelReasonDialog}
          onConfirm={confirmReasonDialog}
        />
      </div>
    </form>
  );
}

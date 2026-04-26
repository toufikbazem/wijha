import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Clock, Building2, Briefcase, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

const JOB_STATUSES = ["Draft", "Active", "In-review", "Pending", "Paused", "Rejected", "Expired", "Deleted"];

export default function JobPostDetails({ jobId }: { jobId: string }) {
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Reason dialog state
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  // Permanent delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/admin/job-posts/${jobId}`, { credentials: "include" });
        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job post details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleStatusChange = async (newStatus: string, reason?: string) => {
    try {
      await fetch(`http://localhost:5000/api/v1/admin/job-posts/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus, status_reason: reason || null }),
      });
      setJob((prev: any) => ({ ...prev, status: newStatus, status_reason: reason || null }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const onSelectChange = (newStatus: string) => {
    if (newStatus === "Pending" || newStatus === "Rejected") {
      setPendingStatus(newStatus);
      setStatusReason("");
      setReasonError("");
      setReasonDialogOpen(true);
    } else {
      handleStatusChange(newStatus);
    }
  };

  const confirmReasonDialog = () => {
    if (!statusReason.trim()) {
      setReasonError("Reason is required.");
      return;
    }
    handleStatusChange(pendingStatus, statusReason);
    setReasonDialogOpen(false);
    setPendingStatus("");
    setStatusReason("");
    setReasonError("");
  };

  const cancelReasonDialog = () => {
    setReasonDialogOpen(false);
    setPendingStatus("");
    setStatusReason("");
    setReasonError("");
  };

  const handlePermanentDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/v1/admin/job-posts/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      navigate("/admin?tab=jobs");
    } catch (error) {
      console.error("Error deleting job post:", error);
    }
  };

  const statusColors: Record<string, string> = {
    Draft: "bg-gray-50 text-gray-600 border-gray-200",
    Active: "bg-green-50 text-green-700 border-green-200",
    "In-review": "bg-yellow-50 text-yellow-700 border-yellow-200",
    Pending: "bg-blue-50 text-blue-700 border-blue-200",
    Paused: "bg-gray-100 text-gray-700 border-gray-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    Expired: "bg-orange-50 text-orange-700 border-orange-200",
    Deleted: "bg-red-100 text-red-800 border-red-300",
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

  if (!job) {
    return <div className="p-6"><p className="text-gray-500">Job post not found.</p></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate("/admin?tab=jobs")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Job Posts
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" /> {job.company_name ?? "Anonymous"}
              </span>
              {job.location && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
              )}
              {job.job_type && (
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.job_type}</span>
              )}
              {job.deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={job.status}
              onChange={(e) => onSelectChange(e.target.value)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer ${statusColors[job.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}
            >
              {JOB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {job.status === "Deleted" && (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Permanently
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Reason Display */}
      {(job.status === "Pending" || job.status === "Rejected") && job.status_reason && (
        <div className={`rounded-xl border p-4 text-sm ${job.status === "Pending" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          <span className="font-semibold">Reason: </span>{job.status_reason}
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {job.description && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{job.description}</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
          <div className="space-y-3 text-sm">
            <InfoRow label="Job Mode" value={job.job_mode} />
            <InfoRow label="Industry" value={job.industry} />
            <InfoRow label="Experience Level" value={job.experience_level} />
            <InfoRow label="Education Level" value={job.education_level} />
            <InfoRow label="Positions" value={job.number_of_positions ? String(job.number_of_positions) : undefined} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Salary & Meta</h2>
          <div className="space-y-3 text-sm">
            <InfoRow label="Min Salary" value={job.min_salary ? `${job.min_salary} DZD` : undefined} />
            <InfoRow label="Max Salary" value={job.max_salary ? `${job.max_salary} DZD` : undefined} />
            <InfoRow label="Applicants" value={job.applicants ? String(job.applicants) : "0"} />
            <InfoRow label="Created" value={new Date(job.created_at).toLocaleDateString()} />
            <InfoRow label="Deadline" value={job.deadline ? new Date(job.deadline).toLocaleDateString() : undefined} />
          </div>
        </div>
      </div>

      {/* Reason Dialog for Pending / Rejected */}
      <AlertDialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatus === "Pending" ? "Set Job Post to Pending" : "Reject Job Post"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason that will be visible to the employer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={statusReason}
            onChange={(e) => { setStatusReason(e.target.value); setReasonError(""); }}
            placeholder="Enter reason..."
            className={`min-h-[100px] text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${reasonError ? "border-red-400" : "border-gray-300"}`}
          />
          {reasonError && <p className="text-xs text-red-500 mt-1">{reasonError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelReasonDialog} className="bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmReasonDialog} className="bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirm Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete Job Post</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The job post and all its data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePermanentDelete} className="bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Edit2, Eye, Pause, Play, Trash2, Upload, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

function DashJobItem({
  job,
  onStatusChange,
}: {
  job: any;
  onStatusChange: () => void;
}) {
  const [loadingState, setLoadingState] = useState(false);
  const { t } = useTranslation("employer");

  const handleChangeStatus = async (jobId: string, newStatus: string) => {
    if (newStatus === "Deleted") {
      const confirmed = window.confirm(t("confirmDeleteJob"));
      if (!confirmed) return;
    }

    setLoadingState(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/job-posts/${jobId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (res.ok) {
        onStatusChange();
      } else {
        const data = await res.json();
        console.error("Error changing status:", data.message);
      }
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      setLoadingState(false);
    }
  };

  const statusBadgeClass = () => {
    switch (job.status) {
      case "In-review":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Paused":
        return "bg-purple-100 text-purple-800";
      case "Expired":
        return "bg-amber-100 text-amber-800";
      case "Deleted":
        return "bg-gray-200 text-gray-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* job title and location */}
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900">{job.title}</div>
          <div className="text-sm text-gray-500">{job.location}</div>
        </td>

        {/* job status */}
        <td className="px-3 py-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass()}`}
          >
            {job.status}
          </span>
        </td>

        {/* created at */}
        <td className="px-3 py-2 text-sm">
          {new Date(job.created_at).toLocaleDateString("en-GB")}
        </td>

        {/* applicants */}
        <td className="px-3 py-2">
          <span className="text-lg font-semibold text-gray-900">
            {job.applicants}
          </span>
          <span className="ltr:ml-1 rtl:mr-1 text-sm text-gray-500">
            {t("applicants")}
          </span>
        </td>

        {/* views */}
        <td className="px-3 py-2">
          <span className="text-sm text-gray-600">
            {job.views} {t("views")}
          </span>
        </td>

        {/* actions */}
        <td className="px-3 py-2">
          <div className="flex justify-center items-center gap-1">
            {loadingState && <Spinner className="w-5 h-5 text-gray-400" />}

            {/* Draft → Submit for review */}
            {!loadingState && job.status === "Draft" && (
              <Button
                onClick={() => handleChangeStatus(job.id, "In-review")}
                className="cursor-pointer p-2 text-gray-600 hover:text-[#008CBA] hover:bg-blue-50 rounded-lg transition-colors"
                title="Submit for review"
              >
                <Upload className="w-4 h-4" />
              </Button>
            )}

            {/* Active → Pause */}
            {!loadingState && job.status === "Active" && (
              <Button
                onClick={() => handleChangeStatus(job.id, "Paused")}
                className="cursor-pointer p-2 text-gray-600 hover:text-[#008CBA] hover:bg-blue-50 rounded-lg transition-colors"
                title="Pause"
              >
                <Pause className="w-4 h-4" />
              </Button>
            )}

            {/* Paused → Resume (back to In-review) */}
            {!loadingState && job.status === "Paused" && (
              <Button
                onClick={() => handleChangeStatus(job.id, "In-review")}
                className="cursor-pointer p-2 text-gray-600 hover:text-[#008CBA] hover:bg-blue-50 rounded-lg transition-colors"
                title="Resume"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}

            {/* VIEW BUTTON */}
            <Button
              className="cursor-pointer p-2 text-gray-600 hover:text-[#008CBA] hover:bg-blue-50 rounded-lg transition-colors"
              title="View"
            >
              <Link target="_blank" to={`/jobPost/${job.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>

            {/* EDIT BUTTON */}
            <Button
              className="cursor-pointer p-2 text-gray-600 hover:text-[#008CBA] hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Link to={`/dashboard?tab=editJobPost&jobPost=${job.id}`}>
                <Edit2 className="w-4 h-4" />
              </Link>
            </Button>

            {/* APPLICANTS BUTTON */}
            <Button
              className="cursor-pointer p-2 text-gray-600 hover:text-[#008CBA] hover:bg-blue-50 rounded-lg transition-colors"
              title="Applicants"
            >
              <Link to={`/dashboard?tab=applicants&jobPost=${job.id}`}>
                <Users className="w-4 h-4" />
              </Link>
            </Button>

            {/* DELETE BUTTON (soft delete) */}
            {!loadingState && job.status !== "Deleted" && (
              <Button
                onClick={() => handleChangeStatus(job.id, "Deleted")}
                className="cursor-pointer p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

export default DashJobItem;

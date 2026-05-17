import { Building2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  shortlisted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-green-100 text-green-800",
};

const formatStatus = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

function ApplicationItem({
  application,
  onDelete,
}: {
  application: any;
  onDelete: (app: any) => void;
}) {
  const a = application;
  const statusClass = STATUS_BADGE[a.status] || "bg-gray-100 text-gray-800";
  const appliedAt = a.applied_at ? new Date(a.applied_at) : null;
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Applicant */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {a.profile_image ? (
            <img
              src={a.profile_image}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {a.first_name?.[0]}
              {a.last_name?.[0]}
            </div>
          )}
          <div
            onClick={() => navigate(`/job-seekers/${a.jobseeker_id}`)}
            className="min-w-0 flex-1"
          >
            <div
              className="font-medium text-gray-900 truncate hover:text-primary-500! cursor-pointer"
              title={
                `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim() || undefined
              }
            >
              {a.first_name} {a.last_name}
            </div>
            <div
              className="text-sm text-gray-500 truncate hover:text-primary-500! cursor-pointer"
              title={a.professional_title || undefined}
            >
              {a.professional_title || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* Job */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {a.logo ? (
            <img
              src={a.logo}
              alt=""
              className="w-10 h-10 rounded-lg object-cover border border-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              <Building2 className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div
              onClick={() => navigate(`/job-posts/${a.job_post_id}`)}
              className="font-medium text-gray-900 truncate cursor-pointer hover:text-primary-500"
              title={a.job_title || undefined}
            >
              {a.job_title || "—"}
            </div>
            <div
              onClick={() => navigate(`/employers/${a.employer_id}`)}
              className="text-sm text-gray-500 truncate cursor-pointer hover:text-primary-500"
              title={a.company_name || undefined}
            >
              {a.company_name || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* Applied */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {appliedAt ? (
          <div className="truncate" title={appliedAt.toLocaleString()}>
            {appliedAt.toLocaleDateString()}
          </div>
        ) : (
          "—"
        )}
      </td>

      {/* Status */}
      <td className="px-3 py-2 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
        >
          {formatStatus(a.status)}
        </span>
      </td>

      {/* Action */}
      <td className="px-3 py-2 text-center">
        <div className="flex justify-center items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onDelete(a)}
            className="cursor-pointer p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default ApplicationItem;

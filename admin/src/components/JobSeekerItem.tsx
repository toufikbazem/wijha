import { Link, useNavigate } from "react-router";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  unverified: "bg-yellow-100 text-yellow-800",
  suspended: "bg-orange-100 text-orange-800",
  deactivated: "bg-red-100 text-red-800",
};

const formatStatus = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

function JobSeekerItem({ jobSeeker }: { jobSeeker: any }) {
  const js = jobSeeker;
  const statusClass = STATUS_BADGE[js.status] || "bg-gray-100 text-gray-800";
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* user (avatar + name + professional title) */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {js.profile_image ? (
            <img
              src={js.profile_image}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {js.first_name?.[0]}
              {js.last_name?.[0]}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div
              onClick={() => navigate(`/job-seekers/${js.jobseeker_id}`)}
              className="font-medium text-gray-900 truncate cursor-pointer hover:text-primary-500"
              title={
                `${js.first_name ?? ""} ${js.last_name ?? ""}`.trim() ||
                undefined
              }
            >
              {js.first_name} {js.last_name}
            </div>
            <div
              className="text-sm text-gray-500 truncate"
              title={js.professional_title || undefined}
            >
              {js.professional_title || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* email */}
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="truncate" title={js.email || undefined}>
          {js.email || "—"}
        </div>
      </td>

      {/* address */}
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="truncate" title={js.address || undefined}>
          {js.address || "—"}
        </div>
      </td>

      {/* status */}
      <td className="px-3 py-2 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
        >
          {formatStatus(js.status)}
        </span>
      </td>

      {/* email verified */}
      <td className="px-3 py-2 text-center">
        {js.is_admin_created ? (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            N/A
          </span>
        ) : js.is_email_verified ? (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Not verified
          </span>
        )}
      </td>

      {/* registered type */}
      <td className="px-3 py-2 text-center">
        {js.is_admin_created ? (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Added by Admin
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Registered
          </span>
        )}
      </td>

      {/* action */}
      <td className="px-3 py-2 text-center">
        <div className="flex justify-center items-center gap-1">
          <Button
            asChild
            variant="ghost"
            className="cursor-pointer p-2 text-gray-600 hover:text-[#008CBA] hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <Link to={`/job-seekers/${js.jobseeker_id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default JobSeekerItem;

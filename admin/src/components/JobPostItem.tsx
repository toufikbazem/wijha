import { Link, useNavigate } from "react-router";
import { Building2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

const STATUS_BADGE: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Draft: "bg-gray-100 text-gray-800",
  "In-review": "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Paused: "bg-orange-100 text-orange-800",
  Rejected: "bg-red-100 text-red-800",
  Expired: "bg-gray-200 text-gray-700",
};

function JobPostItem({ jobPost }: { jobPost: any }) {
  const jp = jobPost;
  const statusClass = STATUS_BADGE[jp.status] || "bg-gray-100 text-gray-800";
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* title (logo + job title + company name) */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {jp.is_anonymous ? (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          ) : jp.logo ? (
            <img
              src={jp.logo}
              alt=""
              className="w-10 h-10 rounded-lg object-cover bg-white border border-gray-100 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
              {jp.company_name?.charAt(0) || "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div
              className="font-medium text-gray-900 truncate cursor-pointer hover:text-primary-500"
              title={jp.title || undefined}
              onClick={() => navigate(`/job-posts/${jp.id}`)}
            >
              {jp.title}
            </div>
            <div
              className="text-sm text-gray-500 truncate cursor-pointer hover:text-primary-500"
              title={
                jp.is_anonymous ? "Anonymous" : jp.company_name || undefined
              }
              onClick={() => navigate(`/employers/${jp.employer_user_id}`)}
            >
              {jp.is_anonymous ? (
                <span className="italic">Anonymous</span>
              ) : (
                jp.company_name || "—"
              )}
            </div>
          </div>
        </div>
      </td>

      {/* status */}
      <td className="px-3 py-2 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
        >
          {jp.status || "—"}
        </span>
      </td>

      {/* applicants */}
      <td className="px-3 py-2 text-center text-sm text-gray-700">
        {jp.applicants ?? 0}
      </td>

      {/* posted */}
      <td className="px-3 py-2 text-center text-sm text-gray-500">
        {jp.created_at ? new Date(jp.created_at).toLocaleDateString() : "—"}
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
            <Link to={`/job-posts/${jp.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default JobPostItem;

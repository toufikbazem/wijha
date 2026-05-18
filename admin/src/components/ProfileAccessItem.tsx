import { Building2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";

function ProfileAccessItem({
  record,
  onDelete,
}: {
  record: any;
  onDelete: (record: any) => void;
}) {
  const r = record;
  const accessedAt = r.created_at ? new Date(r.created_at) : null;
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Employer */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {r.logo ? (
            <img
              src={r.logo}
              alt=""
              className="w-10 h-10 rounded-lg object-cover border border-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              <Building2 className="w-5 h-5" />
            </div>
          )}
          <div
            onClick={() => navigate(`/employers/${r.employer_id}`)}
            className="min-w-0 flex-1 cursor-pointer"
          >
            <div
              className="font-medium text-gray-900 truncate hover:text-primary-500!"
              title={r.company_name || undefined}
            >
              {r.company_name || "—"}
            </div>
            <div
              className="text-sm text-gray-500 truncate"
              title={r.employer_email || undefined}
            >
              {r.employer_email || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* Profile */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {r.profile_image ? (
            <img
              src={r.profile_image}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {r.first_name?.[0]}
              {r.last_name?.[0]}
            </div>
          )}
          <div
            onClick={() => navigate(`/job-seekers/${r.jobseeker_id}`)}
            className="min-w-0 flex-1 cursor-pointer"
          >
            <div
              className="font-medium text-gray-900 truncate hover:text-primary-500!"
              title={
                `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || undefined
              }
            >
              {r.first_name} {r.last_name}
            </div>
            <div
              className="text-sm text-gray-500 truncate"
              title={r.professional_title || undefined}
            >
              {r.professional_title || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {accessedAt ? (
          <div className="truncate" title={accessedAt.toLocaleString()}>
            {accessedAt.toLocaleDateString()}
          </div>
        ) : (
          "—"
        )}
      </td>

      {/* Action */}
      <td className="px-3 py-2 text-center">
        <div className="flex justify-center items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onDelete(r)}
            className="cursor-pointer p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete record"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default ProfileAccessItem;

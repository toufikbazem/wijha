import { Link, useNavigate } from "react-router";
import { Building2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  unverified: "bg-yellow-100 text-yellow-800",
  suspended: "bg-orange-100 text-orange-800",
  deactivated: "bg-red-100 text-red-800",
};

const formatStatus = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

function EmployerItem({ employer }: { employer: any }) {
  const e = employer;
  const statusClass = STATUS_BADGE[e.status] || "bg-gray-100 text-gray-800";
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* user (logo + company name + email) */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {e.logo ? (
            <img
              src={e.logo}
              alt=""
              className="w-10 h-10 rounded-full object-cover bg-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <Building2 className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div
              className="font-medium text-gray-900 truncate cursor-pointer hover:text-primary-500"
              title={e.company_name || undefined}
              onClick={() => navigate(`/employers/${e.id}`)}
            >
              {e.company_name || "—"}
            </div>
            <div
              className="text-sm text-gray-500 truncate"
              title={e.email || undefined}
            >
              {e.email || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* address */}
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="truncate" title={e.address || undefined}>
          {e.address || "—"}
        </div>
      </td>

      {/* industry */}
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="truncate" title={e.industry || undefined}>
          {e.industry || "—"}
        </div>
      </td>

      {/* status */}
      <td className="px-3 py-2 text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
        >
          {formatStatus(e.status)}
        </span>
      </td>

      {/* email verified */}
      <td className="px-3 py-2 text-center">
        {e.is_email_verified ? (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Not verified
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
            <Link to={`/employers/${e.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default EmployerItem;

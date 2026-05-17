import { Building2, Calendar, Info, MapPin, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";

export const JOB_POST_STATUSES = [
  "Draft",
  "Pending",
  "In-review",
  "Active",
  "Paused",
  "Rejected",
  "Expired",
  "Deleted",
] as const;

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700 ring-slate-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  "In-review": "bg-blue-50 text-blue-700 ring-blue-200",
  Active: "bg-green-50 text-green-700 ring-green-200",
  Paused: "bg-orange-50 text-orange-700 ring-orange-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
  Expired: "bg-gray-100 text-gray-700 ring-gray-200",
  Deleted: "bg-gray-200 text-gray-700 ring-gray-300",
};

export default function JobPostDetailsHeader({
  post,
  statusChanging,
  onChangeStatus,
  onDelete,
}: {
  post: any;
  statusChanging: boolean;
  onChangeStatus: (status: string) => void;
  onDelete: () => void;
}) {
  const navigate = useNavigate();
  const statusClass =
    STATUS_STYLES[post.status as string] ??
    "bg-gray-100 text-gray-700 ring-gray-200";

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div className="h-2 bg-linear-to-r from-[#008CBA] via-[#00A8D8] to-[#00C4F0]" />

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            {post.is_anonymous ? (
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
            ) : post.logo ? (
              <img
                src={post.logo}
                alt={post.company_name ?? ""}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 ring-1 ring-gray-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#E6F7FB] flex items-center justify-center text-[#008CBA] shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {post.title ?? "Untitled"}
                </h1>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ring-1 ring-inset ${statusClass}`}
                >
                  {post.status ?? "—"}
                </span>
                {(post.status === "Pending" || post.status === "Rejected") &&
                  post.status_reason && (
                    <span
                      title={post.status_reason}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 cursor-help"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Reason provided
                    </span>
                  )}
              </div>
              <p
                onClick={() => navigate(`/employers/${post.employer_user_id}`)}
                className="text-gray-600 font-medium cursor-pointer hover:text-primary-500"
              >
                {post.is_anonymous
                  ? "Anonymous Company"
                  : (post.company_name ?? "—")}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-gray-600">
                {post.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#008CBA]" />
                    {post.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#008CBA]" />
                  {post.applicants ?? 0} applicants
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#008CBA]" />
                  Posted {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Select
              value={post.status}
              onValueChange={onChangeStatus}
              disabled={statusChanging}
            >
              <SelectTrigger className="min-w-36 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {JOB_POST_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="cursor-pointer"
            >
              <Trash2 className="size-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

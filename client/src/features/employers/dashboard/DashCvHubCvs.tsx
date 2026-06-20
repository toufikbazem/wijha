import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  FolderOpen,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
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
import DashJobPostsPagination from "../components/DashJobPostsPagination";
import { deleteSubmission } from "../cvHub/cvHubApi";
import type { CvHub, CvHubSubmission, SubmissionFilter } from "../cvHub/types";

/**
 * DashCvHubCvs — submissions (collected CVs) for a single hub.
 *
 * Reached from a hub card via ?tab=cvHubCvs&id=<hubId>. Shows the hub header
 * with counts and the submissions as a table (the project's table idiom).
 */

const LIMIT = 10;

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600 border-emerald-100",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
  draft: "bg-amber-50 text-amber-600 border-amber-100",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function DashCvHubCvs() {
  const navigate = useNavigate();
  const location = useLocation();
  const hubId = new URLSearchParams(location.search).get("id") || "";
  const [submissions, setSubmissions] = useState<CvHubSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SubmissionFilter>("all");

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const fetchSubmissions = async () => {
    if (!hubId) return;
    setLoading(true);
    try {
      const q = new URLSearchParams({
        search,
        filter,
        page: String(page),
        limit: String(LIMIT),
      });
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/cv-hub/${hubId}/submissions?${q}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load CVs");
        setSubmissions([]);
        setTotal(0);
      } else {
        setSubmissions(data.submissions);
        setTotal(data.total);
      }
    } catch (err: any) {
      toast.error("Failed to load CVs");
      setSubmissions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubId, page, filter]);

  // Debounce search, skipping the initial render so it doesn't double-fetch
  // alongside the hubId/page/filter effect above.
  const searchMounted = useRef(false);
  useEffect(() => {
    if (!searchMounted.current) {
      searchMounted.current = true;
      return;
    }
    const handle = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchSubmissions();
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filterTabs: { key: SubmissionFilter; label: string }[] = [
    { key: "all", label: "All CVs" },
    { key: "new", label: "New" },
    { key: "starred", label: "Starred" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate("/dashboard?tab=cvHub")}
          className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#008CBA] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          Back to CV Hubs
        </button>

        {/* Toolbar: search + filter tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by name or title..."
              className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008CBA] focus:border-transparent"
            />
          </div>

          {/* <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setFilter(tab.key);
                  setPage(1);
                }}
                className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? "bg-[#008CBA] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div> */}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl bg-gray-200" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && submissions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No CVs found
            </h3>
            <p className="text-gray-500">
              Try a different search, or share the hub to start collecting CVs.
            </p>
          </div>
        )}

        {/* Submissions table */}
        {!loading && submissions.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">{total} CVs collected</p>
            <SubmissionsTable
              submissions={submissions}
              onDeleted={fetchSubmissions}
            />
            {totalPages > 1 && (
              <DashJobPostsPagination
                totalPages={totalPages}
                page={page}
                setPage={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Submissions table                                                           */
/* -------------------------------------------------------------------------- */

function SubmissionsTable({
  submissions,
  onDeleted,
}: {
  submissions: CvHubSubmission[];
  onDeleted: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <Th>Candidate</Th>
              <Th>Contact</Th>
              <Th>Location</Th>
              <Th>Skills</Th>
              <Th>Submitted</Th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ltr:text-right rtl:text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((cv) => (
              <SubmissionRow key={cv.id} cv={cv} onDeleted={onDeleted} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubmissionRow({
  cv,
  onDeleted,
}: {
  cv: CvHubSubmission;
  onDeleted: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fullName = `${cv.first_name} ${cv.last_name}`;
  const initials = (cv.first_name[0] || "") + (cv.last_name[0] || "");

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteSubmission(cv.id);
      toast.success("CV removed");
      setConfirmDelete(false);
      onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete CV");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Candidate */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#008CBA]/15 to-[#008CBA]/5 text-sm font-semibold text-[#008CBA] ring-2 ring-white">
            {initials.toUpperCase() || <User className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fullName}
              </p>
              {cv.is_new && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                  New
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{cv.title || "—"}</p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-700 truncate max-w-50">{cv.email}</p>
        <p className="text-xs text-gray-400">{cv.phone_number || "—"}</p>
      </td>

      {/* Location */}
      <td className="px-6 py-4 text-sm text-gray-600">{cv.address || "—"}</td>

      {/* Skills */}
      <td className="px-6 py-4">
        {cv.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-55">
            {cv.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="rounded-md bg-[#008CBA]/8 px-2 py-0.5 text-[11px] font-medium text-[#008CBA] ring-1 ring-inset ring-[#008CBA]/15"
              >
                {skill}
              </span>
            ))}
            {cv.skills.length > 3 && (
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                +{cv.skills.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Submitted */}
      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
        {formatDate(cv.created_at)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <a
            href={cv.cv_url}
            target="_blank"
            rel="noopener noreferrer"
            title="View / download CV"
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-[#008CBA] px-3 text-sm font-medium text-white transition-colors hover:bg-[#007399]"
          >
            <Download className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />
            CV
          </a>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            title="Delete submission"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this CV?</AlertDialogTitle>
              <AlertDialogDescription>
                {fullName}'s submission will be permanently removed from this
                hub. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
              >
                {deleting ? <Spinner className="h-4 w-4" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="ltr:text-left rtl:text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

function HeaderStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-2 text-center ${
        highlight
          ? "bg-emerald-50 border-emerald-100"
          : "bg-gray-50 border-gray-100"
      }`}
    >
      <p
        className={`text-xl font-bold leading-none ${
          highlight ? "text-emerald-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] text-gray-400">{label}</p>
    </div>
  );
}

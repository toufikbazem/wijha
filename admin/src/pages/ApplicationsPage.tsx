import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { toast } from "sonner";

import ApplicationsFilterBar from "@/components/ApplicationsFilterBar";
import ApplicationItem from "@/components/ApplicationItem";
import AdminPagination from "@/components/AdminPagination";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  DEFAULT_FILTERS,
  FILTER_KEYS,
  applicationsFilterSchema,
  filtersFromParams,
  type ApplicationsFilters,
} from "@/lib/applicationsFilters";

const limit = 10;

export default function ApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  // Initial filters come from the URL so state survives navigation back.
  const initialFilters = useMemo(
    () => filtersFromParams(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const form = useForm<ApplicationsFilters>({
    resolver: zodResolver(applicationsFilterSchema),
    defaultValues: initialFilters,
  });

  // The currently-active filters, sourced from the URL.
  const activeFilters = useMemo(
    () => filtersFromParams(searchParams),
    [searchParams],
  );

  const [applications, setApplications] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const writeFiltersToUrl = (
    values: ApplicationsFilters,
    { resetPage = true }: { resetPage?: boolean } = {},
  ) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const key of FILTER_KEYS) {
          const v = values[key];
          if (!v || (key === "sortBy" && v === "latest")) {
            next.delete(key);
          } else {
            next.set(key, String(v));
          }
        }
        if (resetPage) next.delete("page");
        return next;
      },
      { replace: true },
    );
  };

  const onApply = (values: ApplicationsFilters) => {
    writeFiltersToUrl(values);
  };

  const onReset = () => {
    form.reset(DEFAULT_FILTERS);
    writeFiltersToUrl(DEFAULT_FILTERS);
  };

  // Map form filter keys -> backend query params
  const buildQueryParams = (
    values: ApplicationsFilters,
    p: number,
  ): URLSearchParams => {
    const params = new URLSearchParams({
      page: String(p),
      limit: String(limit),
    });
    if (values.globalSearch) params.set("search", values.globalSearch);
    if (values.applied_in) params.set("applied_in", values.applied_in);
    if (values.sortBy) params.set("sortBy", values.sortBy);
    return params;
  };

  // Fetch when URL changes.
  const requestId = useRef(0);
  useEffect(() => {
    const id = ++requestId.current;
    const params = buildQueryParams(activeFilters, page);
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/admin/applications?${params}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (id !== requestId.current) return;
        setApplications(data.applications || []);
        setTotal(data.total ?? data.pagination?.total ?? 0);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        console.error("Error fetching applications:", err);
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setLoading(false);
      });
  }, [activeFilters, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const setPage = (p: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (p <= 1) next.delete("page");
        else next.set("page", String(p));
        return next;
      },
      { replace: true },
    );
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const appId = pendingDelete.application_id;
    setDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/applications/${appId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `HTTP ${res.status}`);
      }
      setApplications((prev) =>
        prev.filter((a) => a.application_id !== appId),
      );
      setTotal((t) => Math.max(0, t - 1));
      toast.success("Application deleted");
      setPendingDelete(null);
    } catch (err: any) {
      console.error("Error deleting application:", err);
      toast.error(err?.message ?? "Failed to delete application");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      {/* Filter bar */}
      <ApplicationsFilterBar
        form={form}
        onApply={onApply}
        onReset={onReset}
        loading={loading}
      />

      {/* Loading skeleton */}
      {loading && (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-gray-300" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-5 gap-4 items-center"
            >
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className="h-6 w-full rounded-md bg-gray-300"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && applications.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters</p>
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2.5 bg-[#008CBA] text-white rounded-xl hover:bg-[#006d91] transition font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && applications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-72 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="w-72 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-20 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((a) => (
                  <ApplicationItem
                    key={a.application_id}
                    application={a}
                    onDelete={setPendingDelete}
                  />
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <AdminPagination
                totalPages={totalPages}
                page={page}
                setPage={setPage}
              />
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && !deleting && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete application?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `This will permanently delete ${pendingDelete.first_name ?? ""} ${pendingDelete.last_name ?? ""}'s application to "${pendingDelete.job_title ?? "this job"}". This action cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

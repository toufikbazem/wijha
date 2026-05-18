import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { toast } from "sonner";

import ProfileAccessFilterBar from "@/components/ProfileAccessFilterBar";
import ProfileAccessItem from "@/components/ProfileAccessItem";
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
  profileAccessFilterSchema,
  filtersFromParams,
  type ProfileAccessFilters,
} from "@/lib/profileAccessFilters";

const limit = 10;

export default function ProfileAccessPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const initialFilters = useMemo(
    () => filtersFromParams(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const form = useForm<ProfileAccessFilters>({
    resolver: zodResolver(profileAccessFilterSchema),
    defaultValues: initialFilters,
  });

  const activeFilters = useMemo(
    () => filtersFromParams(searchParams),
    [searchParams],
  );

  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const writeFiltersToUrl = (
    values: ProfileAccessFilters,
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

  const onApply = (values: ProfileAccessFilters) => {
    writeFiltersToUrl(values);
  };

  const onReset = () => {
    form.reset(DEFAULT_FILTERS);
    writeFiltersToUrl(DEFAULT_FILTERS);
  };

  const buildQueryParams = (
    values: ProfileAccessFilters,
    p: number,
  ): URLSearchParams => {
    const params = new URLSearchParams({
      page: String(p),
      limit: String(limit),
    });
    if (values.globalSearch) params.set("search", values.globalSearch);
    if (values.accessed_in) params.set("accessed_in", values.accessed_in);
    if (values.sortBy) params.set("sortBy", values.sortBy);
    return params;
  };

  const requestId = useRef(0);
  useEffect(() => {
    const id = ++requestId.current;
    const params = buildQueryParams(activeFilters, page);
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/admin/profile-access?${params}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (id !== requestId.current) return;
        setRecords(data.records || []);
        setTotal(data.total ?? data.pagination?.total ?? 0);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        console.error("Error fetching profile access records:", err);
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
    const recordId = pendingDelete.id;
    setDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/profile-access/${recordId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `HTTP ${res.status}`);
      }
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
      setTotal((t) => Math.max(0, t - 1));
      toast.success("Record deleted");
      setPendingDelete(null);
    } catch (err: any) {
      console.error("Error deleting profile access record:", err);
      toast.error(err?.message ?? "Failed to delete record");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile Access</h1>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      {/* Filter bar */}
      <ProfileAccessFilterBar
        form={form}
        onApply={onApply}
        onReset={onReset}
        loading={loading}
      />

      {/* Loading skeleton */}
      {loading && (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-gray-300" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-4 gap-4 items-center"
            >
              {Array.from({ length: 4 }).map((_, colIndex) => (
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
      {!loading && records.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No records found
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
      {!loading && records.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-72 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employer
                  </th>
                  <th className="w-72 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="w-20 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((r) => (
                  <ProfileAccessItem
                    key={r.id}
                    record={r}
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
            <AlertDialogTitle>Delete profile access record?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `This will permanently delete the record granting "${pendingDelete.company_name ?? "this employer"}" access to ${pendingDelete.first_name ?? ""} ${pendingDelete.last_name ?? ""}'s profile. This action cannot be undone.`
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

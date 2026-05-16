import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";

import JobSeekersFilterBar from "@/components/JobSeekersFilterBar";
import JobSeekerItem from "@/components/JobSeekerItem";
import AdminPagination from "@/components/AdminPagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEFAULT_FILTERS,
  FILTER_KEYS,
  filtersFromParams,
  jobSeekersFilterSchema,
  type JobSeekersFilters,
} from "@/lib/jobSeekersFilters";

const limit = 10;

export default function JobSeekersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  // Initial filters come from the URL so state survives navigation back from details.
  const initialFilters = useMemo(
    () => filtersFromParams(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const form = useForm<JobSeekersFilters>({
    resolver: zodResolver(jobSeekersFilterSchema),
    defaultValues: initialFilters,
  });

  // The currently-active filters, sourced from the URL (form state is the "draft").
  const activeFilters = useMemo(
    () => filtersFromParams(searchParams),
    [searchParams],
  );

  const [jobSeekers, setJobSeekers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const writeFiltersToUrl = (
    values: JobSeekersFilters,
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

  const onApply = (values: JobSeekersFilters) => {
    writeFiltersToUrl(values);
  };

  const onReset = () => {
    form.reset(DEFAULT_FILTERS);
    writeFiltersToUrl(DEFAULT_FILTERS);
  };

  const onExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      for (const key of FILTER_KEYS) {
        const v = activeFilters[key];
        if (v) params.set(key, String(v));
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/job-seekers/export?${params}`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job-seekers-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting job seekers:", err);
      toast.error("Failed to export job seekers");
    } finally {
      setExporting(false);
    }
  };

  // Fetch when URL changes.
  const requestId = useRef(0);
  useEffect(() => {
    const id = ++requestId.current;
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    for (const key of FILTER_KEYS) {
      const v = activeFilters[key];
      if (v) params.set(key, String(v));
    }
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/admin/job-seekers?${params}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (id !== requestId.current) return;
        setJobSeekers(data.jobSeekers || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        console.error("Error fetching job seekers:", err);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Job Seekers</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{total} total</span>
          <button
            type="button"
            onClick={onExport}
            disabled={exporting || loading || total === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#008CBA] text-white rounded-lg hover:bg-[#006d91] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Exporting…" : "Export to Excel"}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <JobSeekersFilterBar
        form={form}
        onApply={onApply}
        onReset={onReset}
        loading={loading}
      />

      {/* Loading skeleton (grid-based, mirrors DashJobPostsList) */}
      {loading && (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-gray-300" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-7 gap-4 items-center"
            >
              {Array.from({ length: 7 }).map((_, colIndex) => (
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
      {!loading && jobSeekers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No job seekers found
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
      {!loading && jobSeekers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-72 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="w-56 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="w-48 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-36 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email Verified
                  </th>
                  <th className="w-40 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Registered Type
                  </th>
                  <th className="w-20 px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobSeekers.map((js) => (
                  <JobSeekerItem key={js.jobseeker_id} jobSeeker={js} />
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
    </div>
  );
}

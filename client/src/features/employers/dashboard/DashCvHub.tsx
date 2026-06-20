import { useEffect, useRef, useState } from "react";
import { FolderOpen, Search } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import DashJobPostsPagination from "../components/DashJobPostsPagination";
import { LIMIT, statuses } from "../cvHub/constants";
import HubFormDialog from "../cvHub/HubFormDialog";
import HubCard from "../cvHub/HubCard";
import type { CvHub, HubStatus } from "../cvHub/types";

/**
 * DashCvHub — CV Hub section (employer dashboard).
 *
 * Lists the employer's hubs (talent pools). Each hub exposes a shareable public
 * form — distributed via link or QR code — so candidates can submit their CVs.
 * Collected CVs are browsed on the submissions page (DashCvHubCvs).
 *
 * The hub card, create/edit dialog, share dialog, and small presentational
 * helpers live in ../cvHub.
 */
export default function DashCvHub() {
  const [hubs, setHubs] = useState<CvHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | HubStatus>("all");

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const fetchHubs = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        search,
        status: statusFilter,
        page: String(page),
        limit: String(LIMIT),
      });
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/cv-hub?${q}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load CV hubs");
      } else {
        setHubs(data.hubs);
        setTotal(data.total);
      }
    } catch (error: any) {
      toast.error("Failed to load CV hubs");
      setHubs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever the page or status filter changes. Search is debounced
  // separately so typing doesn't fire a request per keystroke.
  useEffect(() => {
    fetchHubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  // Skip the initial render so search doesn't double-fetch alongside the
  // page/status effect above.
  const searchMounted = useRef(false);
  useEffect(() => {
    if (!searchMounted.current) {
      searchMounted.current = true;
      return;
    }
    const handle = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchHubs();
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CV Hub</h1>
            <p className="mt-1 text-gray-600">
              Create talent pools and collect CVs through shareable forms.
            </p>
          </div>
          <HubFormDialog mode="create" onSaved={fetchHubs} />
        </div>

        {/* Toolbar: search + status filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search hubs..."
              className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008CBA] focus:border-transparent"
            />
          </div>

          <div className="w-full sm:w-fit flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 ">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`flex-1 cursor-pointer px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-[#008CBA] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/80 bg-white p-5 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3 bg-gray-200" />
                    <Skeleton className="h-3 w-1/3 bg-gray-200" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full bg-gray-200" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-14 rounded-xl bg-gray-200" />
                  <Skeleton className="h-14 rounded-xl bg-gray-200" />
                  <Skeleton className="h-14 rounded-xl bg-gray-200" />
                </div>
                <Skeleton className="h-9 w-full bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && hubs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No CV hubs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or create a new hub to start collecting
              CVs.
            </p>
          </div>
        )}

        {/* Hubs grid */}
        {!loading && hubs.length > 0 && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2  gap-5">
              {hubs.map((hub) => (
                <HubCard key={hub.id} hub={hub} onChanged={fetchHubs} />
              ))}
            </div>
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

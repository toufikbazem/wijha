import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ApplicationsPage() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  function load(p = page) {
    setLoading(true);
    adminApi.getApplications({ page: p, limit: 20, search, status }).then(setData).finally(() => setLoading(false));
  }

  useEffect(() => { const t = setTimeout(() => { setPage(1); load(1); }, 300); return () => clearTimeout(t); }, [search, status]);
  useEffect(() => { load(); }, [page]);

  const rows = data?.applications ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input className="pl-8" placeholder="Search by name or job…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          className="rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none"
          value={status} onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Applicant</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Job Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></td>)}</tr>
                ))
              : rows.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.seeker_name ?? r.first_name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.job_title}</td>
                    <td className="px-4 py-3 text-gray-500">{r.company_name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="size-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

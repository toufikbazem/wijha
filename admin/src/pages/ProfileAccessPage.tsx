import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProfileAccessPage() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  function load(p = page) {
    setLoading(true);
    adminApi.getProfileAccess({ page: p, limit: 20, search }).then(setData).finally(() => setLoading(false));
  }

  useEffect(() => { const t = setTimeout(() => { setPage(1); load(1); }, 300); return () => clearTimeout(t); }, [search]);
  useEffect(() => { load(); }, [page]);

  const rows = data?.profileAccess ?? data?.records ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile Access</h1>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input className="pl-8" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Employer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Job Seeker</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{[1,2,3].map(j => <td key={j} className="px-4 py-3"><div className="h-4 w-28 animate-pulse rounded bg-gray-100" /></td>)}</tr>
                ))
              : rows.length === 0
              ? <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No records</td></tr>
              : rows.map((r: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.company_name ?? r.employer_id}</td>
                    <td className="px-4 py-3 text-gray-600">{r.seeker_name ?? r.job_seeker_id}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(r.accessed_at ?? r.created_at).toLocaleDateString()}</td>
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

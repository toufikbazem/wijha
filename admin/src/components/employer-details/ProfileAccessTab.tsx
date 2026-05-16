import { useEffect, useState } from "react";
import { Eye, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export default function ProfileAccessTab({
  employerId,
}: {
  employerId: string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${BASE}/admin/employers/${employerId}/profile-access`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [employerId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  const records: any[] = data?.profileAccess ?? [];

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-[#008CBA]" />
        </div>
        <p className="text-gray-800 font-semibold mb-1">
          No profile access records
        </p>
        <p className="text-sm text-gray-500">
          This employer has not unlocked any job seeker profiles yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Job Seeker
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((a, i) => (
            <tr
              key={a.id ?? i}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-gray-900">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="font-medium">
                    {a.seeker_name ?? a.job_seeker_id ?? "—"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {a.accessed_at || a.created_at
                  ? new Date(
                      a.accessed_at ?? a.created_at,
                    ).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

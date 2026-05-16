import { useEffect, useState } from "react";
import { CreditCard, Calendar, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export default function SubscriptionTab({ employerId }: { employerId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${BASE}/admin/employers/${employerId}/subscription`, {
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
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl bg-gray-200" />
        <Skeleton className="h-32 w-full rounded-2xl bg-gray-200" />
      </div>
    );
  }

  const subscriptions: any[] = data?.subscriptions ?? [];

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-[#008CBA]" />
        </div>
        <p className="text-gray-800 font-semibold mb-1">No subscriptions</p>
        <p className="text-sm text-gray-500">
          This employer has no subscription history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((s) => (
        <div
          key={s.id}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#E6F7FB] flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-[#008CBA]" />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">
                  {s.plan_name || "—"}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {s.start_day || "—"} → {s.end_day || "—"}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                s.status === "active"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {s.status || "—"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
                Job Posts
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {s.job_posts_used ?? 0} /{" "}
                {s.job_posts_limit ?? "∞"}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
                Profile Access
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {s.profile_access_used ?? 0} /{" "}
                {s.profile_access_limit ?? "∞"}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="text-xs text-gray-500 mb-1">Price</div>
              <div className="text-sm font-semibold text-gray-900">
                {s.price ?? "—"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

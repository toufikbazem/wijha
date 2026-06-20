import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileCompletionCardProps {
  percentage: number;
  /** i18n namespace that holds `profileCompletion` / `profileCompletionDesc`. */
  namespace?: string;
  loading?: boolean;
}

export default function ProfileCompletionCard({
  percentage,
  namespace = "jobseeker",
  loading = false,
}: ProfileCompletionCardProps) {
  const { t } = useTranslation(namespace);
  const value = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {t("profileCompletion")}
            </p>
            <p className="text-xs text-gray-500">
              {t("profileCompletionDesc")}
            </p>
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-7 w-14 bg-gray-200" />
        ) : (
          <span className="text-2xl font-bold text-emerald-600">{value}%</span>
        )}
      </div>
      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${loading ? 0 : value}%` }}
        />
      </div>
    </div>
  );
}

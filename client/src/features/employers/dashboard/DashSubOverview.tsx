import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubscription } from "../subscriptionSlice";
import { Calendar, Briefcase, Users, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function DashSubOverview() {
  const dispatch = useDispatch<any>();
  const { subscription, loading } = useSelector(
    (state: any) => state.subscription,
  );
  const { t } = useTranslation("employer");

  useEffect(() => {
    dispatch(fetchMySubscription());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-xl bg-gray-300" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32 rounded-xl bg-gray-300" />
          <Skeleton className="h-32 rounded-xl bg-gray-300" />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("noActiveSubscription")}
        </h3>
        <p className="text-gray-500 text-sm">
          {t("subscribeStart")}
        </p>
      </div>
    );
  }

  const statusColor =
    subscription.status === "active"
      ? "bg-green-100 text-green-700"
      : subscription.status === "expired"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700";

  const isUnlimited = subscription.plan_type === "unlimited";

  const jobPostPercent = isUnlimited
    ? 0
    : subscription.job_post_limit > 0
      ? Math.min(
          (subscription.job_post_used / subscription.job_post_limit) * 100,
          100,
        )
      : 0;

  const profileAccessPercent = isUnlimited
    ? 0
    : subscription.profile_access_limit > 0
      ? Math.min(
          (subscription.profile_access_used /
            subscription.profile_access_limit) *
            100,
          100,
        )
      : 0;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#008CBA] flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {subscription.plan_name}
              </h2>
              <span
                className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}
              >
                {subscription.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {subscription.price === 0
                ? t("free")
                : `${(subscription.price / 100).toFixed(2)} DA`}
            </p>
            <p className="text-sm text-gray-500">{t("perCycle")}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              {t("start")} <strong>{formatDate(subscription.start_day)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              {t("end")} <strong>{formatDate(subscription.end_day)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Posts Usage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t("jobPosts")}</h3>
              <p className="text-sm text-gray-500">
                {isUnlimited
                  ? `${subscription.job_post_used} ${t("used")} (${t("unlimited")})`
                  : `${subscription.job_post_used} / ${subscription.job_post_limit} ${t("used")}`}
              </p>
            </div>
          </div>
          {!isUnlimited && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  jobPostPercent >= 90 ? "bg-red-500" : "bg-[#008CBA]"
                }`}
                style={{ width: `${jobPostPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Profile Access Usage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t("profileAccessUsage")}</h3>
              <p className="text-sm text-gray-500">
                {isUnlimited
                  ? `${subscription.profile_access_used} ${t("used")} (${t("unlimited")})`
                  : `${subscription.profile_access_used} / ${subscription.profile_access_limit} ${t("used")}`}
              </p>
            </div>
          </div>
          {!isUnlimited && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  profileAccessPercent >= 90 ? "bg-red-500" : "bg-purple-500"
                }`}
                style={{ width: `${profileAccessPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

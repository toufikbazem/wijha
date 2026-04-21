import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlans,
  subscribeToPlan,
  fetchMySubscription,
} from "../subscriptionSlice";
import { Check, Infinity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function DashSubPlans() {
  const dispatch = useDispatch<any>();
  const { plans, subscription, loading } = useSelector(
    (state: any) => state.subscription,
  );
  const { t } = useTranslation("employer");

  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchMySubscription());
  }, [dispatch]);

  const handleSubscribe = async (planId: string) => {
    const result = await dispatch(subscribeToPlan(planId));
    if (subscribeToPlan.fulfilled.match(result)) {
      toast.success(t("subscriptionActivated"));
      dispatch(fetchMySubscription());
    } else {
      toast.error(result.payload || t("failedSubscribe"));
    }
  };

  if (loading && plans.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-80 rounded-xl bg-gray-300" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan: any) => {
        const isCurrentPlan = subscription?.plan_name === plan.name;
        const hasActiveSubscription = !!subscription;

        return (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border p-6 flex flex-col ${
              isCurrentPlan
                ? "border-[#008CBA] ring-2 ring-[#008CBA]/20"
                : "border-gray-200"
            }`}
          >
            {/* Plan Badge */}
            {isCurrentPlan && (
              <span className="self-start text-xs font-medium px-2.5 py-1 rounded-full bg-[#008CBA] text-white mb-3">
                {t("currentPlan")}
              </span>
            )}

            {/* Plan Name */}
            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-500 capitalize mb-4">{plan.type}</p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {plan.price === 0
                  ? t("free")
                  : `${(plan.price / 100).toFixed(0)} DA`}
              </span>
              {plan.price > 0 && (
                <span className="text-sm text-gray-500 ml-1">
                  / {plan.duration} days
                </span>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                {plan.job_post_limit === null ? (
                  <span className="flex items-center gap-1">
                    <Infinity className="w-4 h-4" /> {t("jobPosts")}
                  </span>
                ) : (
                  `${plan.post_job_limit} ${t("jobPosts")}`
                )}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                {plan.profile_access_limit === null ? (
                  <span className="flex items-center gap-1">
                    <Infinity className="w-4 h-4" /> {t("profileAccessUsage")}
                  </span>
                ) : (
                  `${plan.profile_access_limit} ${t("profileAccessUsage")}`
                )}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                {plan.duration} {t("daysDuration")}
              </li>
            </ul>

            {/* Action */}
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={isCurrentPlan || (hasActiveSubscription && !isCurrentPlan) || loading}
              className={`cursor-pointer w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isCurrentPlan
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : hasActiveSubscription
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#008CBA] text-white hover:bg-[#007399]"
              }`}
            >
              {isCurrentPlan
                ? t("currentPlan")
                : hasActiveSubscription
                  ? t("alreadySubscribed")
                  : t("subscribe")}
            </button>
          </div>
        );
      })}
    </div>
  );
}

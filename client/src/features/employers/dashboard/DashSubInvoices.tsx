import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../subscriptionSlice";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function DashSubInvoices() {
  const dispatch = useDispatch<any>();
  const { invoices, loading } = useSelector(
    (state: any) => state.subscription,
  );
  const { t } = useTranslation("employer");

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl bg-gray-300" />
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("noInvoicesYet")}
        </h3>
        <p className="text-gray-500 text-sm">
          {t("subscriptionHistory")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="ltr:text-left rtl:text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("plan")}
              </th>
              <th className="ltr:text-left rtl:text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("period")}
              </th>
              <th className="ltr:text-left rtl:text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("price")}
              </th>
              <th className="ltr:text-left rtl:text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("usage")}
              </th>
              <th className="ltr:text-left rtl:text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("status")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice: any) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.plan_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {invoice.plan_type}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(invoice.start_day)} -{" "}
                  {formatDate(invoice.end_day)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {invoice.price === 0
                    ? t("free")
                    : `${(invoice.price / 100).toFixed(2)} DA`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span>{invoice.job_post_used} {t("posts")}</span>
                  <span className="mx-1.5 text-gray-300">|</span>
                  <span>{invoice.profile_access_used} {t("access")}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(invoice.status)}`}
                  >
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

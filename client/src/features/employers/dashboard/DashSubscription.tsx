import { useState } from "react";
import { BarChart3, CreditCard, FileText } from "lucide-react";
import DashSubOverview from "./DashSubOverview";
import DashSubPlans from "./DashSubPlans";
import DashSubInvoices from "./DashSubInvoices";
import { useTranslation } from "react-i18next";

type SubTab = "overview" | "plans" | "invoices";

export default function DashSubscription() {
  const [activeTab, setActiveTab] = useState<SubTab>("overview");
  const { t } = useTranslation("employer");

  const tabs: { id: SubTab; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: t("overview"), icon: BarChart3 },
    { id: "plans", label: t("plans"), icon: CreditCard },
    { id: "invoices", label: t("invoices"), icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("subscription")}</h1>
          <p className="mt-1 text-gray-600">
            {t("manageSubscription")}
          </p>
        </div>

        {/* Interior Tabs */}
        <div className="mb-6 flex gap-1 bg-white p-1 rounded-lg border border-gray-200 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#008CBA] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && <DashSubOverview />}
        {activeTab === "plans" && <DashSubPlans />}
        {activeTab === "invoices" && <DashSubInvoices />}
      </div>
    </div>
  );
}

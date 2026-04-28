import { useState } from "react";
import { Search, Unlock } from "lucide-react";
import ProfileSearch from "../components/ProfileSearch";
import MyAccessList from "../components/MyAccessList";
import { useTranslation } from "react-i18next";

export default function DashProfileAccess() {
  const [activeTab, setActiveTab] = useState<"search" | "myAccess">("search");
  const [searchPage, setSearchPage] = useState(1);
  const [myAccessPage, setMyAccessPage] = useState(1);

  const { t } = useTranslation("employer");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("profileAccess")}</h1>
          <p className="mt-1 text-gray-600">
            {t("searchAccessProfiles")}
          </p>
        </div>

        {/* Interior Tabs */}
        <div className="mb-6 flex gap-1 bg-white p-1 rounded-lg border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab("search")}
            className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "search"
                ? "bg-[#008CBA] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Search className="w-4 h-4" />
            {t("searchProfiles")}
          </button>
          <button
            onClick={() => setActiveTab("myAccess")}
            className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "myAccess"
                ? "bg-[#008CBA] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Unlock className="w-4 h-4" />
            {t("myAccess")}
          </button>
        </div>

        {/* Tab Content */}
        <div className={activeTab === "search" ? "" : "hidden"}>
          <ProfileSearch page={searchPage} setPage={setSearchPage} />
        </div>
        <div className={activeTab === "myAccess" ? "" : "hidden"}>
          <MyAccessList page={myAccessPage} setPage={setMyAccessPage} />
        </div>
      </div>
    </div>
  );
}

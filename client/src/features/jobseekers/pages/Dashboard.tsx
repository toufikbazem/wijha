import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import SideBar from "../components/DashSideBar";
import Header from "../components/DashHeader";
import DashProfile from "../dashboard/DashProfile";
import DashSaved from "../dashboard/DashSaved";
import DashApplications from "../dashboard/DashApplications";
import DashSettings from "../dashboard/DashSettings";
import DashMain from "../dashboard/DashMain";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function Dashboard() {
  useDocumentTitle("meta.title.dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [tab, setTab] = useState("dash");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "dash");
  }, [location.search]);
  return (
    <div className="min-h-screen flex bg-gray-50 ">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <SideBar active={tab} sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {tab === "dash" && <DashMain />}
        {tab === "profile" && <DashProfile />}
        {tab === "applications" && <DashApplications />}
        {tab === "saved" && <DashSaved />}
        {tab === "settings" && <DashSettings />}
      </div>
    </div>
  );
}

export default Dashboard;

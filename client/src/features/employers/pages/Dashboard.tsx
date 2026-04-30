import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import SideBar from "../components/DashSideBar";
import Header from "../components/DashHeader";
import DashCompanyProfile from "../dashboard/DashCompanyProfile";
import DashCreateJobPost from "../dashboard/DashCreateJobPost";
import DashEditJob from "../dashboard/DashEditJob";
import DashJobPost from "../dashboard/DashJobPosts";
import DashApplicants from "../dashboard/DashApplicants";
import DashSettings from "../dashboard/DashSettings";
import DashProfileAccess from "../dashboard/DashProfileAccess";
import DashProfileView from "../dashboard/DashProfileView";
import DashMain from "../dashboard/DashMain";
import DashSubscription from "../dashboard/DashSubscription";
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

        {/* Content */}
        {tab === "dash" && <DashMain />}
        {tab === "company" && <DashCompanyProfile />}
        {tab === "createJobPost" && <DashCreateJobPost />}
        {tab === "editJobPost" && <DashEditJob />}
        {tab === "jobPosts" && <DashJobPost />}
        {tab === "applicants" && <DashApplicants />}
        {tab === "profileAccess" && <DashProfileAccess />}
        {tab === "profileView" && <DashProfileView />}
        {tab === "subscription" && <DashSubscription />}
        {tab === "settings" && <DashSettings />}
      </div>
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import SideBar from "../components/DashSideBar";
import Header from "../components/Header";
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
import DashCvHub from "../dashboard/DashCvHub";
import DashCvHubCvs from "../dashboard/DashCvHubCvs";
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
    <div className="min-h-screen flex flex-col bg-gray-50 mb-16 md:mb-0 ">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Header */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <SideBar active={tab} sidebarOpen={sidebarOpen} />
        <div className="flex-1">
          {/* Content */}
          {tab === "dash" && <DashMain />}
          {/* {tab === "company" && <DashCompanyProfile />} */}
          {tab === "createJobPost" && <DashCreateJobPost />}
          {tab === "editJobPost" && <DashEditJob />}
          {tab === "jobPosts" && <DashJobPost />}
          {tab === "applicants" && <DashApplicants />}
          {tab === "profileAccess" && <DashProfileAccess />}
          {tab === "profileView" && <DashProfileView />}
          {tab === "subscription" && <DashSubscription />}
          {tab === "cvHub" && <DashCvHub />}
          {tab === "cvHubCvs" && <DashCvHubCvs />}
          {tab === "settings" && <DashSettings />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

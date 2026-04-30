import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminDashboard from "./AdminDashboard";
import JobSeekersList from "./JobSeekersList";
import JobSeekerDetails from "./JobSeekerDetails";
import EmployersList from "./EmployersList";
import EmployerDetails from "./EmployerDetails";
import JobPostsList from "./JobPostsList";
import JobPostDetails from "./JobPostDetails";
import PlansList from "./PlansList";
import SubscriptionsList from "./SubscriptionsList";
import ProfileAccessList from "./ProfileAccessList";
import AdminSettings from "./AdminSettings";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Admin() {
  useDocumentTitle("meta.title.admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [tab, setTab] = useState("dashboard");
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTab(params.get("tab") || "dashboard");
    setDetailId(params.get("id") || null);
  }, [location.search]);

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <AdminDashboard />;
      case "job-seekers":
        return <JobSeekersList />;
      case "job-seeker-details":
        return detailId ? <JobSeekerDetails userId={detailId} /> : <JobSeekersList />;
      case "employers":
        return <EmployersList />;
      case "employer-details":
        return detailId ? <EmployerDetails userId={detailId} /> : <EmployersList />;
      case "jobs":
        return <JobPostsList />;
      case "job-details":
        return detailId ? <JobPostDetails jobId={detailId} /> : <JobPostsList />;
      case "plans":
        return <PlansList />;
      case "subscriptions":
        return <SubscriptionsList />;
      case "profile-access":
        return <ProfileAccessList />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  // Map detail tabs to their parent sidebar tab for highlight
  const sidebarTab = (() => {
    if (tab === "job-seeker-details") return "job-seekers";
    if (tab === "employer-details") return "employers";
    if (tab === "job-details") return "jobs";
    return tab;
  })();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <AdminSidebar active={sidebarTab} sidebarOpen={sidebarOpen} />
      <div className="flex-1 overflow-y-auto">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {renderContent()}
      </div>
    </div>
  );
}

import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CreditCard,
  Package,
  Eye,
  Settings,
  LogOut,
} from "lucide-react";
import img from "@/assets/logo.png";
import img1 from "@/assets/logo1.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/userSlice";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, url: "dashboard" },
  { id: "job-seekers", label: "Users", icon: Users, url: "job-seekers" },
  { id: "employers", label: "Employers", icon: Building2, url: "employers" },
  { id: "jobs", label: "Jobs", icon: Briefcase, url: "jobs" },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard, url: "subscriptions" },
  { id: "plans", label: "Plans", icon: Package, url: "plans" },
  { id: "profile-access", label: "Profile Access", icon: Eye, url: "profile-access" },
  { id: "settings", label: "Settings", icon: Settings, url: "settings" },
];

export default function AdminSidebar({
  active,
  sidebarOpen,
}: {
  active: string;
  sidebarOpen: boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(active || "dashboard");

  useEffect(() => {
    setActiveTab(active || "dashboard");
  }, [active]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside
      className={`min-h-screen w-56 flex flex-col bg-white border-r border-gray-200
        shrink-0 z-50 fixed md:sticky top-0 left-0 transform transition-transform
        duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
    >
      {/* Logo */}
      <div className="h-15 flex items-center gap-2.5 px-4.5 border-b border-gray-200 shrink-0">
        <img className="w-8 h-8" src={img} alt="logo" />
        <img className="h-6" src={img1} alt="logo" />
        <span className="text-xs font-semibold text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              onClick={() => navigate(`/admin?tab=${item.url}`)}
              key={item.id}
              className={`hover:bg-primary-50 hover:text-primary-500 cursor-pointer ${
                isActive ? "bg-primary-50 text-primary-500" : "text-gray-700"
              } relative w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-colors mb-0.5 text-left`}
            >
              {isActive && (
                <span className="bg-primary-500 absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-sm" />
              )}
              <Icon
                className={`${isActive && "text-primary-500"} flex items-center justify-center w-5 h-5`}
              />
              <span className="text-[13.5px] font-medium flex-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <button
        onClick={handleLogout}
        className="cursor-pointer text-red-500 flex items-center gap-2.5 px-5 py-4 border-t border-gray-200 hover:bg-red-50 transition-colors"
      >
        <LogOut className="text-red-500 w-5 h-5" />
        <span className="text-sm font-medium flex-1 whitespace-nowrap text-left">
          Log Out
        </span>
      </button>
    </aside>
  );
}

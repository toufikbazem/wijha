import {
  BookmarkIcon,
  Briefcase,
  Building2,
  FileText,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import img from "@/assets/logo.png";
import img1 from "@/assets/logo1.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/userSlice";

function DashSideBar({
  active,
  sidebarOpen,
}: {
  active: string;
  sidebarOpen: boolean;
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(active || "dashboard");
  const dispatch = useDispatch();

  useEffect(() => {
    setActiveTab(active || "dashboard");
  }, [active]);

  const menuItems = [
    { id: "dash", label: "Dashboard", icon: Briefcase, url: "dash" },
    {
      id: "applications",
      label: "My Applications",
      icon: FileText,
      url: "applications",
    },
    { id: "saved", label: "Saved Jobs", icon: BookmarkIcon, url: "saved" },
    { id: "profile", label: "Profile", icon: User, url: "profile" },
    { id: "settings", label: "Settings", icon: Settings, url: "settings" },
  ];

  const handleLogOut = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) {
        dispatch(logout());
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside
      className={`max-h-screen w-56 flex flex-col bg-white border-r border-gray-200
          shrink-0 z-50 fixed md:sticky top-0 left-0 transform transition-transform 
          duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
    >
      {/* Logo */}
      <div className="h-15 flex items-center gap-2.5 px-4.5 border-b border-gray-200 shrink-0">
        <img className="w-8 h-8" src={img} alt="logo" />
        <img className="h-6" src={img1} alt="logo" />
      </div>

      {/* Nav */}
      <nav className="flex-1  px-2.5 py-4 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              onClick={() => navigate(`/dashboard?tab=${item.url}`)}
              key={item.id}
              className={`hover:bg-primary-50 hover:text-primary-500 cursor-pointer ${active ? "bg-primary-50 text-primary-500" : "text-gray-700"} relative w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-colors mb-0.5 text-left`}
            >
              {active && (
                <span className="bg-primary-500 absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-sm" />
              )}
              <Icon
                className={`${active && "text-primary-500"} flex items-center justify-center w-5 h-5`}
              />

              <span className="text-[13.5px] font-medium flex-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="cursor-pointer text-red-500 flex items-center gap-2.5 px-2.5 py-4 border-t border-gray-200 "
        onClick={handleLogOut}
      >
        <LogOut className={`text-red-500 w-6 h-6`} />

        <span className=" text-sm font-medium flex-1 whitespace-nowrap">
          Log Out
        </span>
      </div>
    </aside>
  );
}

export default DashSideBar;

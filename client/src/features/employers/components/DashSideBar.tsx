import {
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import img from "@/assets/logo.png";
import img1 from "@/assets/logo1.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { logout } from "@/features/auth/userSlice";
import { useDispatch } from "react-redux";

function DashSideBar({
  active,
  sidebarOpen,
}: {
  active: string;
  sidebarOpen: boolean;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(active || "dashboard");
  const { t } = useTranslation("employer");
  const { t: tc } = useTranslation("common");

  const menuItems = [
    {
      id: "dash",
      actives: ["dash"],
      label: t("sidebar.dashboard"),
      icon: Briefcase,
      url: "dash",
    },
    {
      id: "jobPosts",
      actives: ["jobPosts", "editJobPost", "createJobPost"],
      label: t("sidebar.jobPosts"),
      icon: FileText,
      url: "jobPosts",
    },
    {
      id: "company",
      actives: ["company"],
      label: t("sidebar.companyProfile"),
      icon: Building2,
      url: "company",
    },
    {
      id: "profileAccess",
      actives: ["profileAccess"],
      label: t("sidebar.profileAccess"),
      icon: Users,
      url: "profileAccess",
    },
    {
      id: "subscription",
      actives: ["subscription"],
      label: t("sidebar.subscription"),
      icon: CreditCard,
      url: "subscription",
    },
    {
      id: "settings",
      actives: ["settings"],
      label: t("sidebar.settings"),
      icon: Settings,
      url: "settings",
    },
  ];

  useEffect(() => {
    setActiveTab(active || "dashboard");
  }, [active]);

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
      className={`h-screen w-56 flex flex-col bg-white ltr:border-r rtl:border-l border-gray-200
          shrink-0 z-50 fixed md:sticky top-0 ltr:left-0 rtl:right-0 transform transition-transform
          duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}
          md:!translate-x-0`}
    >
      {/* Logo */}
      <div className="h-15 flex items-center gap-2.5 px-4.5 border-b border-gray-200 shrink-0">
        <img className="w-8 h-8" src={img} alt="logo" />
        <img className="h-6" src={img1} alt="logo" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = item.actives.includes(activeTab);
          return (
            <button
              onClick={() => navigate(`/dashboard?tab=${item.url}`)}
              key={item.id}
              className={`hover:bg-primary-50 hover:text-primary-500 cursor-pointer ${active ? "bg-primary-50 text-primary-500" : "text-gray-700"} relative w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-colors mb-0.5 ltr:text-left rtl:text-right`}
            >
              {active && (
                <span className="bg-primary-500 absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] ltr:rounded-r-sm rtl:rounded-l-sm" />
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
        className="cursor-pointer text-red-500 flex items-center gap-2.5 px-2.5 py-4 border-t border-gray-200"
        onClick={handleLogOut}
      >
        <LogOut className={`text-red-500 w-6 h-6`} />
        <span className="text-sm font-medium flex-1 whitespace-nowrap">
          {tc("logOut")}
        </span>
      </div>
    </aside>
  );
}

export default DashSideBar;

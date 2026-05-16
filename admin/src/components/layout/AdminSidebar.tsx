import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  CreditCard,
  Eye,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/app/authSlice";
import { authApi } from "@/api/auth";
import { useNavigate } from "react-router";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/job-seekers", label: "Job Seekers", icon: Users },
  { to: "/employers", label: "Employers", icon: Building2 },
  { to: "/job-posts", label: "Job Posts", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/profile-access", label: "Profile Access", icon: Eye },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    await authApi.logout().catch(() => {});
    dispatch(clearUser());
    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
        <span className="text-lg font-bold text-primary-700">Wijha</span>
        <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600"
        >
          <LogOut className="size-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}

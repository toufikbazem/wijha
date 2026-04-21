import {
  Building,
  LogOutIcon,
  Menu,
  Settings,
  User,
  User2Icon,
} from "lucide-react";
import { useState } from "react";
import img from "@/assets/logo.png";
import img1 from "@/assets/logo1.png";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/features/auth/userSlice";
import { useTranslation } from "react-i18next";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation("public");

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
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center space-x-2"
            onClick={() => navigate("/")}
          >
            <img src={img} alt="Logo" className="h-16" />
            <img src={img1} alt="Logo" className="w-20" />
          </div>
          <div className="hidden lg:flex space-x-8">
            <Link
              to="/"
              className={`${
                true ? "text-[#008CBA]" : "text-gray-700"
              } hover:text-[#008CBA] transition font-medium`}
            >
              {t("home")}
            </Link>
            <Link
              to="/jobSearch"
              className="text-gray-700 hover:text-[#008CBA] transition font-medium"
            >
              {t("navFindJobs")}
            </Link>
            <Link
              to="/contacts"
              className="text-gray-700 hover:text-[#008CBA] transition font-medium"
            >
              {t("navContacts")}
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-[#008CBA] transition font-medium"
            >
              {t("navAbout")}
            </Link>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-9 h-9 bg-[#008CBA] rounded-full flex items-center justify-center">
                    {user.role === "jobseeker" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Building className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Hidden on mobile */}
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user.role === "jobseeker" ? (
                        <>
                          {user.first_name} {user.last_name}
                        </>
                      ) : (
                        user.company_name
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[160px]">
                      {user.email}
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44 p-2 shadow bg-white border-gray-200">
                <DropdownMenuLabel className="md:hidden mb-2">
                  <div className="text-sm font-medium text-gray-900">
                    {user.role === "jobseeker" ? (
                      <>
                        {user.first_name} {user.last_name}
                      </>
                    ) : (
                      <>{user.company_name}</>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[160px]">
                    {user.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard?tab=dash")}
                  className="hover:bg-gray-100 rounded-md cursor-pointer p-2"
                >
                  <Building className="w-4 h-4 mr-2" /> {t("navDashboard")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      `/dashboard?tab=${user.role === "jobseeker" ? "profile" : "company"}`,
                    )
                  }
                  className="hover:bg-gray-100 rounded-md cursor-pointer p-2"
                >
                  <User2Icon className="w-4 h-4 mr-2" /> {t("navProfile")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard?tab=setting")}
                  className="hover:bg-gray-100 rounded-md cursor-pointer p-2"
                >
                  <Settings className="w-4 h-4 mr-2" /> {t("navSettings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="hover:bg-gray-100 rounded-md cursor-pointer p-2"
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="hover:text-white box-border hidden lg:block hover:bg-[#008CBA] text-[#008CBA] border-2 border-[#008CBA] rounded-xl px-4 py-2 font-medium transition"
              >
                {t("login")}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hidden lg:block px-4 py-2 rounded-xl text-white font-semibold bg-[#008CBA] hover:bg-[#00668C] transition-all"
              >
                {t("navGetStarted")}
              </button>
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-6 h-6 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>
      {isMenuOpen && !user && (
        <div className="lg:hidden bg-white shadow-md border-t">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-gray-700 hover:text-[#008CBA] transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              to="/jobSearch"
              className="block text-gray-700 hover:text-[#008CBA] transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navFindJobs")}
            </Link>
            <Link
              to="/contacts"
              className="block text-gray-700 hover:text-[#008CBA] transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navContacts")}
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-[#008CBA] transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navAbout")}
            </Link>
            <div className="flex items-center flex-col gap-4 space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="hover:text-white box-border w-full hover:bg-[#008CBA] text-[#008CBA] border-2 border-[#008CBA] rounded-xl px-4 py-2 font-medium transition"
              >
                {t("login")}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-xl text-white w-full font-semibold bg-[#008CBA] hover:bg-[#00668C] transition-all"
              >
                {t("navGetStarted")}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;

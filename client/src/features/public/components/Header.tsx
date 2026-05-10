import {
  Building,
  LogOutIcon,
  Menu,
  Settings,
  User,
  User2Icon,
} from "lucide-react";
import img from "@/assets/logo.png";
import img1 from "@/assets/logo1.png";
import { Link, useLocation, useNavigate } from "react-router";
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
import i18n from "@/i18n/i18n";
// @ts-expect-error -- LanguageSwitcher is implemented in JSX
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation("public");

  const navLinkClass = (path: string) =>
    `${
      pathname === path ? "text-[#2E8CB8]" : "text-gray-100"
    } hover:text-[#5DADE2] transition font-medium`;

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
    <nav className="sticky top-0 w-full z-20 border-b border-white/10 backdrop-blur-md bg-[#06192d]/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/")}
          >
            <img src={img} alt="Logo" className="h-10" />
            <img src={img1} alt="Logo" className="w-20 pt-3" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={navLinkClass("/")}>
              {t("home")}
            </Link>
            {user?.role === "employer" ? (
              <Link
                to="/dashboard?tab=profileAccess"
                className={navLinkClass("/dashboard?tab=profileAccess")}
              >
                {t("navFindProfiles")}
              </Link>
            ) : (
              <Link to="/jobSearch" className={navLinkClass("/jobSearch")}>
                {t("navFindJobs")}
              </Link>
            )}
            <Link to="/contacts" className={navLinkClass("/contacts")}>
              {t("navContacts")}
            </Link>
            <Link to="/about" className={navLinkClass("/about")}>
              {t("navAbout")}
            </Link>
          </div>

          {/* Right Section - Language Switcher + User Profile */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Profile Dropdown */}
            {user ? (
              <DropdownMenu dir={i18n.dir()}>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
                    {user?.role === "employer" &&
                      (user?.logo ? (
                        <>
                          <div className="w-9 h-9 bg-[#2E8CB8] rounded-full flex items-center justify-center border border-[#5DADE2]">
                            <img
                              src={user?.logo}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div className="hidden md:block">
                            <div className="text-sm font-medium text-white">
                              {user?.company_name}
                            </div>
                            <div className="text-xs text-gray-300 truncate max-w-40">
                              {user?.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-9 h-9 bg-[#2E8CB8] rounded-full flex items-center justify-center border border-[#5DADE2]">
                            <Building className="w-5 h-5 text-white" />
                          </div>
                          <div className="hidden md:block">
                            <div className="text-sm font-medium text-white">
                              {user?.company_name}
                            </div>
                            <div className="text-xs text-gray-300 truncate max-w-40">
                              {user?.email}
                            </div>
                          </div>
                        </>
                      ))}
                    {user?.role === "jobseeker" &&
                      (user?.profile_image ? (
                        <>
                          <div className="w-9 h-9 bg-[#2E8CB8] rounded-full flex items-center justify-center border border-[#5DADE2]">
                            <img
                              src={user?.profile_image}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div className="hidden md:block">
                            <div className="text-sm font-medium text-white">
                              {user?.first_name} {user?.last_name}
                            </div>
                            <div className="text-xs text-gray-300 truncate max-w-40">
                              {user?.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-9 h-9 bg-[#2E8CB8] rounded-full flex items-center justify-center border border-[#5DADE2]">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="hidden md:block">
                            <div className="text-sm font-medium text-white">
                              {user?.first_name} {user?.last_name}
                            </div>
                            <div className="text-xs text-gray-300 truncate max-w-40">
                              {user?.email}
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52 p-2 shadow bg-white border border-gray-200">
                  <DropdownMenuLabel className="md:hidden mb-2">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.role === "employer"
                        ? user?.company_name
                        : `${user?.first_name} ${user?.last_name}`}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-40"  >
                      {user?.email}
                    </div>
                  </DropdownMenuLabel>
                  <div className="lg:hidden">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                      >
                        {t("home")}
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "employer" ? (
                      <DropdownMenuItem asChild>
                        <Link
                          to="/dashboard?tab=profileAccess"
                          className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                        >
                          {t("navFindProfiles")}
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link
                          to="/jobSearch"
                          className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                        >
                          {t("navFindJobs")}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        to="/contacts"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                      >
                        {t("navContacts")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/about"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                      >
                        {t("navAbout")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                  </div>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard?tab=dash")}
                    className="hover:bg-gray-100 rounded-md cursor-pointer p-2 text-gray-900"
                  >
                    <Building className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {t("dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard?tab=company")}
                    className="hover:bg-gray-100 rounded-md cursor-pointer p-2 text-gray-900"
                  >
                    <User2Icon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {t("profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard?tab=settings")}
                    className="hover:bg-gray-100 rounded-md cursor-pointer p-2 text-gray-900"
                  >
                    <Settings className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {t("settings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={() => handleLogOut()}
                    className="hover:bg-red-100 rounded-md cursor-pointer p-2 text-red-600 font-medium"
                  >
                    <LogOutIcon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Desktop Auth Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="hover:bg-white/10 box-border text-white border-2 border-white/30 rounded-xl px-4 py-2 font-medium transition hover:border-[#2E8CB8]"
                  >
                    {t("login")}
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 rounded-xl text-white font-semibold bg-[#2E8CB8] hover:bg-[#1E5A7A] transition-all"
                  >
                    {t("navGetStarted")}
                  </button>
                </div>

                {/* Mobile Menu */}
                <DropdownMenu dir={i18n.dir()}>
                  <DropdownMenuTrigger asChild>
                    <button className="lg:hidden p-2 rounded-lg hover:bg-white/10 cursor-pointer transition">
                      <Menu className="w-6 h-6 text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52 p-2 shadow bg-white border-gray-200 lg:hidden">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                      >
                        {t("home")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/jobSearch"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                      >
                        {t("navFindJobs")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/contacts"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                      >
                        {t("navContacts")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/about"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full text-gray-900"
                      >
                        {t("navAbout")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      onClick={() => navigate("/login")}
                      className="hover:bg-gray-100 rounded-md cursor-pointer p-2 text-[#2E8CB8] font-medium"
                    >
                      {t("login")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/register")}
                      className="hover:bg-[#1E5A7A] bg-[#2E8CB8] rounded-md cursor-pointer p-2 text-white font-semibold mt-1"
                    >
                      {t("navGetStarted")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
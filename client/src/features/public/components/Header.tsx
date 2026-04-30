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

const LANGUAGES = [
  { code: "en", flag: "en", label: "EN" },
  { code: "fr", flag: "fr", label: "FR" },
  { code: "ar", flag: "ar", label: "AR" },
];

function LanguageSwitcher() {
  const inactive = LANGUAGES.filter((l) => l.code !== i18n.language);

  return (
    <div className="flex items-center gap-1">
      {inactive.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          title={lang.label}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#008CBA]/10 transition-all text-xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#008CBA]"
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation("public");

  const navLinkClass = (path: string) =>
    `${pathname === path ? "text-[#008CBA]" : "text-gray-700"} hover:text-[#008CBA] transition font-medium`;

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
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-47">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={img} alt="Logo" className="h-16" />
            <img src={img1} alt="Logo" className="w-20" />
          </div>
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
            <LanguageSwitcher />
          </div>
          {user ? (
            <DropdownMenu dir={i18n.dir()}>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  {user?.role === "employer" &&
                    (user?.logo ? (
                      <>
                        <div className="w-9 h-9 bg-[#008CBA] rounded-full flex items-center justify-center">
                          <img
                            src={user?.logo}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="hidden md:block">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.company_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-40">
                            {user?.email}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-9 h-9 bg-[#008CBA] rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden md:block">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.company_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-40">
                            {user?.email}
                          </div>
                        </div>
                      </>
                    ))}
                  {user?.role === "jobseeker" &&
                    (user?.profile_image ? (
                      <>
                        <div className="w-9 h-9 bg-[#008CBA] rounded-full flex items-center justify-center">
                          <img
                            src={user?.profile_image}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="hidden md:block">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.first_name} {user?.last_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-40">
                            {user?.email}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-9 h-9 bg-[#008CBA] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden md:block">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.first_name} {user?.last_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-40">
                            {user?.email}
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 p-2 shadow bg-white border-gray-200">
                <DropdownMenuLabel className="md:hidden mb-2">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.role === "employer"
                      ? user?.company_name
                      : `${user?.first_name} ${user?.last_name}`}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[160px]">
                    {user?.email}
                  </div>
                </DropdownMenuLabel>
                <div className="lg:hidden">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                    >
                      {t("home")}
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "employer" ? (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard?tab=profileAccess"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                      >
                        {t("navFindProfiles")}
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/jobSearch"
                        className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                      >
                        {t("navFindJobs")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      to="/contacts"
                      className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                    >
                      {t("navContacts")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/about"
                      className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                    >
                      {t("navAbout")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <div className="px-1 py-1">
                    <div className="text-xs text-gray-400 px-2 pb-1">
                      {t("footerLanguage")}
                    </div>
                    <div className="flex gap-1 px-1">
                      {LANGUAGES.filter((l) => l.code !== i18n.language).map(
                        (lang) => (
                          <button
                            key={lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                            title={lang.label}
                            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#008CBA]/10 transition-all text-xl leading-none"
                          >
                            {lang.flag}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200" />
                </div>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard?tab=dash")}
                  className="hover:bg-gray-100 rounded-md cursor-pointer p-2"
                >
                  <Building className="w-4 h-4 ltr:mr-2 rtl:ml-2" />{" "}
                  {t("dashboard")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard?tab=company")}
                  className="hover:bg-gray-100 rounded-md cursor-pointer p-2"
                >
                  <User2Icon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />{" "}
                  {t("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard?tab=settings")}
                  className="hover:bg-gray-100 rounded-md cursor-pointer p-2"
                >
                  <Settings className="w-4 h-4 ltr:mr-2 rtl:ml-2" />{" "}
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onClick={() => handleLogOut()}
                  className="hover:bg-gray-100 rounded-md cursor-pointer p-2"
                >
                  <LogOutIcon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="hover:text-white box-border hover:bg-[#008CBA] text-[#008CBA] border-2 border-[#008CBA] rounded-xl px-4 py-2 font-medium transition"
                >
                  {t("login")}
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 rounded-xl text-white font-semibold bg-[#008CBA] hover:bg-[#00668C] transition-all"
                >
                  {t("navGetStarted")}
                </button>
              </div>
              <DropdownMenu dir={i18n.dir()}>
                <DropdownMenuTrigger asChild>
                  <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <Menu className="w-6 h-6 text-black" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52 p-2 shadow bg-white border-gray-200 lg:hidden">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                    >
                      {t("home")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/jobSearch"
                      className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                    >
                      {t("navFindJobs")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/contacts"
                      className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                    >
                      {t("navContacts")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/about"
                      className="flex items-center hover:bg-gray-100 rounded-md cursor-pointer p-2 w-full"
                    >
                      {t("navAbout")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <div className="px-1 py-1">
                    <div className="text-xs text-gray-400 px-2 pb-1">
                      {t("footerLanguage")}
                    </div>
                    <div className="flex gap-1 px-1">
                      {LANGUAGES.filter((l) => l.code !== i18n.language).map(
                        (lang) => (
                          <button
                            key={lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                            title={lang.label}
                            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#008CBA]/10 transition-all text-xl leading-none"
                          >
                            {lang.flag}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={() => navigate("/login")}
                    className="hover:bg-gray-100 rounded-md cursor-pointer p-2 text-[#008CBA] font-medium"
                  >
                    {t("login")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/register")}
                    className="hover:bg-[#00668C] bg-[#008CBA] rounded-md cursor-pointer p-2 text-white font-semibold mt-1"
                  >
                    {t("navGetStarted")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;

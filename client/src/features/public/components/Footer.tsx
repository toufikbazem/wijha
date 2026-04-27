import img from "@/assets/logo.png";
import img1 from "@/assets/logo1.png";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import { Link } from "react-router";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

function Footer() {
  const { t } = useTranslation("public");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={img} alt="Logo" className="h-16" />
              <img src={img1} alt="Logo" className="w-20" />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t("footerTagline")}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">
              {t("footerForJobSeekers")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/jobSearch"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerBrowseJobs")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerCareerAdvice")}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard?dash=profile"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerResumeBuilder")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerSalaryTools")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">
              {t("footerForEmployers")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard?dash=createJobPost"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerPostJob")}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard?dash=subscriptions"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerPricing")}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard?dash=profileAccess"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerBrowseTalent")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerHiringResources")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">{t("footerCompany")}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerAboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerContact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/jobSearch"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerCareers")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#008CBA] transition"
                >
                  {t("footerPress")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t("footerRights")}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">{t("footerLanguage")}</span>
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-gray-800 text-gray-300 text-sm border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-[#008CBA] cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

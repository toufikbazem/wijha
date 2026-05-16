import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = LANGUAGES.find((l) => l.code === i18n.language);

  const handleChangeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem("language", languageCode);
    document.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Main Dropdown Button - Clean Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-[#1E5A7A] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5DADE2]"
        title="Change Language"
        aria-label="Language selector"
      >
        <Globe className="w-4 h-4" />
        {/* <span className="text-sm font-medium">{currentLanguage?.label}</span> */}
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`
                w-full text-left px-4 py-2
                flex items-center gap-2
                transition-all
                whitespace-nowrap
                ${
                  lang.code === i18n.language
                    ? "bg-[#2E8CB8] text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.code === i18n.language && (
                <span className="ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

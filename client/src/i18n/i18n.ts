import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enJobs from "./locales/en/jobs.json";
import enEmployer from "./locales/en/employer.json";
import enJobseeker from "./locales/en/jobseeker.json";
import enAdmin from "./locales/en/admin.json";
import enPublic from "./locales/en/public.json";
import enData from "./locales/en/data.json";
import enTerms from "./locales/en/terms.json";
import enError from "./locales/en/error.json";

// French
import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frJobs from "./locales/fr/jobs.json";
import frEmployer from "./locales/fr/employer.json";
import frJobseeker from "./locales/fr/jobseeker.json";
import frAdmin from "./locales/fr/admin.json";
import frPublic from "./locales/fr/public.json";
import frData from "./locales/fr/data.json";
import frTerms from "./locales/fr/terms.json";
import frError from "./locales/fr/error.json";

// Arabic
import arCommon from "./locales/ar/common.json";
import arAuth from "./locales/ar/auth.json";
import arJobs from "./locales/ar/jobs.json";
import arEmployer from "./locales/ar/employer.json";
import arJobseeker from "./locales/ar/jobseeker.json";
import arAdmin from "./locales/ar/admin.json";
import arPublic from "./locales/ar/public.json";
import arData from "./locales/ar/data.json";
import arTerms from "./locales/ar/terms.json";
import arError from "./locales/ar/error.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    defaultNS: "common",
    ns: [
      "common",
      "auth",
      "jobs",
      "employer",
      "jobseeker",
      "admin",
      "public",
      "data",
      "terms",
      "error",
    ],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        jobs: enJobs,
        employer: enEmployer,
        jobseeker: enJobseeker,
        admin: enAdmin,
        public: enPublic,
        data: enData,
        terms: enTerms,
        error: enError,
      },
      fr: {
        common: frCommon,
        auth: frAuth,
        jobs: frJobs,
        employer: frEmployer,
        jobseeker: frJobseeker,
        admin: frAdmin,
        public: frPublic,
        data: frData,
        terms: frTerms,
        error: frError,
      },
      ar: {
        common: arCommon,
        auth: arAuth,
        jobs: arJobs,
        employer: arEmployer,
        jobseeker: arJobseeker,
        admin: arAdmin,
        public: arPublic,
        data: arData,
        terms: arTerms,
        error: arError,
      },
    },
  });

export default i18n;

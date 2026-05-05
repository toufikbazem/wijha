import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  FileText,
  Calendar,
  Mail,
  ChevronUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock,
  Users,
  Cookie,
  Scale,
  BookOpen,
  Building2,
  UserCheck,
  Ban,
  Eye,
  Database,
  Globe,
  Settings,
  Trash2,
  HandshakeIcon,
  Briefcase,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type TocItem = {
  id: string;
  labelKey: string;
  group: "user" | "employer";
};

const tocItems: TocItem[] = [
  { id: "definitions", labelKey: "tocItems.definitions", group: "user" },
  { id: "legalFramework", labelKey: "tocItems.legalFramework", group: "user" },
  { id: "serviceNature", labelKey: "tocItems.serviceNature", group: "user" },
  { id: "dataCollected", labelKey: "tocItems.dataCollected", group: "user" },
  {
    id: "processingPurposes",
    labelKey: "tocItems.processingPurposes",
    group: "user",
  },
  { id: "legalBasis", labelKey: "tocItems.legalBasis", group: "user" },
  { id: "userConsent", labelKey: "tocItems.userConsent", group: "user" },
  { id: "dataSharing", labelKey: "tocItems.dataSharing", group: "user" },
  { id: "dataTransfer", labelKey: "tocItems.dataTransfer", group: "user" },
  { id: "dataProtection", labelKey: "tocItems.dataProtection", group: "user" },
  { id: "retention", labelKey: "tocItems.retention", group: "user" },
  { id: "userRights", labelKey: "tocItems.userRights", group: "user" },
  {
    id: "accountDeletion",
    labelKey: "tocItems.accountDeletion",
    group: "user",
  },
  {
    id: "userResponsibilities",
    labelKey: "tocItems.userResponsibilities",
    group: "user",
  },
  {
    id: "employerResponsibilities",
    labelKey: "tocItems.employerResponsibilities",
    group: "user",
  },
  { id: "limitations", labelKey: "tocItems.limitations", group: "user" },
  { id: "cookies", labelKey: "tocItems.cookies", group: "user" },
  { id: "modifications", labelKey: "tocItems.modifications", group: "user" },
  { id: "contact", labelKey: "tocItems.contact", group: "user" },
  { id: "acceptance", labelKey: "tocItems.acceptance", group: "user" },

  {
    id: "employerService",
    labelKey: "tocItems.employerService",
    group: "employer",
  },
  {
    id: "employerDataNature",
    labelKey: "tocItems.employerDataNature",
    group: "employer",
  },
  {
    id: "permittedPurpose",
    labelKey: "tocItems.permittedPurpose",
    group: "employer",
  },
  {
    id: "prohibitedUse",
    labelKey: "tocItems.prohibitedUse",
    group: "employer",
  },
  {
    id: "confidentiality",
    labelKey: "tocItems.confidentiality",
    group: "employer",
  },
  {
    id: "legalLiability",
    labelKey: "tocItems.legalLiability",
    group: "employer",
  },
  {
    id: "dataRetentionEmployer",
    labelKey: "tocItems.retention",
    group: "employer",
  },
  { id: "compliance", labelKey: "tocItems.compliance", group: "employer" },
  { id: "monitoring", labelKey: "tocItems.monitoring", group: "employer" },
  {
    id: "platformLimits",
    labelKey: "tocItems.platformLimits",
    group: "employer",
  },
  { id: "penalties", labelKey: "tocItems.penalties", group: "employer" },
  {
    id: "modificationsEmployer",
    labelKey: "tocItems.modifications",
    group: "employer",
  },
  {
    id: "acceptanceEmployer",
    labelKey: "tocItems.acceptance",
    group: "employer",
  },
];

function SectionCard({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="shrink-0 w-11 h-11 rounded-xl bg-linear-to-br from-[#008CBA] to-[#006a8e] flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight pt-1">
          {title}
        </h2>
      </div>
      <div className="text-gray-700 leading-relaxed text-[15px] space-y-3">
        {children}
      </div>
    </section>
  );
}

function Notice({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "warning" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      bg: "bg-[#E6F7FB]",
      border: "border-[#008CBA]",
      text: "text-[#006a8e]",
      icon: Info,
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-400",
      text: "text-amber-800",
      icon: AlertTriangle,
    },
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-500",
      text: "text-emerald-800",
      icon: CheckCircle2,
    },
  }[variant];

  const Icon = styles.icon;

  return (
    <div
      className={`${styles.bg} ltr:border-l-4 rtl:border-r-4 ${styles.border} rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg p-4 my-4`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${styles.text}`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`font-semibold mb-1 ${styles.text}`}>{title}</p>
          )}
          <div className="text-gray-700 text-sm space-y-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#008CBA] mt-2.5" />
      <span>{children}</span>
    </li>
  );
}

function DefinitionRow({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="sm:w-44 shrink-0">
        <span className="font-semibold text-[#008CBA]">{term}</span>
      </div>
      <p className="text-gray-700 flex-1">{definition}</p>
    </div>
  );
}

function TermsAndConditions() {
  useDocumentTitle("meta.title.terms");
  const { t, i18n } = useTranslation("terms");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("definitions");

  const isRtl = i18n.language === "ar";

  const userTocItems = useMemo(
    () => tocItems.filter((it) => it.group === "user"),
    [],
  );
  const employerTocItems = useMemo(
    () => tocItems.filter((it) => it.group === "employer"),
    [],
  );

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const sections = tocItems
        .map((it) => document.getElementById(it.id))
        .filter(Boolean) as HTMLElement[];

      const scrollPos = window.scrollY + 120;
      let current = sections[0]?.id ?? "";
      for (const sec of sections) {
        if (sec.offsetTop <= scrollPos) {
          current = sec.id;
        }
      }
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-linear-to-b from-gray-50 to-white min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-[#008CBA] via-[#006a8e] to-[#004d6b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 ltr:left-10 rtl:right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 ltr:right-10 rtl:left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium border border-white/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Wijha</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            {t("pageTitle")}
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8">
            {t("pageSubtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Calendar className="w-4 h-4" />
              <span>
                {t("lastUpdated")}: {t("lastUpdatedDate")}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <BookOpen className="w-4 h-4" />
              <span>{t("readingTime", { minutes: 8 })}</span>
            </div>
          </div>
          <div className="mt-8 max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-sm text-white/95 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{t("trustedNotice")}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* TOC */}
          <aside className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <FileText className="w-5 h-5 text-[#008CBA]" />
                  <h3 className="font-bold text-gray-900">
                    {t("tableOfContents")}
                  </h3>
                </div>
                <nav className="max-h-[60vh] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1 custom-scrollbar">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-1">
                    {t("section1.title")}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {userTocItems.map((item, i) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full ltr:text-left rtl:text-right text-sm py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                            activeSection === item.id
                              ? "bg-[#E6F7FB] text-[#008CBA] font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className="text-xs text-gray-400 shrink-0 w-5">
                            {i + 1}.
                          </span>
                          <span className="truncate">{t(item.labelKey)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-3">
                    {t("tocItems.employerSection")}
                  </p>
                  <ul className="space-y-1">
                    {employerTocItems.map((item, i) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full ltr:text-left rtl:text-right text-sm py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                            activeSection === item.id
                              ? "bg-[#E6F7FB] text-[#008CBA] font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className="text-xs text-gray-400 shrink-0 w-5">
                            {i + 1}.
                          </span>
                          <span className="truncate">{t(item.labelKey)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2 space-y-6">
            {/* Section 1 header */}
            <div className="bg-linear-to-br from-[#008CBA] to-[#006a8e] text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Part 1
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                {t("section1.title")}
              </h2>
              <p className="text-white/90 leading-relaxed">
                {t("section1.intro")}
              </p>
            </div>

            <SectionCard
              id="definitions"
              icon={BookOpen}
              title={t("definitions.title")}
            >
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                <DefinitionRow
                  term={t("definitions.platform.term")}
                  definition={t("definitions.platform.definition")}
                />
                <DefinitionRow
                  term={t("definitions.user.term")}
                  definition={t("definitions.user.definition")}
                />
                <DefinitionRow
                  term={t("definitions.personalData.term")}
                  definition={t("definitions.personalData.definition")}
                />
                <DefinitionRow
                  term={t("definitions.processing.term")}
                  definition={t("definitions.processing.definition")}
                />
              </div>
            </SectionCard>

            <SectionCard
              id="legalFramework"
              icon={Scale}
              title={t("legalFramework.title")}
            >
              <p>{t("legalFramework.content")}</p>
            </SectionCard>

            <SectionCard
              id="serviceNature"
              icon={Briefcase}
              title={t("serviceNature.title")}
            >
              <p>{t("serviceNature.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("serviceNature.item1")}</Bullet>
                <Bullet>{t("serviceNature.item2")}</Bullet>
              </ul>
              <Notice
                variant="warning"
                title={t("serviceNature.noticeTitle")}
              >
                <ul className="space-y-1">
                  <li>• {t("serviceNature.notice1")}</li>
                  <li>• {t("serviceNature.notice2")}</li>
                  <li>• {t("serviceNature.notice3")}</li>
                </ul>
              </Notice>
            </SectionCard>

            <SectionCard
              id="dataCollected"
              icon={Database}
              title={t("dataCollected.title")}
            >
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t("dataCollected.userProvidedTitle")}
                </h4>
                <ul className="space-y-2">
                  <Bullet>{t("dataCollected.userItem1")}</Bullet>
                  <Bullet>{t("dataCollected.userItem2")}</Bullet>
                  <Bullet>{t("dataCollected.userItem3")}</Bullet>
                  <Bullet>{t("dataCollected.userItem4")}</Bullet>
                  <Bullet>{t("dataCollected.userItem5")}</Bullet>
                  <Bullet>{t("dataCollected.userItem6")}</Bullet>
                </ul>
              </div>
              <div className="pt-3">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t("dataCollected.automaticTitle")}
                </h4>
                <ul className="space-y-2">
                  <Bullet>{t("dataCollected.autoItem1")}</Bullet>
                  <Bullet>{t("dataCollected.autoItem2")}</Bullet>
                  <Bullet>{t("dataCollected.autoItem3")}</Bullet>
                </ul>
              </div>
              <div className="pt-3">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t("dataCollected.thirdPartyTitle")}
                </h4>
                <ul className="space-y-2">
                  <Bullet>{t("dataCollected.thirdPartyItem")}</Bullet>
                </ul>
              </div>
            </SectionCard>

            <SectionCard
              id="processingPurposes"
              icon={Settings}
              title={t("processingPurposes.title")}
            >
              <p>{t("processingPurposes.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("processingPurposes.item1")}</Bullet>
                <Bullet>{t("processingPurposes.item2")}</Bullet>
                <Bullet>{t("processingPurposes.item3")}</Bullet>
                <Bullet>{t("processingPurposes.item4")}</Bullet>
                <Bullet>{t("processingPurposes.item5")}</Bullet>
              </ul>
              <p className="pt-2 italic text-gray-600">
                {t("processingPurposes.outro")}
              </p>
            </SectionCard>

            <SectionCard
              id="legalBasis"
              icon={Scale}
              title={t("legalBasis.title")}
            >
              <p>{t("legalBasis.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("legalBasis.item1")}</Bullet>
                <Bullet>{t("legalBasis.item2")}</Bullet>
                <Bullet>{t("legalBasis.item3")}</Bullet>
                <Bullet>{t("legalBasis.item4")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="userConsent"
              icon={CheckCircle2}
              title={t("userConsent.title")}
            >
              <p>{t("userConsent.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("userConsent.item1")}</Bullet>
                <Bullet>{t("userConsent.item2")}</Bullet>
              </ul>
              <p className="pt-2 italic text-gray-600">
                {t("userConsent.outro")}
              </p>
            </SectionCard>

            <SectionCard
              id="dataSharing"
              icon={Users}
              title={t("dataSharing.title")}
            >
              <p>{t("dataSharing.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("dataSharing.item1")}</Bullet>
                <Bullet>{t("dataSharing.item2")}</Bullet>
              </ul>
              <Notice variant="success" title={t("dataSharing.noticeTitle")}>
                <ul className="space-y-1">
                  <li>• {t("dataSharing.notice1")}</li>
                  <li>• {t("dataSharing.notice2")}</li>
                </ul>
              </Notice>
            </SectionCard>

            <SectionCard
              id="dataTransfer"
              icon={Globe}
              title={t("dataTransfer.title")}
            >
              <p>{t("dataTransfer.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("dataTransfer.item1")}</Bullet>
                <Bullet>{t("dataTransfer.item2")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="dataProtection"
              icon={ShieldCheck}
              title={t("dataProtection.title")}
            >
              <p>{t("dataProtection.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("dataProtection.item1")}</Bullet>
                <Bullet>{t("dataProtection.item2")}</Bullet>
                <Bullet>{t("dataProtection.item3")}</Bullet>
                <Bullet>{t("dataProtection.item4")}</Bullet>
              </ul>
              <Notice
                variant="warning"
                title={t("dataProtection.warningTitle")}
              >
                {t("dataProtection.warning")}
              </Notice>
            </SectionCard>

            <SectionCard
              id="retention"
              icon={Calendar}
              title={t("retention.title")}
            >
              <ul className="space-y-2">
                <Bullet>{t("retention.item1")}</Bullet>
                <Bullet>{t("retention.item2")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="userRights"
              icon={UserCheck}
              title={t("userRights.title")}
            >
              <p>{t("userRights.intro")}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#E6F7FB] transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#008CBA] mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">
                      {t(`userRights.item${i}`)}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              id="accountDeletion"
              icon={Trash2}
              title={t("accountDeletion.title")}
            >
              <p>{t("accountDeletion.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("accountDeletion.item1")}</Bullet>
                <Bullet>{t("accountDeletion.item2")}</Bullet>
              </ul>
              <Notice
                variant="warning"
                title={t("accountDeletion.warningTitle")}
              >
                <ul className="space-y-1">
                  <li>• {t("accountDeletion.warning1")}</li>
                  <li>• {t("accountDeletion.warning2")}</li>
                </ul>
              </Notice>
            </SectionCard>

            <SectionCard
              id="userResponsibilities"
              icon={UserCheck}
              title={t("userResponsibilities.title")}
            >
              <p>{t("userResponsibilities.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("userResponsibilities.item1")}</Bullet>
                <Bullet>{t("userResponsibilities.item2")}</Bullet>
                <Bullet>{t("userResponsibilities.item3")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="employerResponsibilities"
              icon={Building2}
              title={t("employerResponsibilities.title")}
            >
              <p>{t("employerResponsibilities.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("employerResponsibilities.item1")}</Bullet>
                <Bullet>{t("employerResponsibilities.item2")}</Bullet>
                <Bullet>{t("employerResponsibilities.item3")}</Bullet>
              </ul>
              <Notice variant="warning">
                {t("employerResponsibilities.warning")}
              </Notice>
            </SectionCard>

            <SectionCard
              id="limitations"
              icon={Scale}
              title={t("limitations.title")}
            >
              <p>{t("limitations.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("limitations.item1")}</Bullet>
                <Bullet>{t("limitations.item2")}</Bullet>
                <Bullet>{t("limitations.item3")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard id="cookies" icon={Cookie} title={t("cookies.title")}>
              <p>{t("cookies.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("cookies.item1")}</Bullet>
                <Bullet>{t("cookies.item2")}</Bullet>
                <Bullet>{t("cookies.item3")}</Bullet>
              </ul>
              <p className="pt-2 italic text-gray-600">{t("cookies.outro")}</p>
            </SectionCard>

            <SectionCard
              id="modifications"
              icon={Settings}
              title={t("modifications.title")}
            >
              <p>{t("modifications.content")}</p>
            </SectionCard>

            <SectionCard id="contact" icon={Mail} title={t("contact.title")}>
              <a
                href={`mailto:${t("contact.email")}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E6F7FB] text-[#008CBA] font-semibold hover:bg-[#008CBA] hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                {t("contact.email")}
              </a>
            </SectionCard>

            <SectionCard
              id="acceptance"
              icon={HandshakeIcon}
              title={t("acceptance.title")}
            >
              <p>{t("acceptance.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("acceptance.item1")}</Bullet>
                <Bullet>{t("acceptance.item2")}</Bullet>
                <Bullet>{t("acceptance.item3")}</Bullet>
              </ul>
            </SectionCard>

            {/* Section 2 header */}
            <div className="bg-linear-to-br from-[#006a8e] to-[#004d6b] text-white rounded-2xl p-6 sm:p-8 shadow-md mt-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Part 2
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                {t("section2.title")}
              </h2>
              <p className="text-white/90 leading-relaxed mb-3">
                {t("section2.intro")}
              </p>
              <p className="text-white/90 leading-relaxed text-sm font-medium">
                {t("section2.agreement")}
              </p>
            </div>

            <SectionCard
              id="employerService"
              icon={Briefcase}
              title={t("employerService.title")}
            >
              <p>{t("employerService.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("employerService.item1")}</Bullet>
                <Bullet>{t("employerService.item2")}</Bullet>
                <Bullet>{t("employerService.item3")}</Bullet>
              </ul>
              <Notice
                variant="warning"
                title={t("employerService.noticeTitle")}
              >
                <ul className="space-y-1">
                  <li>• {t("employerService.notice1")}</li>
                  <li>• {t("employerService.notice2")}</li>
                  <li>• {t("employerService.notice3")}</li>
                </ul>
              </Notice>
            </SectionCard>

            <SectionCard
              id="employerDataNature"
              icon={Database}
              title={t("employerDataNature.title")}
            >
              <p>{t("employerDataNature.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("employerDataNature.item1")}</Bullet>
                <Bullet>{t("employerDataNature.item2")}</Bullet>
                <Bullet>{t("employerDataNature.item3")}</Bullet>
                <Bullet>{t("employerDataNature.item4")}</Bullet>
                <Bullet>{t("employerDataNature.item5")}</Bullet>
              </ul>
              <p className="pt-2 italic text-gray-600">
                {t("employerDataNature.outro")}
              </p>
            </SectionCard>

            <SectionCard
              id="permittedPurpose"
              icon={CheckCircle2}
              title={t("permittedPurpose.title")}
            >
              <p>{t("permittedPurpose.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("permittedPurpose.item1")}</Bullet>
                <Bullet>{t("permittedPurpose.item2")}</Bullet>
                <Bullet>{t("permittedPurpose.item3")}</Bullet>
              </ul>
              <Notice variant="warning">{t("permittedPurpose.warning")}</Notice>
            </SectionCard>

            <SectionCard
              id="prohibitedUse"
              icon={Ban}
              title={t("prohibitedUse.title")}
            >
              <p>{t("prohibitedUse.intro")}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
                  >
                    <Ban className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">
                      {t(`prohibitedUse.item${i}`)}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              id="confidentiality"
              icon={Lock}
              title={t("confidentiality.title")}
            >
              <p>{t("confidentiality.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("confidentiality.item1")}</Bullet>
                <Bullet>{t("confidentiality.item2")}</Bullet>
                <Bullet>{t("confidentiality.item3")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="legalLiability"
              icon={Scale}
              title={t("legalLiability.title")}
            >
              <p>{t("legalLiability.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("legalLiability.item1")}</Bullet>
                <Bullet>{t("legalLiability.item2")}</Bullet>
                <Bullet>{t("legalLiability.item3")}</Bullet>
              </ul>
              <Notice variant="warning">{t("legalLiability.warning")}</Notice>
            </SectionCard>

            <SectionCard
              id="dataRetentionEmployer"
              icon={Calendar}
              title={t("dataRetentionEmployer.title")}
            >
              <p>{t("dataRetentionEmployer.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("dataRetentionEmployer.item1")}</Bullet>
                <Bullet>{t("dataRetentionEmployer.item2")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="compliance"
              icon={Scale}
              title={t("compliance.title")}
            >
              <p>{t("compliance.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("compliance.item1")}</Bullet>
                <Bullet>{t("compliance.item2")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="monitoring"
              icon={Eye}
              title={t("monitoring.title")}
            >
              <p>{t("monitoring.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("monitoring.item1")}</Bullet>
                <Bullet>{t("monitoring.item2")}</Bullet>
                <Bullet>{t("monitoring.item3")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="platformLimits"
              icon={Info}
              title={t("platformLimits.title")}
            >
              <p>{t("platformLimits.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("platformLimits.item1")}</Bullet>
                <Bullet>{t("platformLimits.item2")}</Bullet>
                <Bullet>{t("platformLimits.item3")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="penalties"
              icon={AlertTriangle}
              title={t("penalties.title")}
            >
              <p>{t("penalties.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("penalties.item1")}</Bullet>
                <Bullet>{t("penalties.item2")}</Bullet>
                <Bullet>{t("penalties.item3")}</Bullet>
              </ul>
            </SectionCard>

            <SectionCard
              id="modificationsEmployer"
              icon={Settings}
              title={t("modificationsEmployer.title")}
            >
              <p>{t("modificationsEmployer.content")}</p>
            </SectionCard>

            <SectionCard
              id="acceptanceEmployer"
              icon={HandshakeIcon}
              title={t("acceptanceEmployer.title")}
            >
              <p>{t("acceptanceEmployer.intro")}</p>
              <ul className="space-y-2 mt-2">
                <Bullet>{t("acceptanceEmployer.item1")}</Bullet>
                <Bullet>{t("acceptanceEmployer.item2")}</Bullet>
                <Bullet>{t("acceptanceEmployer.item3")}</Bullet>
              </ul>
            </SectionCard>

            {/* Footer card */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 text-center mt-10 shadow-lg">
              <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-[#4dd0f0]" />
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                {t("footer.thankYou")}
              </h3>
              <p className="text-white/80 mb-4">{t("footer.questions")}</p>
              <a
                href={`mailto:${t("contact.email")}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#008CBA] hover:bg-[#006a8e] transition-colors font-semibold"
              >
                <Mail className="w-4 h-4" />
                {t("footer.contactUs")} {t("contact.email")}
              </a>
              <p className="text-xs text-white/60 mt-6">
                {t("lastUpdated")}: {t("lastUpdatedDate")}
              </p>
            </div>
          </main>
        </div>
      </section>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label={t("backToTop")}
          className={`fixed bottom-6 ${
            isRtl ? "left-6" : "right-6"
          } z-40 bg-[#008CBA] hover:bg-[#006a8e] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110`}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      <Footer />
    </div>
  );
}

export default TermsAndConditions;

import { useEffect, useState } from "react";
import { Search, Building2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import Footer from "../components/Footer";
import Header from "../components/Header";
import CompanyCard, { type Company } from "./Card";
import DashJobPostsPagination from "@/features/employers/components/DashJobPostsPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const LIMIT = 12;

function Companies() {
  useDocumentTitle("meta.title.companies");
  const { t } = useTranslation("public");

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const companyOfMoth = [
    {
      user_id: "a077a05c-8927-46c4-95dc-06fb912ea0f8",
      employer_id: "a077a05c-8927-46c4-95dc-06fb912ea0f8",
      company_name: "UVEDS diesel",
      industry: "Industrial & Manufacturing",
      address: "Dar el Beïda, Alger",
      size: "51-200",
      founding_year: "2004",
      logo: "https://boviztzlmswursbcnsnh.supabase.co/storage/v1/object/public/wijha/public/1777537216067-UVEDS.png",
      cover_image:
        "https://boviztzlmswursbcnsnh.supabase.co/storage/v1/object/public/wijha/public/1782296600983-484870131_998814535641934_771476738659899988_n.jpg",
      description:
        "Spécialiste de la motorisation diesel, UVEDS conçoit et fabrique des solutions industrielles fiables pour les secteurs de l'énergie et du transport.",
    },
    {
      user_id: "b4573689-a65c-414c-b416-e14177799053",
      employer_id: "b4573689-a65c-414c-b416-e14177799053",
      company_name: "RECOLTAL",
      industry: "Industrial & Manufacturing",
      address: "Ain El lbel, Djelfa",
      size: "201-500",
      founding_year: "2008",
      logo: "https://boviztzlmswursbcnsnh.supabase.co/storage/v1/object/public/wijha/public/1778327794241-70624_1.png.thb.jpg",
      cover_image:
        "https://boviztzlmswursbcnsnh.supabase.co/storage/v1/object/public/wijha/public/1778327846443-573088652_122099665293092834_3288622589970192079_n.jpg",
      description:
        "RECOLTAL accompagne les acteurs agro-industriels avec des équipements de récolte et de transformation performants, au service d'une agriculture moderne.",
    },
  ];

  // Debounce the search input so we don't fire a request on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCompanies = async () => {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
        });
        if (search) params.set("search", search);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/employers/public/companies?${params}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error("Failed to fetch companies");

        const data = await res.json();
        setCompanies(data.companies || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Error fetching companies:", err);
        setError(true);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
    return () => controller.abort();
  }, [page, search]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-gray-100 bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,var(--color-primary-100),transparent)]"
          />
          <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-8 text-center ">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50/80 px-3 py-1 text-xs font-medium text-primary-600">
              <Building2 className="h-3.5 w-3.5" />
              {t("Companies")}
            </span>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t("companiesTitle")}
            </h1>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              {t("companiesSubtitle")}
            </p>

            {/* Search bar */}
            <div className="relative mt-4 w-full max-w-md">
              <Search className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("companiesSearchPlaceholder")}
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 ps-11 pe-5 text-sm shadow-sm transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          {/* Result count */}
          {!loading && !error && companies.length > 0 && (
            <p className="mb-6 text-sm text-gray-500">
              {t("companiesFound", { count: total })}
            </p>
          )}

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <Skeleton className="h-28 w-full rounded-none bg-gray-200" />
                  <div className="px-5 pb-5">
                    <Skeleton className="-mt-9 h-18 w-18 rounded-2xl border-4 border-white bg-gray-200" />
                    <Skeleton className="mt-3 h-5 w-36 bg-gray-200" />
                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-3 w-full bg-gray-200" />
                      <Skeleton className="h-3 w-5/6 bg-gray-200" />
                      <Skeleton className="h-3 w-2/3 bg-gray-200" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-3 w-28 bg-gray-200" />
                      <Skeleton className="h-3 w-24 bg-gray-200" />
                    </div>
                    <Skeleton className="mt-5 h-9 w-full rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="rounded-2xl border-2 border-gray-100 bg-white py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {t("companiesErrorTitle")}
              </h3>
              <p className="mb-6 text-gray-500">{t("companiesErrorText")}</p>
              <button
                onClick={() => setSearch((s) => s)}
                className="rounded-xl bg-primary-500 px-6 py-2.5 font-medium text-white transition hover:bg-primary-600"
              >
                {t("companiesRetry")}
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && companies.length === 0 && (
            <div className="rounded-2xl border-2 border-gray-100 bg-white py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {t("companiesEmptyTitle")}
              </h3>
              <p className="mb-6 text-gray-500">{t("companiesEmptyText")}</p>
              {search && (
                <button
                  onClick={() => setSearchInput("")}
                  className="rounded-xl bg-primary-500 px-6 py-2.5 font-medium text-white transition hover:bg-primary-600"
                >
                  {t("companiesClearSearch")}
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && companies.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CompanyCard key={0} company={companyOfMoth[0]} featured />
              <CompanyCard key={1} company={companyOfMoth[1]} featured />
              {companies.map((company) => (
                <CompanyCard key={company.employer_id} company={company} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <DashJobPostsPagination
              totalPages={totalPages}
              page={page}
              setPage={setPage}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Companies;

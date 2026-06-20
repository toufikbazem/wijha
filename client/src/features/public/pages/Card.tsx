import { Users, Building2, Tag, Crown } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export interface Company {
  user_id: string;
  employer_id: string;
  company_name: string;
  industry?: string | null;
  address?: string | null;
  size?: string | null;
  founding_year?: number | string | null;
  logo?: string | null;
  cover_image?: string | null;
  description?: string | null;
}

export default function CompanyCard({
  company,
  featured = false,
}: {
  company: Company;
  featured?: boolean;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation("public");

  const { company_name, industry, size, logo, cover_image, description } =
    company;

  const placeholder = t("notSpecified");

  const goToProfile = () => navigate(`/companyProfile/${company.user_id}`);

  return (
    <div
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white transition-all ${
        featured
          ? "border-2 border-amber-400 shadow-lg ring-1 ring-amber-400/10 hover:shadow-2xl hover:ring-amber-400/30"
          : "border border-gray-100 shadow-sm hover:shadow-xl"
      }`}
    >
      {/* Company of the month badge */}
      {featured && (
        <div className="absolute inset-e-3 top-3 z-10 flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-yellow-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
          <Crown className="h-3 w-3 fill-current" />
          {t("companyOfTheMonth", "Company of the Month")}
        </div>
      )}

      {/* Cover / banner */}
      <div
        onClick={goToProfile}
        className="relative h-28 w-full cursor-pointer overflow-hidden"
      >
        {cover_image ? (
          <img
            src={cover_image}
            alt={company_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary-600 via-primary-500 to-primary-600" />
        )}
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5">
        {/* Logo overlapping the banner */}
        <div
          onClick={goToProfile}
          className={`-mt-9 flex h-18 w-18 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md ${
            logo ? "" : "bg-primary-500"
          }`}
        >
          {logo ? (
            <img
              src={logo}
              alt={company_name}
              className="h-full w-full rounded-xl object-contain"
            />
          ) : (
            <Building2 className="h-8 w-8 text-white" />
          )}
        </div>

        {/* Company name + verified badge */}
        <div className="mt-3 flex items-center gap-1.5">
          <h2
            onClick={goToProfile}
            className="cursor-pointer truncate text-xl font-bold leading-tight tracking-tight text-gray-900 hover:text-primary-500"
          >
            {company_name}
          </h2>
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-3 min-h-15 text-sm leading-relaxed text-gray-500">
          {description}
        </p>

        {/* Meta: industry + size */}
        <div className="mt-4 flex flex-col gap-1.5 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {industry ? t(industry) : placeholder}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {size
                ? `${size} ${t("companyEmployees", "Employees")}`
                : placeholder}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={goToProfile}
          className={`mt-5 flex w-full cursor-pointer items-center justify-center rounded-lg border py-2 text-sm font-semibold transition-all ${
            featured
              ? "border-transparent bg-linear-to-r from-amber-400 to-yellow-500 text-white shadow-sm hover:from-amber-500 hover:to-yellow-600"
              : "border-gray-200 bg-white text-gray-700 hover:border-primary-500 hover:text-primary-600"
          }`}
        >
          {t("viewProfile")}
        </button>
      </div>
    </div>
  );
}

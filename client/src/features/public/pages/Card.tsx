import { MapPin, Users, Calendar, Building2 } from "lucide-react";
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
}

export default function CompanyCard({ company }: { company: Company }) {
  const navigate = useNavigate();
  const { t } = useTranslation("public");

  const { company_name, industry, address, size, founding_year, logo } =
    company;

  const placeholder = t("notSpecified");

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
      <div className="relative flex flex-1 flex-col p-7">
        {/* Logo + industry tag */}
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${
              logo ? "bg-white" : "bg-primary-500"
            } text-white shadow-sm border border-gray-100`}
          >
            {logo ? (
              <img
                src={logo}
                alt={company_name}
                className="h-full w-full rounded-lg object-contain"
              />
            ) : (
              <Building2 className="h-7 w-7" />
            )}
          </div>
          <div className="min-w-0 text-xs font-medium tracking-wide">
            {/* Company name */}
            <h2 className="truncate text-xl font-bold leading-tight tracking-tight text-gray-900">
              {company_name}
            </h2>
            <p className="truncate text-gray-500">
              {industry ? t(industry) : placeholder}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 flex flex-col gap-4 text-sm">
          {/* Location */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-500 border border-gray-100 bg-primary-50">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider">
                {t("companyLocation")}
              </p>
              <p className="truncate">{address || placeholder}</p>
            </div>
          </div>

          {/* Size */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-500 border border-gray-100 bg-primary-50">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider">
                {t("companySize")}
              </p>
              <p className="truncate">{size || placeholder}</p>
            </div>
          </div>

          {/* Founded */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-500 border border-gray-100 bg-primary-50">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider font_regular">
                {t("companyFounded")}
              </p>
              <p className="truncate">
                {founding_year && founding_year !== 0
                  ? founding_year
                  : placeholder}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(`/companyProfile/${company.user_id}`)}
          className="mt-7 flex w-full cursor-pointer items-center justify-center rounded-sm bg-primary-50 py-2 text-sm font-semibold text-primary-500 transition-all hover:text-primary-600"
        >
          {t("viewProfile")}
        </button>
      </div>
    </div>
  );
}

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Calendar,
  Factory,
  Globe,
  Mail,
  MapPin,
  Phone,
  Share2,
  Users,
} from "lucide-react";

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-[#008CBA] mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-800 break-words">{value}</p>
      </div>
    </div>
  );
}

function StepReviewEmployer({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const v = form.watch();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t("reviewSubmit")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("reviewSubmitSubtitle")}</p>
      </div>

      {/* Company card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-4">
          {v.logo ? (
            <img
              src={v.logo}
              alt="logo"
              className="w-16 h-16 rounded-xl object-cover bg-white border"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate">
              {v.companyName || "—"}
            </h3>
            <p className="text-sm text-[#008CBA] font-medium truncate">
              {v.industry ? tc(v.industry) : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Account & contact */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {t("accountContact")}
        </h4>
        <Row icon={Mail} label={t("emailAddress")} value={v.email} />
        <Row icon={Phone} label={t("phoneNumber")} value={v.phoneNumber} />
        <Row icon={MapPin} label={tc("address")} value={v.address} />
        <Row icon={Share2} label={t("linkedinUrl")} value={v.linkedin} />
        <Row icon={Globe} label={t("websiteUrl")} value={v.website} />
      </div>

      {/* Company details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {t("companyDetails")}
        </h4>
        <Row icon={Users} label={t("companySize")} value={v.size} />
        <Row icon={Calendar} label={t("foundingYear")} value={v.foundingYear} />
        <Row
          icon={Factory}
          label={tc("industry")}
          value={v.industry ? tc(v.industry) : ""}
        />
        {v.description && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">
              {t("companyDescription")}
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {v.description}
            </p>
          </div>
        )}
        {Array.isArray(v.missions) && v.missions.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">{t("missions")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {v.missions.map((item: string, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-[#008CBA10] border-t-2 border-[#008CBA]"
                >
                  <p className="text-sm text-gray-700 break-words">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="pt-2">
        <Controller
          name="termsAndConditions"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <Field orientation="horizontal">
                <Checkbox
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="input-checkbox"
                />
                <FieldLabel className="text-sm text-gray-600">
                  {t("iAgreeToThe")}{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#008CBA] hover:text-[#00668C] underline underline-offset-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("termsLinkLabel")}
                  </a>
                </FieldLabel>
              </Field>
              {fieldState.invalid && (
                <FieldError className="mt-2" errors={[fieldState.error]} />
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default StepReviewEmployer;

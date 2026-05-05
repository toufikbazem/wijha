import { Building2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { FieldError } from "@/components/ui/field";

function StepAccountType({ form }: { form: any }) {
  const { t } = useTranslation("auth");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">{t("registerAs")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("chooseAccountType")}</p>
      </div>

      <Controller
        name="accountType"
        control={form.control}
        render={({ field, fieldState }) => (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => field.onChange("jobseeker")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer text-center ${
                  field.value === "jobseeker"
                    ? "border-[#008CBA] bg-[#E6F7FB] shadow-md"
                    : "border-gray-200 hover:border-[#B3E6F5] hover:bg-gray-50"
                }`}
              >
                <User
                  className={`mx-auto mb-3 ${
                    field.value === "jobseeker"
                      ? "text-[#008CBA]"
                      : "text-gray-400"
                  }`}
                  size={32}
                />
                <h3 className="font-semibold text-gray-900">{t("jobSeeker")}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t("lookingForOpportunities")}
                </p>
              </button>

              <button
                type="button"
                onClick={() => field.onChange("employer")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer text-center ${
                  field.value === "employer"
                    ? "border-[#008CBA] bg-[#E6F7FB] shadow-md"
                    : "border-gray-200 hover:border-[#B3E6F5] hover:bg-gray-50"
                }`}
              >
                <Building2
                  className={`mx-auto mb-3 ${
                    field.value === "employer"
                      ? "text-[#008CBA]"
                      : "text-gray-400"
                  }`}
                  size={32}
                />
                <h3 className="font-semibold text-gray-900">{t("employer")}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t("hiringTalent")}
                </p>
              </button>
            </div>

            {fieldState.invalid && (
              <FieldError className="mt-3" errors={[fieldState.error]} />
            )}
          </div>
        )}
      />
    </div>
  );
}

export default StepAccountType;

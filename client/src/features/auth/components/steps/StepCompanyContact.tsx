import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Globe, Phone, Share2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

function StepCompanyContact({ form }: { form: any }) {
  const { t } = useTranslation("auth");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("companyContact")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("companyContactSubtitle")}
        </p>
      </div>

      <Controller
        name="phoneNumber"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{t("phoneNumber")}</FieldLabel>
            <div className="relative">
              <Phone className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="0X XX XX XX XX"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="linkedin"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">
              {t("linkedinUrl")}{" "}
              <span className="text-gray-400 font-normal">
                ({t("optional")})
              </span>
            </FieldLabel>
            <div className="relative">
              <Share2 className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                placeholder="https://linkedin.com/company/your-company"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="website"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">
              {t("websiteUrl")}{" "}
              <span className="text-gray-400 font-normal">
                ({t("optional")})
              </span>
            </FieldLabel>
            <div className="relative">
              <Globe className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                placeholder="https://yourcompany.com"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}

export default StepCompanyContact;

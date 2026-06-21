import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AddressCombobox } from "@/components/ui/address-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Calendar, Factory, Users } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { companySize, industries } from "@/utils/data";
import i18n from "@/i18n/i18n";

function StepCompanyInfo({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const { t: tr } = useTranslation("error");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("companyInformation")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("companyInformationSubtitle")}
        </p>
      </div>

      <Controller
        name="companyName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{t("companyName")}</FieldLabel>
            <div className="relative">
              <Building2 className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder={t("enterCompanyName")}
              />
            </div>
            {fieldState.invalid && (
              <FieldError
                errors={[{ message: tr(fieldState.error?.message ?? "") }]}
              />
            )}
          </Field>
        )}
      />

      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{tc("address")}</FieldLabel>
            <AddressCombobox
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
              variant="default"
            />
            {fieldState.invalid && (
              <FieldError
                errors={[{ message: tr(fieldState.error?.message ?? "") }]}
              />
            )}
          </Field>
        )}
      />

      <div className="flex flex-col sm:flex-row gap-5">
        <Controller
          name="industry"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-1">
              <FieldLabel className="input-label">{tc("industry")}</FieldLabel>
              <div className="relative">
                <Factory className="input-icon" size={20} />
                <Select
                  dir={i18n.dir()}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="input"
                  >
                    <SelectValue placeholder={tc("selectIndustry")} />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {tc(industry)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {fieldState.invalid && (
              <FieldError
                errors={[{ message: tr(fieldState.error?.message ?? "") }]}
              />
            )}
            </Field>
          )}
        />

        <Controller
          name="size"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-1">
              <FieldLabel className="input-label">
                {t("companySize")}
              </FieldLabel>
              <div className="relative">
                <Users className="input-icon" size={20} />
                <Select
                  dir={i18n.dir()}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="input"
                  >
                    <SelectValue placeholder={t("selectCompanySize")} />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    {companySize.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {fieldState.invalid && (
              <FieldError
                errors={[{ message: tr(fieldState.error?.message ?? "") }]}
              />
            )}
            </Field>
          )}
        />
      </div>

      <Controller
        name="foundingYear"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{t("foundingYear")}</FieldLabel>
            <div className="relative">
              <Calendar className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="YYYY"
                maxLength={4}
              />
            </div>
            {fieldState.invalid && (
              <FieldError
                errors={[{ message: tr(fieldState.error?.message ?? "") }]}
              />
            )}
          </Field>
        )}
      />
    </div>
  );
}

export default StepCompanyInfo;

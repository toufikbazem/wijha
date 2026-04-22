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
import { companySize, industries } from "@/utils/data";
import { Building2, Factory, Phone, Users } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

function EmployerRegisterForm({ form }: { form: any }) {
  const { t } = useTranslation("auth");

  return (
    <div className="flex flex-col gap-5 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("companyInformation")}
      </h3>

      {/* Company Name */}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Phone Number */}
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
                placeholder="+213 123 456 789"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* address */}
      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{t("address", { ns: "common" })}</FieldLabel>
            <AddressCombobox
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
              variant="default"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Industry */}
        <Controller
          name="industry"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">{t("industry", { ns: "common" })}</FieldLabel>
              <div className="relative">
                <Factory className="input-icon" size={20} />
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="input"
                  >
                    <SelectValue placeholder={t("selectIndustry", { ns: "common" })} />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Company Size */}
        <Controller
          name="size"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">{t("companySize")}</FieldLabel>
              <div className="relative">
                <Users className="input-icon" size={20} />
                <Select
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}

export default EmployerRegisterForm;

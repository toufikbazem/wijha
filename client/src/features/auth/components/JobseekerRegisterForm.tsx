import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AddressCombobox } from "@/components/ui/address-combobox";
import { IdCard, Phone, User } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

function JobseekerRegisterForm({ form }: { form: any }) {
  const { t } = useTranslation("auth");

  return (
    <div className="space-y-5 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("personalInformation")}
      </h3>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* First Name */}
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">{t("firstName")}</FieldLabel>
              <div className="relative">
                <User className="input-icon" size={20} />
                <Input
                  type="text"
                  className="input"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={t("enterFirstName")}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Last Name */}
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">{t("lastName")}</FieldLabel>
              <div className="relative">
                <User className="input-icon" size={20} />
                <Input
                  type="text"
                  className="input"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={t("enterLastName")}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* Professional Title */}
      <Controller
        name="professionalTitle"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">
              {t("professionalTitle")}
            </FieldLabel>
            <div className="relative">
              <IdCard className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder={t("enterProfessionalTitle")}
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
            <FieldLabel className="input-label">
              {t("address", { ns: "common" })}
            </FieldLabel>
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
    </div>
  );
}

export default JobseekerRegisterForm;

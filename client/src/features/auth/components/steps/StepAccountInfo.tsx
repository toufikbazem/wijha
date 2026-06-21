import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

function StepAccountInfo({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tr } = useTranslation("error");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("accountInformation")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("accountInformationSubtitle")}
        </p>
      </div>

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{t("emailAddress")}</FieldLabel>
            <div className="relative">
              <Mail className="input-icon" size={20} />
              <Input
                type="email"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="example@email.com"
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
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{t("password")}</FieldLabel>
            <div className="relative">
              <Lock className="input-icon" size={20} />
              <Input
                type={showPassword ? "text" : "password"}
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="**********"
              />
              {showPassword ? (
                <EyeOff
                  className="input-icon-right"
                  size={20}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="input-icon-right"
                  size={20}
                  onClick={() => setShowPassword(true)}
                />
              )}
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
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">
              {t("confirmPassword")}
            </FieldLabel>
            <div className="relative">
              <Lock className="input-icon" size={20} />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="**********"
              />
              {showConfirmPassword ? (
                <EyeOff
                  className="input-icon-right"
                  size={20}
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <Eye
                  className="input-icon-right"
                  size={20}
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
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

export default StepAccountInfo;

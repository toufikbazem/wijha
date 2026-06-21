import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfessionalTitleCombobox } from "@/components/ui/professional-title-combobox";
import { educationLevels, experienceLevels } from "@/utils/data";
import { Briefcase, Share2, TrendingUp } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

function StepProfessionalInfo({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const { t: td } = useTranslation("data");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("professionalInformation")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("professionalInformationSubtitle")}
        </p>
      </div>

      <Controller
        name="professionalTitle"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">
              {t("professionalTitle")}
            </FieldLabel>
            <ProfessionalTitleCombobox
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
              placeholder={t("enterProfessionalTitle")}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex flex-col sm:flex-row gap-5">
        <Controller
          name="educationLevel"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-1">
              <FieldLabel className="input-label">
                {tc("educationLevel")}
              </FieldLabel>
              <div className="relative">
                <Briefcase className="input-icon" size={20} />
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
                    <SelectValue placeholder={tc("selectEducationLevel")} />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {td(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="experienceLevel"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className=" flex-1">
              <FieldLabel className="input-label">
                {tc("experienceLevel")}
              </FieldLabel>
              <div className="relative">
                <TrendingUp className="input-icon" size={20} />
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
                    <SelectValue placeholder={tc("selectExperienceLevel")} />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {td(level)}
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
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="professionalSummary"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">
              {t("professionalSummaryLabel")}{" "}
              <span className="text-gray-400 font-normal">
                ({t("optional")})
              </span>
            </FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              rows={4}
              placeholder={t("professionalSummaryPlaceholder")}
              className="text-[16px] w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CBA] focus:border-transparent outline-none transition resize-none"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}

export default StepProfessionalInfo;

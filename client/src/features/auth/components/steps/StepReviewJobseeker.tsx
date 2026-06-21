import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Award,
  Briefcase,
  CheckCircle2,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Share2,
  User,
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

function StepReviewJobseeker({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const { t: td } = useTranslation("data");
  const { t: tr } = useTranslation("error");
  const v = form.watch();

  const fullName = [v.firstName, v.lastName].filter(Boolean).join(" ");
  const experiences: any[] = v.experiences || [];
  const educations: any[] = v.educations || [];
  const skills: string[] = v.skills || [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t("reviewSubmit")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("reviewSubmitSubtitle")}</p>
      </div>

      {/* Identity card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-4">
          {v.profileImage ? (
            <img
              src={v.profileImage}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover bg-white border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate">
              {fullName || "—"}
            </h3>
            <p className="text-sm text-[#008CBA] font-medium truncate">
              {v.professionalTitle}
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
      </div>

      {/* Professional */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {t("professionalInformation")}
        </h4>
        <Row
          icon={GraduationCap}
          label={tc("educationLevel")}
          value={v.educationLevel ? td(v.educationLevel) : ""}
        />
        <Row
          icon={Briefcase}
          label={tc("experienceLevel")}
          value={v.experienceLevel ? td(v.experienceLevel) : ""}
        />
        {v.professionalSummary && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">
              {t("professionalSummaryLabel")}
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {v.professionalSummary}
            </p>
          </div>
        )}
      </div>

      {/* Experiences */}
      {experiences.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {t("experiences")} ({experiences.length})
          </h4>
          <div className="space-y-2">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="text-sm">
                <p className="font-semibold text-gray-900">{exp.title}</p>
                <p className="text-[#008CBA]">{exp.company}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {t("education")} ({educations.length})
          </h4>
          <div className="space-y-2">
            {educations.map((edu: any, i: number) => (
              <div key={i} className="text-sm">
                <p className="font-semibold text-gray-900">{edu.degree}</p>
                <p className="text-[#008CBA]">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#008CBA]" />
            {t("skills")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((s: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#E6F7FB] text-[#008CBA] rounded-full text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CV */}
      {v.cv && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#008CBA]" />
            <p className="text-sm font-medium text-gray-800 flex-1">
              {t("cvFileName")}
            </p>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
        </div>
      )}

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
                <FieldError
                  className="mt-2"
                  errors={[{ message: tr(fieldState.error?.message ?? "") }]}
                />
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default StepReviewJobseeker;

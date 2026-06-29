import { FieldError } from "@/components/ui/field";
import { SkillCombobox } from "@/components/ui/skill-combobox";
import { Award, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { skillSchema, skillsSchema } from "../../schema";

function StepSkills({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tr } = useTranslation("error");
  const skills: string[] = form.watch("skills") || [];
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addSkill = (value?: string) => {
    const trimmed = (value ?? draft).trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setDraft("");
      setError(null);
      return;
    }

    const result = skillSchema.safeParse(trimmed);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const next = [...skills, trimmed];
    // Guard against exceeding the array max (e.g. 30 skills).
    const listResult = skillsSchema.safeParse(next);
    if (!listResult.success) {
      setError(listResult.error.issues[0].message);
      return;
    }

    form.setValue("skills", next, { shouldDirty: true });
    form.clearErrors("skills");
    setDraft("");
    setError(null);
  };

  const removeSkill = (idx: number) => {
    form.setValue(
      "skills",
      skills.filter((_, i) => i !== idx),
      { shouldDirty: true },
    );
    setError(null);
  };

  // Clear the inline error as the user edits the draft.
  const handleDraftChange = (value: string) => {
    setDraft(value);
    if (error) setError(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t("skills")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("skillsSubtitle")}</p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <SkillCombobox
            value={draft}
            onChange={handleDraftChange}
            onSelect={(label) => addSkill(label)}
            onPlainEnter={() => addSkill()}
            placeholder={t("addSkillPlaceholder")}
          />
          <button
            type="button"
            onClick={() => addSkill()}
            className="flex items-center gap-2 px-4 py-2 bg-[#008CBA] hover:bg-[#007399] text-white rounded-lg transition text-sm font-medium cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            {t("add")}
          </button>
        </div>
        {error && <FieldError errors={[{ message: tr(error) }]} />}
      </div>

      {skills.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-3">
            <Award className="w-7 h-7 text-[#008CBA]" />
          </div>
          <p className="text-gray-800 font-semibold mb-1">{t("noSkillsYet")}</p>
          <p className="text-sm text-gray-500">{t("noSkillsYetDesc")}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className="px-3 py-1.5 bg-[#E6F7FB] text-[#008CBA] rounded-full text-sm font-medium flex items-center gap-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="hover:text-red-600 transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default StepSkills;

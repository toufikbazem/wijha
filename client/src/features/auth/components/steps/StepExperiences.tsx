import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Pen, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import { experienceDraftSchema } from "../../schema";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from(
  { length: new Date().getFullYear() - 1980 + 1 },
  (_, i) => 1980 + i,
).reverse();

const emptyExperience = {
  title: "",
  company: "",
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
  description: "",
};

function StepExperiences({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tj } = useTranslation("jobseeker");
  const { t: tc } = useTranslation("common");
  const { t: tr } = useTranslation("error");
  const experiences: any[] = form.watch("experiences") || [];
  const [draft, setDraft] = useState<any>(emptyExperience);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const resetDraft = () => {
    setDraft(emptyExperience);
    setErrors({});
    setEditIndex(null);
  };

  // Update a draft field and clear its inline error (and the cross-field date
  // error, which is surfaced on `toYear`) so it disappears as the user fixes it.
  const updateDraft = (patch: Record<string, any>) => {
    setDraft((prev: any) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key]);
      delete next.toYear;
      return next;
    });
  };

  const buildPayload = () => {
    const startDate = new Date(
      parseInt(draft.fromYear),
      parseInt(draft.fromMonth) - 1,
    );
    const endDate = new Date(
      parseInt(draft.toYear),
      parseInt(draft.toMonth) - 1,
    );
    return { startDate, endDate };
  };

  const handleSave = () => {
    const result = experienceDraftSchema.safeParse(draft);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const { startDate, endDate } = buildPayload();

    const newEntry = {
      title: draft.title,
      company: draft.company,
      from: startDate.toISOString(),
      to: endDate.toISOString(),
      description: draft.description,
    };

    const next = [...experiences];
    if (editIndex !== null) {
      next[editIndex] = newEntry;
    } else {
      next.push(newEntry);
    }
    form.setValue("experiences", next, { shouldDirty: true });
    resetDraft();
    setOpen(false);
  };

  const handleRemove = (index: number) => {
    const next = experiences.filter((_, i) => i !== index);
    form.setValue("experiences", next, { shouldDirty: true });
  };

  const startEdit = (index: number) => {
    const exp = experiences[index];
    const fromDate = new Date(exp.from);
    const toDate = new Date(exp.to);
    setDraft({
      title: exp.title,
      company: exp.company,
      fromMonth: (fromDate.getMonth() + 1).toString(),
      fromYear: fromDate.getFullYear().toString(),
      toMonth: (toDate.getMonth() + 1).toString(),
      toYear: toDate.getFullYear().toString(),
      description: exp.description || "",
    });
    setEditIndex(index);
    setOpen(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t("experiences")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("experiencesSubtitle")}</p>
      </div>

      <div className="flex justify-end">
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetDraft();
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={() => {
                resetDraft();
                setOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#008CBA] hover:bg-[#007399] text-white rounded-lg transition text-sm font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {tj("add")}
            </button>
          </DialogTrigger>
          <DialogContent
            dir={i18n.dir()}
            className="bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden"
          >
            <DialogTitle>
              {editIndex !== null
                ? t("editExperience")
                : tj("addNewExperience")}
            </DialogTitle>

            <div className="flex flex-col gap-1">
              <Label className="input-label">{tj("jobTitle")}</Label>
              <Input
                type="text"
                value={draft.title}
                placeholder={tj("jobTitle")}
                aria-invalid={!!errors.title}
                onChange={(e) => updateDraft({ title: e.target.value })}
                className="input-filter ltr:pl-2! rtl:pr-2!"
              />
              {errors.title && (
                <FieldError errors={[{ message: tr(errors.title) }]} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label className="input-label">{tj("company")}</Label>
              <Input
                type="text"
                value={draft.company}
                placeholder={tj("company")}
                aria-invalid={!!errors.company}
                onChange={(e) => updateDraft({ company: e.target.value })}
                className="input-filter ltr:pl-2! rtl:pr-2!"
              />
              {errors.company && (
                <FieldError errors={[{ message: tr(errors.company) }]} />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label className="input-label">{tj("from")}</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={draft.fromMonth}
                    onValueChange={(v) => updateDraft({ fromMonth: v })}
                  >
                    <SelectTrigger
                      dir={i18n.dir()}
                      aria-invalid={!!errors.fromMonth}
                      className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                    >
                      <SelectValue placeholder={tj("selectMonth")} />
                    </SelectTrigger>
                    <SelectContent dir={i18n.dir()} className="bg-white">
                      {months.map((m, idx) => (
                        <SelectItem key={m} value={(idx + 1).toString()}>
                          {tj(m)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={draft.fromYear}
                    onValueChange={(v) => updateDraft({ fromYear: v })}
                  >
                    <SelectTrigger
                      dir={i18n.dir()}
                      aria-invalid={!!errors.fromYear}
                      className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                    >
                      <SelectValue placeholder={tj("selectYear")} />
                    </SelectTrigger>
                    <SelectContent dir={i18n.dir()} className="bg-white">
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(errors.fromMonth || errors.fromYear) && (
                  <FieldError
                    errors={[
                      { message: tr(errors.fromMonth || errors.fromYear) },
                    ]}
                  />
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label className="input-label">{tj("to")}</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={draft.toMonth}
                    onValueChange={(v) => updateDraft({ toMonth: v })}
                  >
                    <SelectTrigger
                      dir={i18n.dir()}
                      aria-invalid={!!errors.toMonth}
                      className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                    >
                      <SelectValue placeholder={tj("selectMonth")} />
                    </SelectTrigger>
                    <SelectContent dir={i18n.dir()} className="bg-white">
                      {months.map((m, idx) => (
                        <SelectItem key={m} value={(idx + 1).toString()}>
                          {tj(m)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={draft.toYear}
                    onValueChange={(v) => updateDraft({ toYear: v })}
                  >
                    <SelectTrigger
                      dir={i18n.dir()}
                      aria-invalid={!!errors.toYear}
                      className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                    >
                      <SelectValue placeholder={tj("selectYear")} />
                    </SelectTrigger>
                    <SelectContent dir={i18n.dir()} className="bg-white">
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(errors.toMonth || errors.toYear) && (
                  <FieldError
                    errors={[{ message: tr(errors.toMonth || errors.toYear) }]}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <Label className="input-label">{tj("jobDescription")}</Label>
              <textarea
                value={draft.description}
                placeholder={tj("jobDescription")}
                rows={4}
                aria-invalid={!!errors.description}
                onChange={(e) => updateDraft({ description: e.target.value })}
                className="input-filter ltr:pl-2! rtl:pr-2! resize-none"
              />
              {errors.description && (
                <FieldError errors={[{ message: tr(errors.description) }]} />
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  className="border-[#008CBA] text-[#008CBA] hover:bg-gray-50 cursor-pointer"
                  variant="outline"
                >
                  {tc("cancel")}
                </Button>
              </DialogClose>
              <Button
                onClick={handleSave}
                className="bg-[#008CBA] hover:bg-[#007399] text-white cursor-pointer"
              >
                {tj("saveChanges")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {experiences.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-7 h-7 text-[#008CBA]" />
            </div>
            <p className="text-gray-800 font-semibold mb-1">
              {t("noExperienceYet")}
            </p>
            <p className="text-sm text-gray-500">{t("noExperienceYetDesc")}</p>
          </div>
        ) : (
          experiences.map((exp: any, index: number) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{exp.title}</h4>
                <p className="text-[#008CBA] font-semibold text-sm">
                  {exp.company}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {tj(months[new Date(exp.from).getMonth()])}{" "}
                  {new Date(exp.from).getFullYear()} —{" "}
                  {tj(months[new Date(exp.to).getMonth()])}{" "}
                  {new Date(exp.to).getFullYear()}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-2">
                    {exp.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(index)}
                  className="p-2 rounded-lg bg-[#E6F7FB] text-[#008CBA] cursor-pointer"
                >
                  <Pen className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-lg bg-red-50 text-red-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StepExperiences;

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
import { GraduationCap, Pen, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import { educationDraftSchema } from "../../schema";

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

const emptyEducation = {
  degree: "",
  institution: "",
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
  description: "",
};

function StepEducation({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tj } = useTranslation("jobseeker");
  const { t: tc } = useTranslation("common");
  const { t: tr } = useTranslation("error");
  const educations: any[] = form.watch("educations") || [];
  const [draft, setDraft] = useState<any>(emptyEducation);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const resetDraft = () => {
    setDraft(emptyEducation);
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

  const handleSave = () => {
    const result = educationDraftSchema.safeParse(draft);
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
    const startDate = new Date(
      parseInt(draft.fromYear),
      parseInt(draft.fromMonth) - 1,
    );
    const endDate = new Date(
      parseInt(draft.toYear),
      parseInt(draft.toMonth) - 1,
    );

    const newEntry = {
      degree: draft.degree,
      institution: draft.institution,
      from: startDate.toISOString(),
      to: endDate.toISOString(),
      description: draft.description,
    };

    const next = [...educations];
    if (editIndex !== null) {
      next[editIndex] = newEntry;
    } else {
      next.push(newEntry);
    }
    form.setValue("educations", next, { shouldDirty: true });
    resetDraft();
    setOpen(false);
  };

  const handleRemove = (index: number) => {
    const next = educations.filter((_, i) => i !== index);
    form.setValue("educations", next, { shouldDirty: true });
  };

  const startEdit = (index: number) => {
    const edu = educations[index];
    const fromDate = new Date(edu.from);
    const toDate = new Date(edu.to);
    setDraft({
      degree: edu.degree,
      institution: edu.institution,
      fromMonth: (fromDate.getMonth() + 1).toString(),
      fromYear: fromDate.getFullYear().toString(),
      toMonth: (toDate.getMonth() + 1).toString(),
      toYear: toDate.getFullYear().toString(),
      description: edu.description || "",
    });
    setEditIndex(index);
    setOpen(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t("education")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("educationSubtitle")}</p>
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
              {editIndex !== null ? t("editEducation") : t("addNewEducation")}
            </DialogTitle>

            <div className="flex flex-col gap-1">
              <Label className="input-label">{t("degree")}</Label>
              <Input
                type="text"
                value={draft.degree}
                placeholder={t("degree")}
                aria-invalid={!!errors.degree}
                onChange={(e) => updateDraft({ degree: e.target.value })}
                className="input-filter ltr:pl-2! rtl:pr-2!"
              />
              {errors.degree && (
                <FieldError errors={[{ message: tr(errors.degree) }]} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label className="input-label">{t("institution")}</Label>
              <Input
                type="text"
                value={draft.institution}
                placeholder={t("institution")}
                aria-invalid={!!errors.institution}
                onChange={(e) => updateDraft({ institution: e.target.value })}
                className="input-filter ltr:pl-2! rtl:pr-2!"
              />
              {errors.institution && (
                <FieldError errors={[{ message: tr(errors.institution) }]} />
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
        {educations.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-7 h-7 text-[#008CBA]" />
            </div>
            <p className="text-gray-800 font-semibold mb-1">
              {t("noEducationYet")}
            </p>
            <p className="text-sm text-gray-500">
              {t("noEducationYetDesc")}
            </p>
          </div>
        ) : (
          educations.map((edu: any, index: number) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                <p className="text-[#008CBA] font-semibold text-sm">
                  {edu.institution}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {tj(months[new Date(edu.from).getMonth()])}{" "}
                  {new Date(edu.from).getFullYear()} —{" "}
                  {tj(months[new Date(edu.to).getMonth()])}{" "}
                  {new Date(edu.to).getFullYear()}
                </p>
                {edu.description && (
                  <p className="text-sm text-gray-700 mt-2">
                    {edu.description}
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

export default StepEducation;

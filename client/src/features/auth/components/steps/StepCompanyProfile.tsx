import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Camera, PlusIcon, Upload, X } from "lucide-react";
import { Controller } from "react-hook-form";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";
import i18n from "@/i18n/i18n";

function StepCompanyProfile({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: te } = useTranslation("employer");
  const { t: tc } = useTranslation("common");
  const logoInput = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [missionDraft, setMissionDraft] = useState("");
  const [missionDraftError, setMissionDraftError] = useState<string | null>(
    null,
  );
  const [missionDialogOpen, setMissionDialogOpen] = useState(false);
  const logo = form.watch("logo");
  const missions: string[] = form.watch("missions") || [];
  // Array-level error for the missions field, produced by the schema when the
  // step is validated (e.g. on Next). Its message lives on `.message`.
  const missionsError = form.formState.errors?.missions;
  const missionsArrayError =
    missionsError && typeof missionsError.message === "string"
      ? missionsError.message
      : undefined;

  // Validate a single mission value. Returns an error message key result, or
  // null when valid. This is the per-item validation — it runs in the dialog
  // before the mission is added, since the array schema never sees a rejected
  // draft.
  const validateMissionDraft = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return te("pleaseAddMission");
    if (trimmed.length < 3) return te("missionTooShort");
    if (trimmed.length > 150) return te("missionTooLong");
    return null;
  };

  const addMission = () => {
    const value = missionDraft.trim();
    const error = validateMissionDraft(value);
    if (error) {
      setMissionDraftError(error);
      return;
    }
    form.setValue("missions", [...missions, value], {
      shouldDirty: true,
      shouldTouch: true,
    });
    setMissionDraft("");
    setMissionDraftError(null);
    setMissionDialogOpen(false);
  };

  const removeMission = (index: number) => {
    const next = missions.filter((_, i) => i !== index);
    form.setValue("missions", next, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleLogoUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 80 ? prev + 5 : prev));
    }, 150);

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("wijha")
      .upload(`public/${fileName}`, file);

    clearInterval(interval);

    if (error) {
      console.error(error.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);
    const { data } = supabase.storage
      .from("wijha")
      .getPublicUrl(`public/${fileName}`);

    if (data?.publicUrl) {
      form.setValue("logo", data.publicUrl, { shouldDirty: true });
    }

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 600);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("companyProfile")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("companyProfileSubtitle")}
        </p>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {logo ? (
            <img
              src={logo}
              alt="logo"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 rounded-2xl bg-black/55 flex flex-col items-center justify-center text-white">
              <Upload className="w-5 h-5 mb-1 animate-bounce" />
              <span className="text-xs font-bold">{progress}%</span>
            </div>
          )}

          <Input
            type="file"
            className="hidden"
            ref={logoInput}
            accept="image/*"
            onChange={handleLogoUpload}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => logoInput.current?.click()}
            className="cursor-pointer absolute bottom-0 right-0 bg-[#008CBA] text-white rounded-full p-1.5 shadow-lg hover:bg-[#00668C] transition-all"
          >
            {uploading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
        </div>
        <span className="text-xs text-gray-500">
          {t("companyLogoOptional")}
        </span>
      </div>

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">
              {t("companyDescription")}{" "}
              <span className="text-gray-400 font-normal">
                ({t("optional")})
              </span>
            </FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              rows={4}
              placeholder={t("companyDescriptionPlaceholder")}
              className="text-[16px] w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CBA] focus:border-transparent outline-none transition resize-none"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Missions */}
      <Field data-invalid={!!missionsArrayError}>
        <div className="flex items-center justify-between">
          <FieldLabel className="input-label">
            {t("missions")}{" "}
            <span className="text-gray-400 font-normal">({t("optional")})</span>
          </FieldLabel>
          <Dialog
            open={missionDialogOpen}
            onOpenChange={(v) => {
              setMissionDialogOpen(v);
              if (!v) {
                setMissionDraft("");
                setMissionDraftError(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                className="bg-[#008CBA] hover:bg-[#007399] text-white flex items-center gap-2 cursor-pointer"
              >
                <PlusIcon className="w-4 h-4" />
                {te("addMission")}
              </Button>
            </DialogTrigger>
            <DialogContent dir={i18n.dir()} className="bg-white">
              <DialogTitle>{te("addNewMission")}</DialogTitle>
              <Input
                type="text"
                placeholder={te("addNewMissionPlaceholder")}
                value={missionDraft}
                aria-invalid={!!missionDraftError}
                onChange={(e) => {
                  setMissionDraft(e.target.value);
                  if (missionDraftError) setMissionDraftError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addMission();
                  }
                }}
                className="input-filter mt-6 ltr:pl-2! rtl:pr-2!"
              />
              {missionDraftError ? (
                <FieldError
                  className="mt-2"
                  errors={[{ message: missionDraftError }]}
                />
              ) : null}
              <div className="mb-6" />
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
                  onClick={addMission}
                  className="bg-[#008CBA] hover:bg-[#007399] text-white cursor-pointer"
                >
                  {te("saveChanges")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {missions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">{t("noMissionsYet")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map((item, index) => (
              <div
                key={index}
                className="relative p-4 rounded-lg bg-[#008CBA10] border-t-3 border-[#008CBA]"
              >
                <X
                  onClick={() => removeMission(index)}
                  className="cursor-pointer absolute top-2 ltr:right-2 rtl:left-2 w-4 h-4 text-[#008CBA]"
                />
                <p className="text-sm text-gray-700 ltr:pr-5 rtl:pl-5 break-words">
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}

        {missionsArrayError ? (
          <FieldError errors={[{ message: missionsArrayError }]} />
        ) : null}
      </Field>
    </div>
  );
}

export default StepCompanyProfile;

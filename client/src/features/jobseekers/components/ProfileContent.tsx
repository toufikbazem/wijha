import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import {
  ArrowUp,
  Award,
  Globe,
  Link2,
  Plus,
  Share2,
  Upload,
  X,
  Download,
  FileText,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProfileLanguage from "./ProfileLanguage";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

function ProfileContent({
  profile,
  setProfile,
  isEditing,
  form,
  experiences,
  setExperiences,
  educations,
  setEducations,
  languages,
  setLanguages,
}: any) {
  const { t } = useTranslation("jobseeker");
  const [skill, setSkill] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUploadProgress, setCvUploadProgress] = useState(0);

  const handleCVUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setCvUploading(true);
    setCvUploadProgress(0);

    // Simulate early progress while waiting for upload
    const progressInterval = setInterval(() => {
      setCvUploadProgress((prev) => (prev < 80 ? prev + 5 : prev));
    }, 150);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("CV")
      .upload(`public/${fileName}`, file);

    clearInterval(progressInterval);

    if (error) {
      console.error(error.message);
      setCvUploading(false);
      setCvUploadProgress(0);
      return;
    }

    setCvUploadProgress(100);

    const { data } = supabase.storage
      .from("CV")
      .getPublicUrl(`public/${fileName}`);

    if (!data?.publicUrl) {
      setCvUploading(false);
      setCvUploadProgress(0);
      return;
    }

    form.setValue("cv", data.publicUrl, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setProfile(form.getValues());

    setTimeout(() => {
      setCvUploading(false);
      setCvUploadProgress(0);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Professional Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#008CBA] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">
              {t("professionalSummary")}
            </h3>
          </div>
          {isEditing ? (
            <Controller
              name="professional_summary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="relative">
                    <Textarea
                      placeholder={t("professionalSummaryPlaceholder")}
                      {...field}
                      className="h-[446px] text-[16px] w-full  px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CBA] focus:border-transparent outline-none transition"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {profile.professional_summary || t("noProfessionalSummary")}
            </p>
          )}
        </div>

        {/* Experience */}
        <ProfileExperience
          isEditing={isEditing}
          experiences={experiences}
          setExperiences={setExperiences}
        />

        {/* Education */}
        <ProfileEducation
          isEditing={isEditing}
          educations={educations}
          setEducations={setEducations}
        />

        {/* CV Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-[#008CBA] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">
              {t("cvSection")}
            </h3>
          </div>

          <input
            type="file"
            id="cv-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleCVUpload}
            disabled={cvUploading}
          />

          {/* Uploading state */}
          {cvUploading && (
            <div className="rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#E6F7FB] flex items-center justify-center shrink-0">
                  <Upload className="w-6 h-6 text-[#008CBA] animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {t("cvUploading")}
                  </p>
                  <p className="text-xs text-gray-500">{cvUploadProgress}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#008CBA] transition-all duration-200"
                  style={{ width: `${cvUploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* CV exists state */}
          {!cvUploading && profile.cv && (
            <div className="rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E6F7FB] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#008CBA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {t("cvFileName")}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <p className="text-xs text-green-600 font-medium">
                      {t("cvUploadSuccess")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#008CBA] text-[#008CBA] text-sm font-medium hover:bg-[#E6F7FB] transition"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {t("viewDownloadCV")}
                    </span>
                  </a>
                  {isEditing && (
                    <label
                      htmlFor="cv-upload"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#008CBA] text-white text-sm font-medium hover:bg-[#007399] transition cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">{t("replaceCV")}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No CV state */}
          {!cvUploading && !profile.cv && (
            <div className="rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#008CBA]" />
              </div>
              <p className="text-gray-800 font-semibold mb-1">
                {t("noCVAvailable")}
              </p>
              <p className="text-sm text-gray-500 mb-5">{t("noCVDesc")}</p>
              {isEditing && (
                <label
                  htmlFor="cv-upload"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008CBA] text-white text-sm font-medium hover:bg-[#007399] transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  {t("uploadCV")}
                </label>
              )}
              {!isEditing && (
                <p className="text-xs text-gray-400">{t("cvFormats")}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-[#008CBA]" />
            <h3 className="text-lg font-bold text-gray-900">{t("links")}</h3>
          </div>

          <div className="space-y-3">
            {isEditing ? (
              <>
                <Controller
                  name="linkedin"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="relative">
                        <Share2 className="input-icon-filter h-4 w-4" />
                        <Input
                          {...field}
                          type="text"
                          className="input-filter text-3xl font-bold"
                          aria-invalid={fieldState.invalid}
                          placeholder={t("linkedinPlaceholder")}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="github"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="relative">
                        <Share2 className="input-icon-filter h-4 w-4" />
                        <Input
                          {...field}
                          type="text"
                          className="input-filter text-3xl font-bold"
                          aria-invalid={fieldState.invalid}
                          placeholder={t("githubPlaceholder")}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="portfolio"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="relative">
                        <Share2 className="input-icon-filter h-4 w-4" />
                        <Input
                          {...field}
                          type="text"
                          className="input-filter text-3xl font-bold"
                          aria-invalid={fieldState.invalid}
                          placeholder={t("portfolioPlaceholder")}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </>
            ) : (
              <>
                {/* LinkedIn */}
                <Link
                  to={profile.linkedin ? profile.linkedin : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition group"
                >
                  {profile.linkedin ? (
                    <>
                      <Share2 className="w-5 h-5 text-primary-500" />
                      <span className="whitespace-nowrap overflow-hidden text-sm text-gray-700 group-hover:text-primary-500 transition">
                        {profile.linkedin}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5 text-primary-500" />
                      <span className="whitespace-nowrap overflow-hidden text-sm text-gray-700 group-hover:text-primary-500 transition">
                        {t("linkedinNotAvailable")}
                      </span>
                    </>
                  )}
                </Link>
                <Link
                  to={profile.github ? profile.github : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition group"
                >
                  {profile.github ? (
                    <>
                      <Share2 className="w-5 h-5 text-primary-500" />
                      <span className="whitespace-nowrap overflow-hidden text-sm text-gray-700 group-hover:text-primary-500 transition">
                        {profile.github}
                      </span>
                      <ArrowUp className="w-3 h-3 text-gray-500" />
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5 text-primary-500" />
                      <span className="whitespace-nowrap overflow-hidden text-sm text-gray-700 group-hover:text-primary-500 transition text-ellipsis">
                        {t("githubNotAvailable")}
                      </span>
                    </>
                  )}
                </Link>
                <Link
                  to={`${profile.portfolio ? profile.portfolio : "#"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg  transition group"
                >
                  {profile.portfolio ? (
                    <>
                      <Globe className="w-5 h-5 text-primary-500" />
                      <span className="whitespace-nowrap overflow-hidden text-sm text-gray-700 group-hover:text-primary-500 transition">
                        {profile.portfolio}
                      </span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-5 h-5 text-primary-500" />
                      <span className="whitespace-nowrap overflow-hidden text-sm text-gray-700 group-hover:text-primary-500 transition">
                        {t("portfolioNotAvailable")}
                      </span>
                    </>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Languages */}
        <ProfileLanguage
          isEditing={isEditing}
          languages={languages}
          setLanguages={setLanguages}
        />

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#008CBA]" />
              <h3 className="text-lg font-bold text-gray-900">{t("skills")}</h3>
            </div>
            {isEditing && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#008CBA] hover:bg-[#007399] text-white rounded-lg  transition text-sm font-medium">
                    <Plus className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent
                  dir={i18n.dir()}
                  className="bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden"
                >
                  <DialogTitle>{t("addSkill")}</DialogTitle>
                  <div className="flex flex-col gap-1">
                    <Label className="input-label">{t("skill")}</Label>
                    <Input
                      type="text"
                      placeholder={t("skill")}
                      onChange={(e) => setSkill(e.target.value)}
                      className="input-filter ltr:pl-2! rtl:pr-2!"
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        className="border-[#008CBA] text-[#008CBA] hover:bg-gray-50 cursor-pointer"
                        variant="outline"
                      >
                        {t("cancel", { ns: "common" })}
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          form.setValue(
                            "skills",
                            [...(form.getValues("skills") || []), skill],
                            {
                              shouldDirty: true,
                              shouldTouch: true,
                            },
                          );
                          setProfile(form.getValues());
                        }}
                        className="bg-[#008CBA] hover:bg-[#007399] text-white cursor-pointer"
                      >
                        {t("saveChanges")}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-[#E6F7FB] text-[#008CBA] rounded-full text-sm font-medium flex items-center gap-2 hover:shadow-md transition"
              >
                {skill}
                {isEditing && (
                  <button
                    onClick={() => {
                      const updatedSkills = form
                        .getValues("skills")
                        ?.filter((_, i) => i !== index);
                      form.setValue("skills", updatedSkills || [], {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      setProfile(form.getValues());
                    }}
                    className="hover:text-red-600 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileContent;

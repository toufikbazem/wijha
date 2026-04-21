import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import {
  ArrowUp,
  Award,
  ArrowUp01,
  Globe,
  Link2,
  Plus,
  Share2,
  Upload,
  X,
  ArrowUpRight,
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

  const handleCVUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("CV")
      .upload(`public/${fileName}`, file);

    if (error) {
      console.error(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("CV")
      .getPublicUrl(`public/${fileName}`);

    if (!data?.publicUrl) return;

    data &&
      form.setValue("CV", data.publicUrl, {
        shouldDirty: true,
        shouldTouch: true,
      });

    setProfile(form.getValues());
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
                      placeholder="Company Description"
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
              {profile.professional_summary ||
                t("noProfessionalSummary")}
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

        {/* CV Upload */}
        <div className="border-2 border-dashed border-[#B3E6F5] rounded-xl p-8 text-center bg-white/50 hover:bg-white/70 transition">
          {isEditing ? (
            <>
              <input
                type="file"
                id="cv-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
              />

              <label htmlFor="cv-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-[#008CBA] mb-3" />
                <p className="text-gray-700 font-semibold mb-1">
                  {profile.cv
                    ? "✓ " + t("cvUploadSuccess")
                    : t("cvLabel")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("cvFormats")}
                </p>
              </label>
            </>
          ) : (
            <>
              {profile.cv ? (
                <a
                  href={profile.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-col items-center gap-2 text-[#008CBA] hover:underline"
                >
                  <Upload className="w-12 h-12" />
                  <span className="font-semibold">
                    {t("viewDownloadCV")}
                  </span>
                </a>
              ) : (
                <p className="text-gray-500">{t("noCVAvailable")}</p>
              )}
            </>
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
                          placeholder="LinkedIn URL"
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
                          placeholder="Github URL"
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
                          placeholder="Portfolio URL"
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
                <DialogContent className="bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden">
                  <DialogTitle>{t("addSkill")}</DialogTitle>
                  <div className="flex flex-col gap-1">
                    <Label className="input-label">{t("skill")}</Label>
                    <Input
                      type="text"
                      placeholder={t("skill")}
                      onChange={(e) => setSkill(e.target.value)}
                      className="input-filter pl-2!"
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

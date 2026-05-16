import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Mail,
  Phone,
  Share2,
  Link2,
  Award,
  FileText,
  Download,
  X,
  Upload,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import JobSeekerExperienceSection from "./JobSeekerExperienceSection";
import JobSeekerEducationSection from "./JobSeekerEducationSection";
import JobSeekerLanguageSection from "./JobSeekerLanguageSection";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 bg-[#008CBA] rounded-full" />
      <h3 className="text-xl font-bold text-gray-900">{children}</h3>
    </div>
  );
}

export default function ProfileTab({
  profile,
  isEditing,
  form,
  setProfile,
  experiences,
  setExperiences,
  educations,
  setEducations,
  languages,
  setLanguages,
}: {
  profile: any;
  isEditing: boolean;
  form: any;
  setProfile: (updater: (prev: any) => any) => void;
  experiences: any[];
  setExperiences: (next: any[]) => void;
  educations: any[];
  setEducations: (next: any[]) => void;
  languages: any[];
  setLanguages: (next: any[]) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Professional summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <SectionTitle>Professional Summary</SectionTitle>
          {isEditing ? (
            <Controller
              name="professional_summary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    placeholder="Professional summary"
                    className="min-h-32"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {profile.professional_summary || "No professional summary."}
            </p>
          )}
        </div>

        {/* Experience */}
        <JobSeekerExperienceSection
          isEditing={isEditing}
          userId={profile.id}
          experiences={experiences}
          setExperiences={setExperiences}
        />

        {/* Education */}
        <JobSeekerEducationSection
          isEditing={isEditing}
          userId={profile.id}
          educations={educations}
          setEducations={setEducations}
        />

        {/* CV */}
        <CVSection
          profile={profile}
          form={form}
          setProfile={setProfile}
          isEditing={isEditing}
        />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-[#008CBA]" />
            <h3 className="text-lg font-bold text-gray-900">Contacts</h3>
          </div>

          <div className="space-y-3">
            {isEditing ? (
              <>
                <Controller
                  name="phone_number"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Phone</FieldLabel>
                      <Input {...field} placeholder="Phone number" />
                    </Field>
                  )}
                />
                <Controller
                  name="linkedin"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>LinkedIn</FieldLabel>
                      <Input {...field} placeholder="LinkedIn URL" />
                    </Field>
                  )}
                />
              </>
            ) : (
              <>
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Mail className="w-5 h-5 text-[#008CBA]" />
                    <span className="text-sm text-gray-700 truncate">
                      {profile.email}
                    </span>
                  </a>
                )}
                {profile.phone_number && (
                  <a
                    href={`tel:${profile.phone_number}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Phone className="w-5 h-5 text-[#008CBA]" />
                    <span className="text-sm text-gray-700">
                      {profile.phone_number}
                    </span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Share2 className="w-5 h-5 text-[#008CBA]" />
                    <span className="text-sm text-gray-700 truncate">
                      {profile.linkedin}
                    </span>
                  </a>
                )}
                {!profile.email && !profile.phone_number && !profile.linkedin && (
                  <p className="text-sm text-gray-500">No contact info.</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Languages */}
        <JobSeekerLanguageSection
          isEditing={isEditing}
          userId={profile.id}
          languages={languages}
          setLanguages={setLanguages}
        />

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#008CBA]" />
            <h3 className="text-lg font-bold text-gray-900">Skills</h3>
          </div>

          {isEditing ? (
            <SkillsEditor form={form} />
          ) : profile.skills && profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#E6F7FB] text-[#008CBA] rounded-full text-sm font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No skills added.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillsEditor({ form }: { form: any }) {
  const skills: string[] = form.watch("skills") ?? [];

  function removeAt(index: number) {
    form.setValue(
      "skills",
      skills.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  }

  function addFromInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const value = (e.target as HTMLInputElement).value.trim();
    if (!value) return;
    form.setValue("skills", [...skills, value], { shouldDirty: true });
    (e.target as HTMLInputElement).value = "";
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="Type a skill and press Enter"
        onKeyDown={addFromInput}
      />
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="px-3 py-1.5 bg-[#E6F7FB] text-[#008CBA] rounded-full text-sm font-medium flex items-center gap-2"
          >
            {s}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="hover:text-red-600"
              aria-label={`Remove ${s}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function CVSection({
  profile,
  form,
  setProfile,
  isEditing,
}: {
  profile: any;
  form: any;
  setProfile: (updater: (prev: any) => any) => void;
  isEditing: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleCVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setProgress(0);

    const tick = setInterval(
      () => setProgress((p) => (p < 80 ? p + 5 : p)),
      150,
    );

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("CV")
      .upload(`public/${fileName}`, file);

    clearInterval(tick);

    if (error) {
      console.error(error.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);
    const { data } = supabase.storage
      .from("CV")
      .getPublicUrl(`public/${fileName}`);

    if (data?.publicUrl) {
      form.setValue("cv", data.publicUrl, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setProfile((prev: any) => ({ ...prev, cv: data.publicUrl }));
    }

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 600);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <SectionTitle>CV</SectionTitle>

      <input
        type="file"
        id="admin-cv-upload"
        className="hidden"
        accept=".pdf, .doc, .docx, .png, .jpg, .jpeg, .webp"
        onChange={handleCVUpload}
        disabled={uploading}
      />

      {uploading && (
        <div className="rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F7FB] flex items-center justify-center shrink-0">
              <Upload className="w-6 h-6 text-[#008CBA] animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Uploading CV
              </p>
              <p className="text-xs text-gray-500">{progress}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-[#008CBA] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!uploading && profile.cv && (
        <div className="rounded-xl border border-[#B3E6F5] bg-[#F0FAFE] p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F7FB] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-[#008CBA]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                Resume / CV
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <p className="text-xs text-green-600 font-medium">
                  Available for download
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
                <span className="hidden sm:inline">View / Download</span>
              </a>
              {isEditing && (
                <label
                  htmlFor="admin-cv-upload"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#008CBA] text-white text-sm font-medium hover:bg-[#007399] transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Replace</span>
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {!uploading && !profile.cv && (
        <div className="rounded-xl border-2 border-dashed border-[#B3E6F5] bg-gray-50 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F7FB] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#008CBA]" />
          </div>
          <p className="text-gray-800 font-semibold mb-1">No CV uploaded</p>
          <p className="text-sm text-gray-500 mb-5">
            {isEditing
              ? "Upload a CV for this job seeker."
              : "The job seeker hasn't uploaded a CV yet."}
          </p>
          {isEditing && (
            <label
              htmlFor="admin-cv-upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008CBA] text-white text-sm font-medium hover:bg-[#007399] transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload CV
            </label>
          )}
        </div>
      )}
    </div>
  );
}

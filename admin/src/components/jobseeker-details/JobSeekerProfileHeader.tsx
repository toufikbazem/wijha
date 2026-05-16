import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import {
  User,
  IdCard,
  MapPin,
  GraduationCap,
  TrendingUp,
  Mars,
  Venus,
  Camera,
  Upload,
  CheckCircle2,
  ShieldAlert,
  XCircle,
  ShieldOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabaseClient";

const educationLevels = [
  "No Formal Education",
  "Primary School",
  "Middle School",
  "High School",
  "Baccalaureate",
  "Bac +2 (DUT, BTS, TS)",
  "Bac +3 (Bachelor's Degree)",
  "Bac +4 (Master 1)",
  "Bac +5 (Master's Degree / Engineering Degree)",
  "Magistere, Bac +7",
  "Doctorate",
  "Technical Training",
  "University Education, No Degree",
];

const experienceLevels = [
  "No experience (Intern)",
  "0–1 year (Junior)",
  "1–3 years (Intermediate Junior)",
  "3–5 years (Mid-level)",
  "5–10 years (Senior)",
  "10+ years (Expert)",
];

type ProfileStatus = "active" | "unverified" | "suspended" | "deactivated";

const statusConfig: Record<
  ProfileStatus,
  { icon: React.ElementType; className: string; label: string }
> = {
  active: {
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border border-green-200",
    label: "Active",
  },
  unverified: {
    icon: ShieldAlert,
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    label: "Unverified",
  },
  suspended: {
    icon: XCircle,
    className: "bg-red-50 text-red-700 border border-red-200",
    label: "Suspended",
  },
  deactivated: {
    icon: ShieldOff,
    className: "bg-gray-100 text-gray-500 border border-gray-200",
    label: "Deactivated",
  },
};

export default function JobSeekerProfileHeader({
  profile,
  isEditing,
  form,
  setProfile,
  onChangeStatus,
}: {
  profile: any;
  isEditing: boolean;
  form: any;
  setProfile: (updater: (prev: any) => any) => void;
  onChangeStatus: (status: ProfileStatus) => Promise<void> | void;
}) {
  const status = profile.status as ProfileStatus | undefined;
  const cfg = status ? statusConfig[status] : null;
  const StatusIcon = cfg?.icon;

  const profileImg = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleProfileImgUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
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
      .from("wijha")
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
      .from("wijha")
      .getPublicUrl(`public/${fileName}`);

    if (data?.publicUrl) {
      form.setValue("profile_image", data.publicUrl, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setProfile((prev: any) => ({ ...prev, profile_image: data.publicUrl }));
    }

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 600);
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 relative">
      <div className="h-32 bg-[#008CBA]" />
      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-16">
          {/* Avatar */}
          <div className="relative m-auto sm:m-0 w-fit h-fit">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt="profile"
                className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
              />
            ) : (
              <div className="bg-[#008CBA] w-32 h-32 flex items-center justify-center rounded-xl border-4 border-white shadow-lg">
                <User className="text-white w-24 h-24" />
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 rounded-xl border-4 border-white shadow-lg bg-black/55 flex flex-col items-center justify-center text-white">
                <Upload className="w-6 h-6 mb-2 animate-bounce" />
                <span className="text-base font-bold">{progress}%</span>
                <div className="mt-2 w-20 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-white rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={profileImg}
                  onChange={handleProfileImgUpload}
                />
                <button
                  type="button"
                  className="cursor-pointer absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all disabled:opacity-60"
                  disabled={uploading}
                  onClick={() => profileImg.current?.click()}
                  aria-label="Upload profile image"
                >
                  {uploading ? (
                    <Spinner className="h-4 w-4 text-gray-700" />
                  ) : (
                    <Camera className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Identity + meta */}
          <div className="flex-1 mt-4 md:mt-6">
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Controller
                    name="first_name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="flex-1">
                        <Input
                          {...field}
                          placeholder="First name"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="last_name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="flex-1">
                        <Input
                          {...field}
                          placeholder="Last name"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="professional_title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          className="pl-9"
                          placeholder="Professional title"
                          aria-invalid={fieldState.invalid}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-bold text-gray-900 md:text-gray-100">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  {cfg && StatusIcon && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}
                    >
                      <StatusIcon size={12} />
                      {cfg.label}
                    </span>
                  )}
                </div>
                {profile.professional_title && (
                  <p className="text-xl text-[#008CBA] font-medium mt-1">
                    {profile.professional_title}
                  </p>
                )}
              </>
            )}

            {/* Meta — address, education, experience, gender */}
            <div className="flex flex-wrap gap-3 mt-4">
              {isEditing ? (
                <>
                  <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            className="pl-9"
                            placeholder="Address"
                            aria-invalid={fieldState.invalid}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="education_level"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-56">
                            <SelectValue placeholder="Education level" />
                          </SelectTrigger>
                          <SelectContent>
                            {educationLevels.map((lvl) => (
                              <SelectItem key={lvl} value={lvl}>
                                {lvl}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="experience_level"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-56">
                            <SelectValue placeholder="Experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevels.map((lvl) => (
                              <SelectItem key={lvl} value={lvl}>
                                {lvl}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="gender"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white">
                          <FieldLabel className="text-sm text-gray-600 m-0">
                            Gender:
                          </FieldLabel>
                          <RadioGroup
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                            className="flex flex-nowrap items-center gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                className="w-4 h-4"
                                value="male"
                                id="profile-gender-male"
                              />
                              <Label
                                className="text-gray-900 font-medium text-sm flex items-center gap-1"
                                htmlFor="profile-gender-male"
                              >
                                <Mars className="w-4 h-4 text-blue-500" />
                                Male
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                className="w-4 h-4"
                                value="female"
                                id="profile-gender-female"
                              />
                              <Label
                                className="text-gray-900 font-medium text-sm flex items-center gap-1"
                                htmlFor="profile-gender-female"
                              >
                                <Venus className="w-4 h-4 text-pink-500" />
                                Female
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </Field>
                    )}
                  />
                </>
              ) : (
                <>
                  {profile.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile.address}</span>
                    </div>
                  )}
                  {profile.education_level && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-sm">{profile.education_level}</span>
                    </div>
                  )}
                  {profile.experience_level && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">{profile.experience_level}</span>
                    </div>
                  )}
                  {profile.gender && (
                    <div className="flex items-center gap-2 text-gray-600">
                      {profile.gender === "female" ? (
                        <Venus className="w-4 h-4 text-pink-500" />
                      ) : (
                        <Mars className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="text-sm capitalize">
                        {profile.gender}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Status selector — admin-only control */}
            {isEditing && (
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-600">
                  Status:
                </span>
                <Select
                  value={status ?? ""}
                  onValueChange={(v) => onChangeStatus(v as ProfileStatus)}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

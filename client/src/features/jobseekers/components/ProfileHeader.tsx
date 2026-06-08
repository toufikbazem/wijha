import { Input } from "@/components/ui/input";
import { AddressCombobox } from "@/components/ui/address-combobox";
import { ProfessionalTitleCombobox } from "@/components/ui/professional-title-combobox";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldOff,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Camera,
  Mars,
  Venus,
  Pen,
  Save,
} from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import i18n from "@/i18n/i18n";
import { educationLevels, experienceLevels } from "@/utils/data";

type ProfileStatus = "active" | "unverified" | "suspended" | "deactivated";

const statusConfig: Record<
  ProfileStatus,
  { icon: React.ElementType; className: string; key: string }
> = {
  active: {
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border border-green-200",
    key: "statusActive",
  },
  unverified: {
    icon: ShieldAlert,
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    key: "statusUnverified",
  },
  suspended: {
    icon: XCircle,
    className: "bg-red-50 text-red-700 border border-red-200",
    key: "statusSuspended",
  },
  deactivated: {
    icon: ShieldOff,
    className: "bg-gray-100 text-gray-500 border border-gray-200",
    key: "statusDeactivated",
  },
};

function ProfileHeader({
  profile,
  isEditing,
  setIsEditing,
  loadingEdit,
  setLoadingEdit,
  form,
  setProfile,
}: any) {
  const [loadingUploadProfileImage, setLoadingUpLoadProfileImage] =
    useState(false);
  const [profileImgUploadProgress, setProfileImgUploadProgress] = useState(0);
  const profileImg = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation("jobseeker");
  const { t: td } = useTranslation("data");

  const handleProfileImgUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setLoadingUpLoadProfileImage(true);
    setProfileImgUploadProgress(0);

    const progressInterval = setInterval(() => {
      setProfileImgUploadProgress((prev) => (prev < 80 ? prev + 5 : prev));
    }, 150);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("wijha")
      .upload(`public/${fileName}`, file);

    clearInterval(progressInterval);

    if (error) {
      console.error(error.message);
      setLoadingUpLoadProfileImage(false);
      setProfileImgUploadProgress(0);
      return;
    }

    setProfileImgUploadProgress(100);

    const { data } = supabase.storage
      .from("wijha")
      .getPublicUrl(`public/${fileName}`);

    if (!data?.publicUrl) {
      setLoadingUpLoadProfileImage(false);
      setProfileImgUploadProgress(0);
      return;
    }

    form.setValue("profile_image", data.publicUrl, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setProfile(form.getValues());

    setTimeout(() => {
      setLoadingUpLoadProfileImage(false);
      setProfileImgUploadProgress(0);
    }, 600);
  };

  return (
    <div className=" bg-white rounded-3xl shadow-xl overflow-hidden mb-6 relative">
      {isEditing ? (
        <button
          disabled={loadingEdit}
          type="submit"
          className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-primary-500 hover:text-primary-600 absolute top-4 right-4  z-10 px-4 py-1.5 rounded-lg bg-white border border-gray-50 transition-all"
        >
          {loadingEdit ? (
            <>
              <Spinner className="w-4 h-4" />
              <span className="hidden sm:block">Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span className="hidden sm:block">Save Edits</span>
            </>
          )}
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(true);
          }}
          type="button"
          className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-primary-500 hover:text-primary-600 absolute top-4 right-4  z-10 px-4 py-1.5 rounded-lg bg-white border border-gray-50 transition-all"
        >
          <Pen className="w-4 h-4" />
          <span className="hidden sm:block">Edit Profile</span>
        </button>
      )}
      <div className="h-32  bg-[#008CBA]"></div>
      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-16">
          {/* photo profile */}
          <div className="relative m-auto sm:m-0 w-fit h-fit">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt="logo"
                className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
              />
            ) : (
              <div className="bg-[#008CBA] w-32 h-32 flex items-center justify-center rounded-xl border-4 border-white shadow-lg">
                <User className=" text-white w-24 h-24" />
              </div>
            )}

            {loadingUploadProfileImage && (
              <div className="absolute inset-0 rounded-xl border-4 border-white shadow-lg bg-black/55 flex flex-col items-center justify-center text-white">
                <Upload className="w-6 h-6 mb-2 animate-bounce" />
                <span className="text-base font-bold">
                  {profileImgUploadProgress}%
                </span>
                <div className="mt-2 w-20 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-white rounded-full transition-all duration-200"
                    style={{ width: `${profileImgUploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <>
                <Input
                  type="file"
                  className="hidden"
                  ref={profileImg}
                  onChange={handleProfileImgUpload}
                />

                <button
                  type="button"
                  className="cursor-pointer absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
                  disabled={loadingUploadProfileImage}
                  onClick={() => {
                    profileImg.current?.click();
                  }}
                >
                  {loadingUploadProfileImage ? (
                    <Spinner className="h-4 w-4 text-gray-700" />
                  ) : (
                    <Camera className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </>
            )}
          </div>

          <div className="flex-1 mt-4 md:mt-6">
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-1">
                  <Controller
                    name="first_name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="relative">
                          <User className="input-icon-filter h-4 w-4" />
                          <Input
                            {...field}
                            type="text"
                            className="input-filter text-3xl font-bold md:text-white"
                            aria-invalid={fieldState.invalid}
                            placeholder={t("firstName")}
                          />
                        </div>
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
                      <Field data-invalid={fieldState.invalid}>
                        <div className="relative">
                          <User className="input-icon-filter h-4 w-4" />
                          <Input
                            {...field}
                            type="text"
                            className="input-filter text-3xl font-bold md:text-white"
                            aria-invalid={fieldState.invalid}
                            placeholder={t("lastName")}
                          />
                        </div>
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
                      <ProfessionalTitleCombobox
                        value={field.value}
                        onChange={field.onChange}
                        invalid={fieldState.invalid}
                        placeholder={t("professionalTitle")}
                        variant="filter"
                        className="text-3xl font-bold"
                      />
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
                  {profile.status &&
                    (() => {
                      const cfg = statusConfig[profile.status as ProfileStatus];
                      if (!cfg) return null;
                      const Icon = cfg.icon;
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}
                        >
                          <Icon size={12} />
                          {t(cfg.key)}
                        </span>
                      );
                    })()}
                </div>
                <p className="text-xl text-[#008CBA] font-medium mt-1">
                  {profile.professional_title}
                </p>
              </>
            )}

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 mt-4">
              {isEditing ? (
                <>
                  <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <AddressCombobox
                          value={field.value}
                          onChange={field.onChange}
                          invalid={fieldState.invalid}
                          variant="filter"
                        />
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
                        <div className="relative">
                          <Briefcase className="input-icon-filter" size={20} />
                          <Select
                            dir={i18n.dir()}
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              aria-invalid={fieldState.invalid}
                              className="input-filter"
                            >
                              <SelectValue
                                placeholder={t("selectEducationLevel", {
                                  ns: "common",
                                })}
                              />
                            </SelectTrigger>
                            <SelectContent
                              className="p-3"
                              position="item-aligned"
                            >
                              {educationLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {td(level)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
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
                        <div className="relative">
                          <TrendingUp className="input-icon-filter" size={20} />
                          <Select
                            dir={i18n.dir()}
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              aria-invalid={fieldState.invalid}
                              className="input-filter"
                            >
                              <SelectValue
                                placeholder={t("selectExperienceLevel", {
                                  ns: "common",
                                })}
                              />
                            </SelectTrigger>
                            <SelectContent
                              className="p-3"
                              position="item-aligned"
                            >
                              {experienceLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {td(level)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="gender"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white">
                          <FieldLabel className="text-sm text-gray-600 m-0">
                            {t("gender", { ns: "common" })}:
                          </FieldLabel>
                          <RadioGroup
                            dir={i18n.dir()}
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
                                {t("male", { ns: "common" })}
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
                                {t("female", { ns: "common" })}
                              </Label>
                            </div>
                          </RadioGroup>
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
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profile.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">
                      {td(profile.education_level)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">
                      {td(profile.experience_level)}
                    </span>
                  </div>
                  {profile.gender && (
                    <div className="flex items-center gap-2 text-gray-600">
                      {profile.gender === "female" ? (
                        <Venus className="w-4 h-4 text-pink-500" />
                      ) : (
                        <Mars className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="text-sm">
                        {t(profile.gender, { ns: "common" })}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;

import { Input } from "@/components/ui/input";
import { AddressCombobox } from "@/components/ui/address-combobox";
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
  IdCard,
} from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { useTranslation } from "react-i18next";

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

function ProfileHeader({ profile, isEditing, form, setProfile }: any) {
  const [loadingUploadProfileImage, setLoadingUpLoadProfileImage] =
    useState(false);
  const profileImg = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation("jobseeker");

  const handleProfileImgUpload = async (e: any) => {
    setLoadingUpLoadProfileImage(true);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("wijha")
      .upload(`public/${fileName}`, file);

    if (error) {
      console.error(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("wijha")
      .getPublicUrl(`public/${fileName}`);

    if (!data?.publicUrl) return;

    data &&
      form.setValue("profile_image", data.publicUrl, {
        shouldDirty: true,
        shouldTouch: true,
      });
    setProfile(form.getValues());
    setLoadingUpLoadProfileImage(false);
  };

  return (
    <div className=" bg-white rounded-3xl shadow-xl overflow-hidden mb-6 relative">
      <div className="h-32  bg-[#008CBA]"></div>
      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-16">
          {/* Profile Photo */}
          <div className="relative shrink-0">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt="Profile"
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="bg-[#008CBA] w-32 h-32 flex items-center justify-center rounded-xl border-4 border-white shadow-lg">
                <User className=" text-white w-18 h-18" />
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
                  onClick={() => profileImg.current?.click()}
                  className="absolute bottom-2 right-2 bg-[#008CBA] text-white p-2 rounded-lg hover:bg-indigo-700 transition shadow-lg"
                >
                  {loadingUploadProfileImage ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Name and Title */}
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
                            className="input-filter text-3xl font-bold"
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
                            className="input-filter text-3xl font-bold"
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
                      <div className="relative">
                        <IdCard className="input-icon-filter h-4 w-4" />
                        <Input
                          {...field}
                          type="text"
                          className="input-filter text-3xl font-bold"
                          aria-invalid={fieldState.invalid}
                          placeholder={t("professionalTitle")}
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
                  <h2 className="text-3xl font-bold text-gray-900">
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
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="hidden relative">
                          <Mail className="input-icon-filter h-4 w-4" />
                          <Input
                            {...field}
                            type="text"
                            className="input-filter text-3xl font-bold"
                            aria-invalid={fieldState.invalid}
                            placeholder={t("emailAddress")}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>

                  <Controller
                    name="phone_number"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="relative">
                          <Phone className="input-icon-filter h-4 w-4" />
                          <Input
                            {...field}
                            type="text"
                            className="input-filter text-3xl font-bold"
                            aria-invalid={fieldState.invalid}
                            placeholder={t("phoneNumber")}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

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
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{profile.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profile.address}</span>
                  </div>
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

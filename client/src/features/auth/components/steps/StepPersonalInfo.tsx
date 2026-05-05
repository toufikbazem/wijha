import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AddressCombobox } from "@/components/ui/address-combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Camera, Mars, Phone, Upload, User, Venus } from "lucide-react";
import { Controller } from "react-hook-form";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";
import i18n from "@/i18n/i18n";

function StepPersonalInfo({ form }: { form: any }) {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const profileImg = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const profileImage = form.watch("profileImage");

  const handleProfileImgUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 80 ? prev + 5 : prev));
    }, 150);

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("wijha")
      .upload(`public/${fileName}`, file);

    clearInterval(progressInterval);

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
      form.setValue("profileImage", data.publicUrl, { shouldDirty: true });
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
          {t("personalInformation")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("personalInformationSubtitle")}
        </p>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 rounded-full bg-black/55 flex flex-col items-center justify-center text-white">
              <Upload className="w-5 h-5 mb-1 animate-bounce" />
              <span className="text-xs font-bold">{progress}%</span>
            </div>
          )}

          <Input
            type="file"
            className="hidden"
            ref={profileImg}
            accept="image/*"
            onChange={handleProfileImgUpload}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => profileImg.current?.click()}
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
          {t("profileImageOptional")}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">{t("firstName")}</FieldLabel>
              <div className="relative">
                <User className="input-icon" size={20} />
                <Input
                  type="text"
                  className="input"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={t("enterFirstName")}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">{t("lastName")}</FieldLabel>
              <div className="relative">
                <User className="input-icon" size={20} />
                <Input
                  type="text"
                  className="input"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={t("enterLastName")}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{tc("address")}</FieldLabel>
            <AddressCombobox
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
              variant="default"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="phoneNumber"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{t("phoneNumber")}</FieldLabel>
            <div className="relative">
              <Phone className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="0X XX XX XX XX"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="gender"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">{tc("gender")}</FieldLabel>
            <RadioGroup
              dir={i18n.dir()}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              className="flex flex-nowrap items-center gap-8"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem className="w-4 h-4" value="male" id="r-male" />
                <Label
                  className="text-gray-900 font-semibold text-sm flex items-center gap-1"
                  htmlFor="r-male"
                >
                  <Mars className="w-4 h-4 text-blue-500" />
                  {tc("male")}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  className="w-4 h-4"
                  value="female"
                  id="r-female"
                />
                <Label
                  className="text-gray-900 font-semibold text-sm flex items-center gap-1"
                  htmlFor="r-female"
                >
                  <Venus className="w-4 h-4 text-pink-500" />
                  {tc("female")}
                </Label>
              </div>
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}

export default StepPersonalInfo;

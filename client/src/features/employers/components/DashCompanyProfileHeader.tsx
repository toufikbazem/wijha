import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AddressCombobox } from "@/components/ui/address-combobox";
import {
  Building2,
  Building2Icon,
  Calendar,
  Camera,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { companySize, industries } from "@/utils/data";
import { supabase } from "@/lib/supabaseClient";

function DashCompanyProfileHeader({
  companyInfo,
  setCompanyInfo,
  editMode,
  form,
}: {
  companyInfo: any;
  setCompanyInfo: any;
  editMode: boolean;
  form: any;
}) {
  const [loadingCoverImage, setLoadingCoverImage] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const { t } = useTranslation("employer");
  const coverImageRef = useRef<HTMLInputElement | null>(null);
  const logoRef = useRef<HTMLInputElement | null>(null);

  const handleUploadCoverImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLoadingCoverImage(true);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("wijha")
      .upload(`public/${fileName}`, file);

    if (error) {
      console.error(error);
      return;
    }

    const { data } = supabase.storage
      .from("wijha")
      .getPublicUrl(`public/${fileName}`);

    console.log(data.publicUrl);

    if (!data?.publicUrl) return;

    data &&
      form.setValue("cover_image", data.publicUrl, {
        shouldDirty: true,
        shouldTouch: true,
      });

    data && setCompanyInfo({ ...companyInfo, cover_image: data.publicUrl });
    setLoadingCoverImage(false);
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingLogo(true);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    console.log(file);

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
      form.setValue("logo", data.publicUrl, {
        shouldDirty: true,
        shouldTouch: true,
      });
    data && setCompanyInfo({ ...companyInfo, logo: data.publicUrl });

    setLoadingLogo(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      {/* Cover Image Section */}
      <div className="relative h-40 bg-primary-500">
        {companyInfo.cover_image ? (
          <img
            src={companyInfo.cover_image}
            alt="Cover Image"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary-500" />
        )}

        {/* Edit Cover Button (shown in edit mode) */}
        {editMode && (
          <>
            <Input
              type="file"
              className="hidden"
              ref={coverImageRef}
              onChange={handleUploadCoverImage}
            />

            <button
              type="button"
              className="cursor-pointer absolute top-4 right-4 bg-white text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all"
              onClick={() => {
                coverImageRef.current?.click();
              }}
            >
              {loadingCoverImage ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span className="text-sm font-medium">{t("editCover")}</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-20">
          {/* Logo with Edit Button Overlay */}
          <div className="relative m-auto sm:m-0">
            {companyInfo.logo ? (
              <img
                src={companyInfo.logo}
                alt="logo"
                className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
              />
            ) : (
              <div className="bg-[#008CBA] w-32 h-32 flex items-center justify-center rounded-xl border-4 border-white shadow-lg">
                <Building2Icon className=" text-white w-24 h-24" />
              </div>
            )}
            {editMode && (
              <>
                <Input
                  type="file"
                  className="hidden"
                  ref={logoRef}
                  onChange={handleUploadLogo}
                />

                <button
                  type="button"
                  className="cursor-pointer absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
                  disabled={loadingLogo}
                  onClick={() => {
                    logoRef.current?.click();
                  }}
                >
                  {loadingLogo ? (
                    <Spinner className="h-4 w-4 text-gray-700" />
                  ) : (
                    <Camera className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </>
            )}
          </div>

          <div className="flex-1 m-auto text-center sm:text-start sm:mt-16 flex flex-col gap-2">
            {/* company name */}
            {editMode ? (
              <Controller
                name="company_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="relative">
                      <Building2 className="input-icon-filter h-4 w-4" />
                      <Input
                        {...field}
                        type="text"
                        className="input-filter text-3xl font-bold"
                        aria-invalid={fieldState.invalid}
                        placeholder="Company Name"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">
                {companyInfo.company_name}
              </h2>
            )}

            {/* industry */}
            {editMode ? (
              <Controller
                name="industry"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="relative">
                      <Mail className="input-icon-filter h-4 w-4" />
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter">
                          <SelectValue placeholder="Select Industry" />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {industries.map((industry, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={industry}
                              >
                                {industry}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ) : (
              <span className="bg-[#008CBA] w-fit inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white">
                {companyInfo.industry}
              </span>
            )}

            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              {/* Address */}
              {editMode ? (
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
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
              ) : (
                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                  <MapPin className="w-4 h-4" />
                  <span>{companyInfo.address}</span>
                </div>
              )}

              {/* company size */}

              {editMode ? (
                <Controller
                  name="size"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
                      <div className="relative">
                        <Mail className="input-icon-filter h-4 w-4" />
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="input-filter">
                            <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                          <SelectContent className="p-2 border-gray-300 bg-white">
                            {companySize.map((size, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  className="hover:bg-blue-50"
                                  value={size}
                                >
                                  {size}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{companyInfo.size}</span>
                </div>
              )}

              {/* founding year */}
              {editMode && (
                <Controller
                  name="founding_year"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex-1" data-invalid={fieldState.invalid}>
                      <div className="relative">
                        <Calendar className="input-icon-filter w-4 h-4" />
                        <Input
                          {...field}
                          type="text"
                          className="input-filter"
                          aria-invalid={fieldState.invalid}
                          placeholder=""
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              {companyInfo.founding_year && !editMode && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{t("founded")} {companyInfo.founding_year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashCompanyProfileHeader;

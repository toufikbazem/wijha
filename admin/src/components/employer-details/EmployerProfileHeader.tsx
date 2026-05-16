import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Building2Icon,
  Calendar,
  Camera,
  CheckCircle2,
  MapPin,
  ShieldAlert,
  ShieldOff,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabaseClient";
import { industries } from "@/lib/data";
import { companySize } from "@/lib/data";

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

export default function EmployerProfileHeader({
  companyInfo,
  setCompanyInfo,
  isEditing,
  form,
  onChangeStatus,
}: {
  companyInfo: any;
  setCompanyInfo: (updater: (prev: any) => any) => void;
  isEditing: boolean;
  form: any;
  onChangeStatus: (status: ProfileStatus) => Promise<void> | void;
}) {
  const status = companyInfo.status as ProfileStatus | undefined;
  const cfg = status ? statusConfig[status] : null;
  const StatusIcon = cfg?.icon;

  const coverImageRef = useRef<HTMLInputElement | null>(null);
  const logoRef = useRef<HTMLInputElement | null>(null);
  const [loadingCoverImage, setLoadingCoverImage] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function uploadFile(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("wijha")
      .upload(`public/${fileName}`, file);
    if (error) {
      console.error(error.message);
      return null;
    }
    const { data } = supabase.storage
      .from("wijha")
      .getPublicUrl(`public/${fileName}`);
    return data?.publicUrl ?? null;
  }

  async function handleUploadCoverImage(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLoadingCoverImage(true);
    setUploadProgress(0);
    const tick = setInterval(
      () => setUploadProgress((p) => (p < 80 ? p + 5 : p)),
      150,
    );
    const url = await uploadFile(files[0]);
    clearInterval(tick);
    setUploadProgress(100);
    if (url) {
      form.setValue("cover_image", url, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setCompanyInfo((prev: any) => ({ ...prev, cover_image: url }));
    }
    setTimeout(() => {
      setLoadingCoverImage(false);
      setUploadProgress(0);
    }, 400);
  }

  async function handleUploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLoadingLogo(true);
    const url = await uploadFile(files[0]);
    if (url) {
      form.setValue("logo", url, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setCompanyInfo((prev: any) => ({ ...prev, logo: url }));
    }
    setLoadingLogo(false);
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 relative">
      {/* Cover */}
      <div className="relative h-40 bg-[#008CBA]">
        {companyInfo.cover_image ? (
          <img
            src={companyInfo.cover_image}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#008CBA]" />
        )}

        {loadingCoverImage && (
          <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white">
            <Upload className="w-6 h-6 mb-2 animate-bounce" />
            <span className="text-base font-bold">{uploadProgress}%</span>
            <div className="mt-2 w-32 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-white rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {isEditing && !loadingCoverImage && (
          <>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverImageRef}
              onChange={handleUploadCoverImage}
            />
            <button
              type="button"
              onClick={() => coverImageRef.current?.click()}
              className="cursor-pointer absolute top-4 right-4 bg-white text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Cover</span>
            </button>
          </>
        )}
      </div>

      {/* Body */}
      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-16">
          {/* Logo */}
          <div className="relative m-auto sm:m-0 w-fit h-fit">
            {companyInfo.logo ? (
              <img
                src={companyInfo.logo}
                alt="Logo"
                className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
              />
            ) : (
              <div className="bg-[#008CBA] w-32 h-32 flex items-center justify-center rounded-xl border-4 border-white shadow-lg">
                <Building2Icon className="text-white w-24 h-24" />
              </div>
            )}

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={logoRef}
                  onChange={handleUploadLogo}
                />
                <button
                  type="button"
                  className="cursor-pointer absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all disabled:opacity-60"
                  disabled={loadingLogo}
                  onClick={() => logoRef.current?.click()}
                  aria-label="Upload logo"
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

          {/* Identity + meta */}
          <div className="flex-1 mt-4 md:mt-6">
            {isEditing ? (
              <Controller
                name="company_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="relative z-30"
                    data-invalid={fieldState.invalid}
                  >
                    <Input
                      {...field}
                      type="text"
                      className="text-2xl font-bold"
                      aria-invalid={fieldState.invalid}
                      placeholder="Company Name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ) : (
              <div className="relative z-30 flex items-center gap-3 flex-wrap">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-white">
                  {companyInfo.company_name}
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
            )}

            {!isEditing && companyInfo.industry && (
              <span className="bg-[#008CBA] w-fit inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium text-white">
                {companyInfo.industry}
              </span>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap gap-3 mt-4">
              {isEditing ? (
                <>
                  <Controller
                    name="industry"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-56">
                            <SelectValue placeholder="Industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((i) => (
                              <SelectItem key={i} value={i}>
                                {i}
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
                    name="size"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-44">
                            <SelectValue placeholder="Company size" />
                          </SelectTrigger>
                          <SelectContent>
                            {companySize.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
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
                    name="founding_year"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            className="pl-9"
                            placeholder="Founding year"
                            aria-invalid={fieldState.invalid}
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
                  {companyInfo.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{companyInfo.address}</span>
                    </div>
                  )}
                  {companyInfo.size && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{companyInfo.size}</span>
                    </div>
                  )}
                  {companyInfo.founding_year && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Founded {companyInfo.founding_year}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Status selector — admin-only */}
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

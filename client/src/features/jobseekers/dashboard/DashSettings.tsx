import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Lock,
  Globe,
  Eye,
  EyeOff,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Controller, useForm } from "react-hook-form";
import { changeEmailSchema, changePasswordSchema } from "../Schema";
import { changeEmail } from "@/features/auth/userSlice";

export default function SettingsPage() {
  const { t } = useTranslation("jobseeker");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [language, setLanguage] = useState("en");
  const { user } = useSelector((state: any) => state.user);

  const changePasswordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const changeEmailForm = useForm<z.infer<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/change-password`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        },
      );
      if (res.ok) {
        toast.success(t("passwordChanged"));
        changePasswordForm.reset();
      } else {
        toast.error(t("failedChangePassword"));
      }
    } catch (error) {
      toast.error(t("failedChangePassword"));
    } finally {
      setLoading(false);
    }
  };
  const onSubmitEmail = async (data: z.infer<typeof changeEmailSchema>) => {
    setLoadingEmail(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/change-email`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newEmail: data.newEmail,
          }),
        },
      );
      if (res.ok) {
        dispatch(changeEmail(data.newEmail));
        toast.success(t("emailChanged"));
        changeEmailForm.reset();
      } else {
        toast.error(t("failedChangeEmail"));
      }
    } catch (error) {
      toast.error(t("failedChangeEmail"));
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("settings")}</h1>
          <p className="mt-1 text-gray-600">{t("managePreferences")}</p>
        </div>

        <div className="space-y-6">
          {/* Change Password Section */}
          <form onSubmit={changePasswordForm.handleSubmit(onSubmit)}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ebfaff] rounded-lg flex items-center justify-center">
                    <Lock className="text-[#008CBA]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t("changePassword")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t("updatePasswordDesc")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-6">
                <div className="space-y-5">
                  {/* Current Password */}
                  <Controller
                    name="currentPassword"
                    control={changePasswordForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="input-label">
                          {t("currentPassword")}
                        </FieldLabel>
                        <div className="relative">
                          <Mail className="input-icon" size={20} />
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            className="input"
                            {...field}
                            aria-invalid={fieldState.invalid}
                            placeholder="**********"
                          />
                          {showCurrentPassword ? (
                            <EyeOff
                              className="input-icon-right"
                              size={20}
                              onClick={() => setShowCurrentPassword(false)}
                            />
                          ) : (
                            <Eye
                              className="input-icon-right"
                              size={20}
                              onClick={() => setShowCurrentPassword(true)}
                            />
                          )}
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  {/* New Password */}
                  <Controller
                    name="newPassword"
                    control={changePasswordForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="input-label">
                          {t("newPassword")}
                        </FieldLabel>
                        <div className="relative">
                          <Mail className="input-icon" size={20} />
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            className="input"
                            {...field}
                            aria-invalid={fieldState.invalid}
                            placeholder="**********"
                          />
                          {showNewPassword ? (
                            <EyeOff
                              className="input-icon-right"
                              size={20}
                              onClick={() => setShowNewPassword(false)}
                            />
                          ) : (
                            <Eye
                              className="input-icon-right"
                              size={20}
                              onClick={() => setShowNewPassword(true)}
                            />
                          )}
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  {/* Confirm New Password */}
                  <Controller
                    name="confirmNewPassword"
                    control={changePasswordForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="input-label">
                          {t("confirmNewPassword")}
                        </FieldLabel>
                        <div className="relative">
                          <Mail className="input-icon" size={20} />
                          <Input
                            type={showConfirmNewPassword ? "text" : "password"}
                            className="input"
                            {...field}
                            aria-invalid={fieldState.invalid}
                            placeholder="**********"
                          />
                          {showConfirmNewPassword ? (
                            <EyeOff
                              className="input-icon-right"
                              size={20}
                              onClick={() => setShowConfirmNewPassword(false)}
                            />
                          ) : (
                            <Eye
                              className="input-icon-right"
                              size={20}
                              onClick={() => setShowConfirmNewPassword(true)}
                            />
                          )}
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <div className=" mt-6 flex justify-end">
                  <button
                    disabled={loading}
                    className="cursor-pointer ml-auto px-6 py-2.5 bg-[#008CBA] text-white rounded-lg hover:bg-[#007a9e] transition-colors font-medium"
                  >
                    {loading ? (
                      <>
                        {" "}
                        <Spinner className="w-5 h-5" /> {t("updating")}
                      </>
                    ) : (
                      t("updatePassword")
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Change Email Section */}
          <form onSubmit={changeEmailForm.handleSubmit(onSubmitEmail)}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ebfaff] rounded-lg flex items-center justify-center">
                    <Mail className="text-[#008CBA]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t("changeEmail")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t("changeEmailDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 space-y-5">
                {/* Current email */}
                <div className="space-y-1.5">
                  <label className="input-label">{t("currentEmail")}</label>
                  <div className="relative">
                    <Mail className="input-icon" size={16} />
                    <Input
                      type="email"
                      value={user?.email}
                      readOnly
                      className="input"
                    />
                    {user?.is_email_verified ? (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                        <CheckCircle2 size={12} />
                        {t("verified")}
                      </span>
                    ) : (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 rounded-full px-2 py-0.5">
                        <XCircle size={12} />
                        {t("notVerified")}
                      </span>
                    )}
                  </div>
                </div>

                {/* New email */}
                <Controller
                  name="newEmail"
                  control={changeEmailForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="input-label">
                        {t("newEmailAddress")}
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="input-icon" size={20} />
                        <Input
                          type="email"
                          className="input"
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder={t("enterNewEmail")}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 bg-[#008CBA] hover:bg-[#007a9e]"
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        {t("saving")}
                      </>
                    ) : (
                      <>{t("saveChanges")}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Language Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ebfaff] rounded-lg flex items-center justify-center">
                  <Globe className="text-[#008CBA]" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("language")}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {t("selectLanguage")}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("preferredLanguage")}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="cursor-pointer px-6 py-2.5 bg-[#008CBA] text-white rounded-lg hover:bg-[#007a9e] transition-colors font-medium">
                  {t("saveLanguage")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

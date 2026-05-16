import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export default function AccountTab({
  userId,
  email,
  isVerified,
}: {
  userId: string;
  email: string;
  isVerified: boolean;
}) {
  const passwordForm = useForm<{
    newPassword: string;
    confirmNewPassword: string;
  }>({
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });
  const emailForm = useForm<{ newEmail: string }>({
    defaultValues: { newEmail: "" },
  });

  const [verified, setVerified] = useState(isVerified);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [togglingVerify, setTogglingVerify] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  async function savePassword(v: {
    newPassword: string;
    confirmNewPassword: string;
  }) {
    if (!v.newPassword) {
      toast.error("Password cannot be empty");
      return;
    }
    if (v.newPassword !== v.confirmNewPassword) {
      passwordForm.setError("confirmNewPassword", {
        message: "Passwords do not match",
      });
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch(`${BASE}/admin/users/${userId}/password`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: v.newPassword }),
      });
      if (!res.ok) throw new Error((await res.json())?.message ?? "Failed");
      toast.success("Password updated");
      passwordForm.reset({ newPassword: "", confirmNewPassword: "" });
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  }

  async function saveEmail(v: { newEmail: string }) {
    if (!v.newEmail) {
      emailForm.setError("newEmail", { message: "Email is required" });
      return;
    }
    setSavingEmail(true);
    try {
      const res = await fetch(`${BASE}/admin/users/${userId}/email`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v.newEmail }),
      });
      if (!res.ok) throw new Error((await res.json())?.message ?? "Failed");
      toast.success("Email updated");
      emailForm.reset({ newEmail: "" });
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update email");
    } finally {
      setSavingEmail(false);
    }
  }

  async function toggleVerification() {
    setTogglingVerify(true);
    try {
      const res = await fetch(
        `${BASE}/admin/users/${userId}/email-verification`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: !verified }),
        },
      );
      if (!res.ok) throw new Error((await res.json())?.message ?? "Failed");
      setVerified(!verified);
      toast.success("Updated");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update verification");
    } finally {
      setTogglingVerify(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account</h1>
        <p className="mt-1 text-gray-600">
          Manage this user's credentials and verification status
        </p>
      </div>

      <div className="space-y-6">
        {/* Change Password Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ebfaff] rounded-lg flex items-center justify-center">
                  <Lock className="text-[#008CBA]" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-500">
                    Set a new password for this user
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-5">
                {/* New Password */}
                <Controller
                  name="newPassword"
                  control={passwordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>New password</FieldLabel>
                      <div className="relative">
                        <Lock
                          className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          className="ltr:pl-10 rtl:pr-10 ltr:pr-10 rtl:pl-10"
                          placeholder="**********"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        {showNewPassword ? (
                          <EyeOff
                            className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={18}
                            onClick={() => setShowNewPassword(false)}
                          />
                        ) : (
                          <Eye
                            className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={18}
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
                  control={passwordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Confirm new password</FieldLabel>
                      <div className="relative">
                        <Lock
                          className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          type={showConfirmNewPassword ? "text" : "password"}
                          className="ltr:pl-10 rtl:pr-10 ltr:pr-10 rtl:pl-10"
                          placeholder="**********"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        {showConfirmNewPassword ? (
                          <EyeOff
                            className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={18}
                            onClick={() => setShowConfirmNewPassword(false)}
                          />
                        ) : (
                          <Eye
                            className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={18}
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
              <div className="mt-6 flex">
                <button
                  type="button"
                  onClick={passwordForm.handleSubmit(savePassword)}
                  disabled={savingPassword}
                  className="cursor-pointer ltr:ml-auto rtl:mr-auto px-6 py-2.5 bg-[#008CBA] text-white rounded-lg hover:bg-[#007a9e] transition-colors font-medium flex items-center gap-2"
                >
                  {savingPassword ? (
                    <>
                      <Spinner className="w-5 h-5" /> Updating
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Email Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ebfaff] rounded-lg flex items-center justify-center">
                  <Mail className="text-[#008CBA]" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Change Email
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update the user's email address
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Current email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Current email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    className="ltr:pl-10 rtl:pr-10"
                  />
                  {verified ? (
                    <span className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                  ) : (
                    <span className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 rounded-full px-2 py-0.5">
                      <XCircle size={12} />
                      Not verified
                    </span>
                  )}
                </div>
              </div>

              {/* New email */}
              <Controller
                name="newEmail"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>New email address</FieldLabel>
                    <div className="relative">
                      <Mail
                        className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        type="email"
                        className="ltr:pl-10 rtl:pr-10"
                        placeholder="Enter new email"
                        aria-invalid={fieldState.invalid}
                        {...field}
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
                  onClick={() => emailForm.reset({ newEmail: "" })}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={emailForm.handleSubmit(saveEmail)}
                  disabled={savingEmail}
                  className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 bg-[#008CBA] hover:bg-[#007a9e]"
                >
                  {savingEmail ? (
                    <>
                      <Spinner /> Saving
                    </>
                  ) : (
                    <>Save changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Email Verification Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ebfaff] rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-[#008CBA]" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Email Verification
                </h2>
                <p className="text-sm text-gray-500">
                  Manually mark this user's email as verified or unverified
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="text-sm text-gray-600">
                Status:{" "}
                {verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                    <CheckCircle2 size={12} />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 rounded-full px-2 py-0.5">
                    <XCircle size={12} />
                    Not verified
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={toggleVerification}
                disabled={togglingVerify}
                className="cursor-pointer px-6 py-2.5 bg-[#008CBA] text-white rounded-lg hover:bg-[#007a9e] transition-colors font-medium flex items-center gap-2"
              >
                {togglingVerify ? (
                  <>
                    <Spinner className="w-5 h-5" /> Updating
                  </>
                ) : (
                  `Mark as ${verified ? "Unverified" : "Verified"}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Key, Lock } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../schema";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tokenFromUrl = urlParams.get("token");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation("auth");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: tokenFromUrl,
            newPassword: data.password,
          }),
        },
      );

      const resData = await res.json();
      if (!res.ok) {
        setErrorMessage(resData.message || t("resetFailed"));
      } else {
        setErrorMessage("");
        toast.success(t("resetSuccess"));
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage(t("resetFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Key className="text-primary-500" size={36} />
          </div>
          {/* Heading */}
          <h1 className="mb-12 text-2xl font-bold text-gray-900 text-center tracking-tight">
            {t("resetYourPassword")}
          </h1>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-5 mb-6">
              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="text-start"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="input-label">
                      {t("newPassword")}
                    </FieldLabel>
                    <div className="relative">
                      <Lock className="input-icon" size={20} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="input"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="**********"
                      />
                      {showPassword ? (
                        <EyeOff
                          className="input-icon-right"
                          size={20}
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Eye
                          className="input-icon-right"
                          size={20}
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="text-start"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="input-label">
                      {t("confirmNewPassword")}
                    </FieldLabel>
                    <div className="relative">
                      <Lock className="input-icon" size={20} />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        className="input"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="**********"
                      />
                      {showConfirmPassword ? (
                        <EyeOff
                          className="input-icon-right"
                          size={20}
                          onClick={() => setShowConfirmPassword(false)}
                        />
                      ) : (
                        <Eye
                          className="input-icon-right"
                          size={20}
                          onClick={() => setShowConfirmPassword(true)}
                        />
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Submit Button */}
              <Button
                disabled={loading}
                type="submit"
                className="py-3 px-4 h-auto! rounded-lg font-semibold text-white transition-all duration-200 bg-[#008CBA] hover:bg-[#00668C] cursor-pointer w-full mt-6"
              >
                {loading ? (
                  <>
                    <Spinner className="ltr:mr-2 rtl:ml-2" /> {t("loading", { ns: "common" })}
                  </>
                ) : (
                  t("resetPassword")
                )}
              </Button>
            </FieldGroup>
          </form>

          {errorMessage && (
            <div
              className="mt-6 w-full p-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Key, Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schema";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function ForgotPassword() {
  useDocumentTitle("meta.title.forgotPassword");
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation("auth");

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        setErrorMessage(t("errorSendingResetLink"));
      } else {
        setIsEmailSent(true);
      }
    } catch (error) {
      setErrorMessage(t("errorSendingResetLink"));
    } finally {
      setLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Key className="text-primary-500" size={36} />
            </div>
            <h1 className="font-bold text-2xl text-gray-900 tracking-tight">
              {t("checkYourInbox")}
            </h1>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {t("resetLinkSentTo")}{" "}
              <span className="text-black font-semibold">
                {form.getValues("email")}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-8">
              {t("didntReceiveCheck")}
            </p>
            <button
              onClick={() => {
                setIsEmailSent(false);
                form.reset({
                  email: "",
                });
              }}
              className="cursor-pointer mt-4 w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all text-sm"
            >
              {t("resendEmail")}
            </button>
            <p className="block mt-5 w-full text-sm text-gray-600">
              {t("backTo", { ns: "common" })}{" "}
              <Link
                to="/login"
                className="text-sm font-medium text-primary-500 hover:text-primary-700 transition"
              >
                {t("backToSignIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Heading */}
          <div className="mb-12">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Key className="text-primary-500" size={36} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center tracking-tight">
              {t("forgotPasswordTitle")}
            </h1>
            <p className="text-sm text-gray-600 text-center mt-2.5 leading-relaxed whitespace-pre-line">
              {t("forgotPasswordSubtitle")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-5 mb-6">
              {/* Email address */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="text-start"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="input-label text-start">
                      {t("emailAddress")}
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="input-icon" size={20} />
                      <Input
                        type="email"
                        className="input"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="example@email.com"
                      />
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
                    <Spinner className="ltr:mr-2 rtl:ml-2" /> {t("sending")}
                  </>
                ) : (
                  t("sendResetLink")
                )}
              </Button>
            </FieldGroup>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-7">
            <span className="flex-1 h-px bg-[#e0edf2]" />
            <span className="text-sm text-[#9bb5c4]">{t("or")}</span>
            <span className="flex-1 h-px bg-[#e0edf2]" />
          </div>

          {/* Back link */}
          <p className="block mt-5 w-full text-sm text-gray-600">
            {t("backTo", { ns: "common" })}{" "}
            <Link
              to="/login"
              className="text-sm font-medium text-primary-500 hover:text-primary-700 transition"
            >
              {t("backToSignIn")}
            </Link>
          </p>

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

export default ForgotPassword;

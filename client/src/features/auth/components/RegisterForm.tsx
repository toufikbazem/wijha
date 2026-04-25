import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import JobseekerRegisterForm from "./JobseekerRegisterForm";
import EmployerRegisterForm from "./EmployerRegisterForm";
import { employerSchema, jobSeekerSchema } from "../schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function RegisterForm({
  accountType,
  setErrorMessage,
  setVerifyEmail,
}: {
  accountType: string;
  setErrorMessage: (message: string) => void;
  setVerifyEmail: (verify: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation("auth");

  useEffect(() => {
    if (accountType === "jobseeker") {
      form.reset({
        firstName: "",
        lastName: "",
        professionalTitle: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
        confirmPassword: "",
        termsAndConditions: false,
      });
    } else if (accountType === "employer") {
      form.reset({
        companyName: "",
        size: "",
        industry: "",
        address: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAndConditions: false,
      });
    }
  }, [accountType]);

  const formSchema =
    accountType === "jobseeker" ? jobSeekerSchema : employerSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      accountType === "jobseeker"
        ? {
            firstName: "",
            lastName: "",
            professionalTitle: "",
            email: "",
            phoneNumber: "",
            address: "",
            password: "",
            confirmPassword: "",
            termsAndConditions: false,
          }
        : {
            companyName: "",
            size: "",
            industry: "",
            address: "",
            email: "",
            password: "",
            confirmPassword: "",
            termsAndConditions: false,
          },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: accountType, ...data }),
          credentials: "include",
        },
      );

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.message || t("registrationFailed"));
      } else {
        toast.success(t("registrationSuccessful"), {
          position: "bottom-right",
        });
        setVerifyEmail(data.email);
      }
    } catch (error) {
      setErrorMessage(t("errorDuringRegistration"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex flex-col gap-5 mb-6">
        {/* Email address */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">{t("password")}</FieldLabel>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">
                {t("confirmPassword")}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {accountType === "jobseeker" && <JobseekerRegisterForm form={form} />}

        {accountType === "employer" && <EmployerRegisterForm form={form} />}

        {/* Terms and Conditions */}
        <div className="mt-6">
          <Controller
            name="termsAndConditions"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <Field orientation="horizontal">
                  <Checkbox
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="input-checkbox"
                  />
                  <FieldLabel className="text-sm text-gray-600">
                    {t("termsAndConditions")}
                  </FieldLabel>
                </Field>
                {fieldState.invalid && (
                  <FieldError className="mt-2" errors={[fieldState.error]} />
                )}
              </div>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          disabled={loading}
          type="submit"
          className="py-3 px-4 h-auto! rounded-lg font-semibold text-white transition-all duration-200 bg-[#008CBA] hover:bg-[#00668C] cursor-pointer w-full mt-6"
        >
          {loading ? (
            <>
              <Spinner className="ltr:mr-2 rtl:ml-2" />{" "}
              {t("loading", { ns: "common" })}
            </>
          ) : (
            t("createAccount")
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default RegisterForm;

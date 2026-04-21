import { Mail, Eye, EyeOff, Lock } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "../userSlice";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { loginSchema } from "../schema";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function LoginForm({
  setErrorMessage,
}: {
  setErrorMessage: (msg: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("auth");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();
      if (!res.ok) {
        setErrorMessage(result.message || t("loginFailed"));
      } else {
        dispatch(signIn(result));
        toast.success(t("loginSuccessful"));
        result.role === "admin"
          ? navigate("/admin")
          : navigate("/dashboard?tab=dash");
      }
    } catch (error) {
      setErrorMessage(t("loginFailed"));
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
              <FieldLabel className="input-label">{t("emailAddress")}</FieldLabel>
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Controller
            name="rememberMe"
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
                    {t("rememberMe")}
                  </FieldLabel>
                </Field>
                {fieldState.invalid && (
                  <FieldError className="mt-2" errors={[fieldState.error]} />
                )}
              </div>
            )}
          />
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#008CBA] hover:text-[#00668C] transition"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          className="py-3 px-4 h-auto! rounded-lg font-semibold text-white transition-all duration-200 bg-[#008CBA] hover:bg-[#00668C] active:bg-blue-80 w-full mt-6 cursor-pointer"
        >
          {loading ? (
            <>
              <Spinner className="ltr:mr-2 rtl:ml-2" /> {t("loading", { ns: "common" })}
            </>
          ) : (
            t("signInButton")
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default LoginForm;

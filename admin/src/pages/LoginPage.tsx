import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";
import { setUser } from "@/app/authSlice";
import type { RootState } from "@/app/store";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import logo from "../assets/logo.png";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;


export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  if (user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const result = await res.json();
      if (!res.ok) {
        setErrorMessage(result.message || "Login failed");
      } else {
        dispatch(setUser(result));
        navigate("/dashboard", { replace: true });
      }
    } catch {
      setErrorMessage("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="logo" className="h-32 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600">Sign in to your admin account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-5 mb-6">
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      Email address
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="input-icon" size={20} />
                      <Input
                        type="email"
                        className="input"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="admin@example.com"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">Password</FieldLabel>
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

              {/* Remember Me */}
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="input-checkbox"
                    />
                    <FieldLabel className="text-sm text-gray-600">
                      Remember me
                    </FieldLabel>
                  </Field>
                )}
              />

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading}
                className="py-3 px-4 h-auto! rounded-lg font-semibold text-white transition-all duration-200 bg-[#008CBA] hover:bg-[#00668C] active:bg-blue-80 w-full mt-6 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Spinner className="ltr:mr-2 rtl:ml-2" /> Loading...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </FieldGroup>
          </form>

          {/* Error Message */}
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

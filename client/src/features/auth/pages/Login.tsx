import logo from "../../../assets/logo.png";
import { useState } from "react";
import { Link } from "react-router";
import LoginForm from "../components/LoginForm";
import { useTranslation } from "react-i18next";

function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation("auth");

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="logo" className="h-32 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">{t("welcome")}</h1>
          <p className="text-gray-600">{t("signInSubtitle")}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <LoginForm setErrorMessage={setErrorMessage} />

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t("dontHaveAccount")}{" "}
              <Link
                to="/register"
                className="font-semibold text-[#008CBA] hover:text-[#00668C] transition"
              >
                {t("signUpFree")}
              </Link>
            </p>
          </div>

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

export default Login;

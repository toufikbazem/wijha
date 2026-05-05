import logo from "../../../assets/logo.png";
import { useState } from "react";
import { Link } from "react-router";
import SendVerifyEmail from "../components/SendVerifyEmail";
import MultiStepRegister from "../components/MultiStepRegister";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function Register() {
  useDocumentTitle("meta.title.register");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const { t } = useTranslation("auth");

  if (verifyEmail) {
    return <SendVerifyEmail email={verifyEmail} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="logo" className="h-32 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">
            {t("createYourAccount")}
          </h1>
          <p className="text-gray-600">{t("joinProfessionals")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <MultiStepRegister
            setErrorMessage={setErrorMessage}
            setVerifyEmail={setVerifyEmail}
          />

          <div className="mt-6 text-center text-sm text-gray-600">
            {t("alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="font-semibold text-[#008CBA] hover:text-[#00668C]"
            >
              {t("signInButton")}
            </Link>
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

export default Register;

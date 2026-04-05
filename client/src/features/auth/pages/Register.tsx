import logo from "../../../assets/logo.png";
import { User, Building2 } from "lucide-react";
import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router";
import SendVerifyEmail from "../components/SendVerifyEmail";

function Register() {
  const [accountType, setAccountType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");

  if (verifyEmail) {
    return <SendVerifyEmail email={verifyEmail} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="logo" className="h-32 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join thousands of professionals finding their perfect match
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Account Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              I want to register as:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAccountType("jobseeker")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  accountType === "jobseeker"
                    ? "border-primary-500 bg-primary-50 shadow-md"
                    : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                }`}
              >
                <User
                  className={`mx-auto mb-3 ${
                    accountType === "jobseeker"
                      ? "text-primary-500"
                      : "text-gray-400"
                  }`}
                  size={32}
                />
                <h3 className="font-semibold text-gray-900">Job Seeker</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Looking for opportunities
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("employer")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  accountType === "employer"
                    ? "border-primary-500 bg-primary-50 shadow-md"
                    : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                }`}
              >
                <Building2
                  className={`mx-auto mb-3 ${
                    accountType === "employer"
                      ? "text-primary-500"
                      : "text-gray-400"
                  }`}
                  size={32}
                />
                <h3 className="font-semibold text-gray-900">Employer</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Hiring talented people
                </p>
              </button>
            </div>
          </div>

          {/* Form */}
          {accountType && (
            <RegisterForm
              setErrorMessage={setErrorMessage}
              accountType={accountType}
              setVerifyEmail={setVerifyEmail}
            />
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/SignIn"
              className="font-semibold text-[#008CBA] hover:text-[#00668C]"
            >
              Sign in
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

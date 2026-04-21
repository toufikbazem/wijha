import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "@/features/auth/userSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tokenFromUrl = urlParams.get("token");
  const { t } = useTranslation("auth");

  useEffect(() => {
    const setEmailVerified = async () => {
      setLoading(true);
      try {
        if (tokenFromUrl) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/verify-email?token=${tokenFromUrl}`,
            {
              method: "GET",
            },
          );

          if (!res.ok) {
            setIsEmailVerified(false);
          } else {
            if (user) dispatch(verifyEmail());
            setIsEmailVerified(true);
          }
        }
      } catch (error) {
        setIsEmailVerified(false);
      } finally {
        setLoading(false);
      }
    };
    setEmailVerified();
  }, [tokenFromUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl text-center max-w-sm p-8 m-auto">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
            <Skeleton className="h-4 w-32 mx-auto mb-2" />
            <Skeleton className="h-8 w-48 mx-auto mb-3" />
            <Skeleton className="h-20 w-full mb-6" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl text-center max-w-sm p-8 m-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="text-red-500" size={36} />
            </div>
            <p className="text-xs uppercase tracking-widest text-primary-700 font-medium mb-2">
              {t("emailUnverified")}
            </p>
            <h1 className="text-2xl font-serif mb-3">{t("verificationFailed")}</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {t("verificationFailedMessage")}
            </p>
            <Link
              to="/login"
              className="block bg-primary-500 text-primary-50 rounded-lg py-3 text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {t("signInToAccount")}
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl text-center max-w-sm p-8 m-auto">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-primary-500" size={36} />
            </div>
            <p className="text-xs uppercase tracking-widest text-primary-700 font-medium mb-2">
              {t("emailVerified")}
            </p>
            <h1 className="text-2xl font-serif mb-3">{t("youreAllSet")}</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {t("emailConfirmedSuccess")}
            </p>
            <Link
              to="/login"
              className="block bg-primary-500 text-primary-50 rounded-lg py-3 text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {t("signInToAccount")}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default VerifyEmail;

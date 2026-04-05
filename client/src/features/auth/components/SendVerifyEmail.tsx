import { Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function SendVerifyEmail({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    setSent(true);
    setCountdown(30);
    setTimeout(() => setSent(false), 30000);

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/auth/send-verification-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to send verification email");
        setSent(false);
        setCountdown(0);
      } else {
        toast.success("Verification email sent successfully!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setSent(false);
      setCountdown(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl text-center max-w-sm p-8 m-auto">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <Mail className="text-gray-400" size={20} />
          </div>

          {/* Heading */}
          <h1 className="text-lg font-medium text-gray-900 mb-1">
            Check your email
          </h1>
          <p className="text-sm text-gray-500">
            We sent a verification link to
          </p>
          <p className="text-sm font-medium text-gray-900 mt-0.5 mb-6">
            {email}
          </p>

          <hr className="border-gray-100 mb-6" />

          {/* Resend */}
          <p className="text-sm text-gray-500 mb-3">Didn't receive it?</p>
          <button
            onClick={handleResend}
            disabled={sent}
            className={`w-full py-2.5 rounded-lg text-sm font-medium border transition-colors
            ${
              sent
                ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
                : "border-primary-500 text-primary-500 bg-primary-50 hover:bg-primary-100 hover:text-primary-700 cursor-pointer"
            }`}
          >
            {sent ? "Email sent!" : "Resend verification email"}
          </button>
          {countdown > 0 && (
            <p className="text-xs text-gray-400 mt-1.5">
              Resend available in {countdown}s
            </p>
          )}

          <hr className="border-gray-100 my-6" />

          {/* Sign in */}
          <button className="w-full py-2.5 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-700 transition-colors">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

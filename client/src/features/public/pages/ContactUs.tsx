import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function ContactUs() {
  useDocumentTitle("meta.title.contact");
  const { t } = useTranslation("public");

  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) errs.name = t("contactRequired");
    if (!form.email.trim()) errs.email = t("contactRequired");
    else if (!emailRegex.test(form.email))
      errs.email = t("contactEmailInvalid");
    if (!form.subject.trim()) errs.subject = t("contactRequired");
    if (!form.message.trim()) errs.message = t("contactRequired");

    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const infoItems = [
    {
      icon: Mail,
      label: t("contactInfoEmail"),
      value: t("contactInfoEmailValue"),
    },
    {
      icon: Phone,
      label: t("contactInfoPhone"),
      value: t("contactInfoPhoneValue"),
    },
    {
      icon: MapPin,
      label: t("contactInfoLocation"),
      value: t("contactInfoLocationValue"),
    },
    // { icon: Clock, label: t("contactInfoHours"), value: t("contactInfoHoursValue") },
  ];

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-xl border text-sm bg-white transition-all outline-none focus:ring-2 focus:ring-[#008CBA]/30 ${
      errors[field]
        ? "border-red-400 focus:border-red-400"
        : "border-gray-200 focus:border-[#008CBA]"
    }`;

  return (
    <div className="w-full min-h-screen bg-[#0D3B72]/20 z-0">
      <Header />

      {/* Hero */}
      <section className="relative w-full min-h-screen bg-[url('/src/assets/contect.webp')] text-white overflow-hidden bg-cover bg-center">
              <div className="absolute inset-0 bg-[#06192d]/70"></div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-base font-medium">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="text-black"> Wijha</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-white">
            {t("contactHeroTitle")}
          </h1>
          <p className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto">
            {t("contactHeroSubtitle")}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-6 py-20 ">
        <div className="grid lg:grid-cols-5 gap-12 items-start ">
          {/* Info panel */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[#0D3B72] font-semibold text-base uppercase tracking-wider mb-3">
                <div className="w-8 h-0.5 bg-[#0D3B72]" />
                {t("contactInfoTitle")}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-snug">
                ✦ {t("contactInfoTitle")}
              </h2>
            </div>

            <div className="space-y-4">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className=" flex items-start gap-4 bg-linear-to-br from-white to-[#F0F8FF] border border-[#0D3B72]/50 hover:border-[#0D3B72]/90 rounded-2xl p-6 shadow-sm hover:shadow-md  transition-all group"
                >
                  <div className="w-12 h-12 bg-[#0D3B72]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0D3B72] transition-colors">
                    <Icon className="w-6 h-6 text-[#0D3B72] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-gray-900 font-medium text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-linear-to-br from-white to-[#F0F8FF] rounded-3xl border border-[#0D3B72]/50 hover:border-[#0D3B72]/90 shadow-sm p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("contactFormTitle")}
                </h2>
                <p className="text-gray-00 text-sm">
                  {t("contactFormSubtitle")}
                </p>
              </div>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-white to-[#F0F8FF] rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t("contactSuccessTitle")}
                  </h3>
                  <p className="text-gray-500 max-w-xs">
                    {t("contactSuccessText")}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm text-[#0D3B72] font-medium hover:underline"
                  >
                    ← {t("contactSend")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t("contactName")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t("contactNamePlaceholder")}
                        className={inputClass("name")}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t("contactEmail")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t("contactEmailPlaceholder")}
                        className={inputClass("email")}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("contactSubject")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder={t("contactSubjectPlaceholder")}
                      className={inputClass("subject")}
                    />
                    {errors.subject && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("contactMessage")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t("contactMessagePlaceholder")}
                      rows={5}
                      className={`${inputClass("message")} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      {t("contactErrorText")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D3B72] hover:bg-[#0A2A5A] text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {t("contactSending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t("contactSend")}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactUs;

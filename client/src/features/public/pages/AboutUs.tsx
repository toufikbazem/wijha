import { useTranslation } from "react-i18next";
import {
  Target,
  Eye,
  Heart,
  Sparkles,
  CheckCircle,
  Briefcase,
  Users,
  BookOpen,
  Wrench,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AboutUs() {
  const { t } = useTranslation("public");

  const missionItems = [
    t("aboutMission1"),
    t("aboutMission2"),
    t("aboutMission3"),
    t("aboutMission4"),
  ];

  const offerItems = [
    { icon: Briefcase, text: t("aboutOffer1") },
    { icon: BookOpen, text: t("aboutOffer2") },
    { icon: Users, text: t("aboutOffer3") },
    { icon: Wrench, text: t("aboutOffer4") },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#008CBA] via-[#006a8e] to-[#004d6b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>✦ Wijha</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            {t("aboutHeroTitle")}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            {t("aboutHeroSubtitle")}
          </p>
        </div>
      </section>

      {/* What is Wijha */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[#008CBA] font-semibold text-sm uppercase tracking-wider mb-3">
              <div className="w-8 h-0.5 bg-[#008CBA]" />
              {t("aboutWhatTitle")}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-snug">
              {t("aboutWhatTitle")}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t("aboutWhatDesc")}
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-[#008CBA]/10 to-[#008CBA]/5 rounded-3xl p-10 text-center">
              <div className="w-20 h-20 bg-[#008CBA] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="w-10 h-10 text-white" />
              </div>
              <p className="text-gray-700 font-medium text-lg italic">
                "{t("aboutPhilosophyDesc")}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#008CBA]/10 rounded-2xl flex items-center justify-center mb-5">
                <Eye className="w-7 h-7 text-[#008CBA]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ✦ {t("aboutVisionTitle")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("aboutVisionDesc")}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#008CBA]/10 rounded-2xl flex items-center justify-center mb-5">
                <Heart className="w-7 h-7 text-[#008CBA]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ✦ {t("aboutMissionTitle")}
              </h3>
              <p className="text-gray-600 mb-4">{t("aboutMissionDesc")}</p>
              <ul className="space-y-2">
                {missionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#008CBA] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#008CBA] font-semibold text-sm uppercase tracking-wider mb-3">
            <div className="w-8 h-0.5 bg-[#008CBA]" />
            <span>{t("aboutOfferTitle")}</span>
            <div className="w-8 h-0.5 bg-[#008CBA]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            ✦ {t("aboutOfferTitle")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {offerItems.map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#008CBA]/30 transition-all group"
            >
              <div className="w-12 h-12 bg-[#008CBA]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#008CBA] transition-colors">
                <Icon className="w-6 h-6 text-[#008CBA] group-hover:text-white transition-colors" />
              </div>
              <p className="text-gray-700 font-medium leading-relaxed pt-2">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Wijha + Philosophy */}
      <section className="bg-linear-to-br from-[#008CBA] to-[#005f80] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">✦ {t("aboutWhyTitle")}</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            {t("aboutWhyDesc")}
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl px-10 py-8 border border-white/20 max-w-2xl mx-auto">
            <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-3 text-blue-100">
              ✦ {t("aboutPhilosophyTitle")}
            </h3>
            <p className="text-2xl font-bold leading-relaxed">
              "{t("aboutPhilosophyDesc")}"
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default AboutUs;

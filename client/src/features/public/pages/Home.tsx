import { useEffect, useState, type Ref } from "react";
import CounterCard from "@/features/public/components/CounterCard";
import FadeText from "@/features/public/components/FadeText";
import { useInView } from "@/features/public/components/hooks/useInView";


import { Shield, MapPin, Clock, DollarSign, Award, Target, Rocket, ArrowRight } from "lucide-react";
import img3 from "@/assets/2.png";
import img4 from "@/assets/3.png";
import img5 from "@/assets/4.png";
import img6 from "@/assets/9.png";
import img7 from "@/assets/6.png";
import img8 from "@/assets/7.png";
import img13 from "@/assets/13.png";
import img14 from "@/assets/14.png";
import img15 from "@/assets/15.png";
import img16 from "@/assets/img22.png";
import add1 from "@/assets/add1.jpg";
import add2 from "@/assets/add2.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollReveal from "scrollreveal";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import moment from "moment/min/moment-with-locales";
import addressData from "@/utils/address.json";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface JobPost {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  job_mode: string;
  min_salary: number | null;
  max_salary: number | null;
  created_at: string;
  logo: string | null;
}

export default function JobSearchLanding() {
  useDocumentTitle();
  const navigate = useNavigate();
  const { t, i18n: i18nInstance } = useTranslation("public");
  const isRTL = i18nInstance.dir() === "rtl";

  const translateLocation = (location: string) => {
    if (i18nInstance.language !== "ar") return location;
    const entry = addressData.find(
      (a) => a.label.toLowerCase() === location.toLowerCase(),
    );
    return entry ? entry.labelAr : location;
  };

  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(false);

  useEffect(() => {
    ScrollReveal().reveal(".left-reveal", {
      distance: "50px",
      duration: 800,
      easing: "ease-in-out",
      origin: "left",
      interval: 200,
    });
    ScrollReveal().reveal(".right-reveal", {
      distance: "50px",
      duration: 800,
      easing: "ease-in-out",
      origin: "right",
      interval: 200,
    });
    ScrollReveal().reveal(".bottom-reveal", {
      distance: "50px",
      duration: 800,
      easing: "ease-in-out",
      origin: "bottom",
      interval: 200,
    });
    ScrollReveal().reveal(".top-reveal", {
      distance: "50px",
      duration: 800,
      easing: "ease-in-out",
      origin: "top",
      interval: 200,
    });
  }, []);

  useEffect(() => {
    const getJobPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/job-posts?status=Active&limit=6`,
        );
        if (res.ok) {
          const data = await res.json();
          setJobPosts(data.jobs ?? []);
        } else {
          setJobsError(true);
        }
      } catch {
        setJobsError(true);
      } finally {
        setJobsLoading(false);
      }
    };
    getJobPosts();
  }, []);

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: t("feature1Title"),
      description: t("feature1Desc"),
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: t("feature2Title"),
      description: t("feature2Desc"),
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: t("feature3Title"),
      description: t("feature3Desc"),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("feature4Title"),
      description: t("feature4Desc"),
    },
  ];

  const testimonials = [
    {
      name: "Pr. Sid Ahmed Hadj Aissa",
      role: "المنسق الوطني لمسرعات الأعمال الجامعية",
      image: "SHA",
      text: 'تجربة ممتازة مع منصة "وجهة". واجهة المستخدم سهلة جدا و الوصول الى الفرص الوظيفية كان سريعا وفعالا. أنصح بها بشدة لكل الباحثين عن عمل والذين يبحثون عن تجربة احترافية ومنظمة',
    },
    {
      name: "GOLDEN SBM",
      role: "Humain Resources",
      image: "GS",
      text: "الحمد لله لقد تم توظيف عدد من المرشحين من خلال وجهة و ذلك في إطار عمل دوام جزئي و نثمن مبادرتكم و نتطلع إلى إستقبال ترشيحات مستقبلا",
    },
    {
      name: "GROUP TAIF",
      role: "Humain Resources",
      image: "GT",
      text: "تم توظيف 3 أشخاص كما قد تم التواصل مع مرشحين آخرين في مختلف المناصب و هم قيد الدراسة شكرا على هاته المنصة التي سهلت لنا و قربت المسافات",
    },
  ];

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max)
      return `${min.toLocaleString()} - ${max.toLocaleString()} DA`;
    if (min) return `${min.toLocaleString()}+ DA`;
    return `Up to ${max!.toLocaleString()} DA`;
  };

  // const formatDate = (dateStr: string) => {
  //   const date = new Date(dateStr);
  //   const now = new Date();
  //   const diffMs = now.getTime() - date.getTime();
  //   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  //   if (diffDays === 0) return "Today";
  //   if (diffDays === 1) return "1 day ago";
  //   if (diffDays < 7) return `${diffDays} days ago`;
  //   if (diffDays < 14) return "1 week ago";
  //   return `${Math.floor(diffDays / 7)} weeks ago`;
  // };
  const { ref, inView } = useInView();
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-[#06192d] to-[#78b1ed] pointer-events-auto">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section
        dir={isRTL ? "rtl" : "ltr"}
        className=""
      >
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full h-screen">
          <div className="absolute inset-0 bg-[url('/src/assets/gg.png')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-[#06192d]/70"></div>
          <div className="relative z-10 max-w-7xl mx-auto p-10"></div>
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="pt-0">
              <FadeText
                text={t("yourCareer") + " " + t("startHere")}
                mode="words"
                stagger={150}
                duration={800}
                className="text-4xl md:text-6xl font-bold text-white justify-center"
              />
              <p
                ref={ref as Ref<HTMLParagraphElement>}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(200px)",
                  transition: "opacity 5s ease, transform 2s ease",
                }}
                className="text-lg text-white/80 leading-relaxed mt-10"
              >
                {t("heroText")}
              </p>
              <div className="flex flex-col sm:flex-row gap-10 mt-15 justify-center">
              <button
                ref={ref as Ref<HTMLButtonElement>}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(200px)",
                  transition: "opacity 5s ease, transform 2s ease",
                }}
                onClick={() => navigate("/jobSearch")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl
                           bg-linear-to-r from-[#008CBA] to-[#005F7F]
                           text-white font-semibold text-base
                           shadow-[0_4px_16px_rgba(0,140,186,0.3)]
                           hover:shadow-[0_8px_28px_rgba(0,140,186,0.5)]
                           hover:-translate-y-0.5 transition-all duration-200"
              >
                <ArrowRight size={18} />
                {t("exploreJobs")}
              </button>
              <button
                ref={ref as Ref<HTMLButtonElement>}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(200px)",
                  transition: "opacity 5s ease, transform 2s ease",
                }}
                onClick={() => navigate("/dashboard?dash=profileAccess")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl
                           border border-black text-[#06192d] bg-amber-50 font-semibold text-base
                           hover:border-white hover:text-white hover:bg-[#06192d] hover:shadow-[0_4px_16px_rgba(255,255,255,0.3)]
                           transition-all duration-200"
              >
                {t("forEmployers")}
              </button>
            </div>
            </div>
          </div>
        </div>
      </section>

                 
            {/* Featured Jobs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bottom-reveal text-center mb-16">
            <div className="inline-block bg-[#06192d]/50 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 w-70">
              {t("jobsTitle")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("jobsSubtitle")}
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              {t("jobsText")}
            </p>
          </div>

          {jobsLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-linear-to-br from-white to-[#F0F8FF] rounded-2xl p-6 border-2 border-[#008CBA] animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              ))}
            </div>
          )}

          {!jobsLoading && jobsError && (
            <p className="text-center text-gray-500">{t("jobsError")}</p>
          )}

          {!jobsLoading && !jobsError && jobPosts.length === 0 && (
            <p className="text-center text-gray-500">{t("jobsEmpty")}</p>
          )}

          {!jobsLoading && !jobsError && jobPosts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPosts.map((job) => {
                const salary = formatSalary(job.min_salary, job.max_salary);
                return (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobPost/${job.id}`)}
                    className="right-reveal group bg-linear-to-br from-white to-[#F0F8FF] rounded-2xl p-6 border-2 border-[#008CBA] hover:border-[#005F7F] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {job.logo ? (
                        <img
                          src={job.logo}
                          alt={job.company_name}
                          className="w-10 h-10 rounded-lg object-contain border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#008CBA] to-[#005F7F] flex items-center justify-center text-white font-bold text-sm">
                          {job.company_name?.charAt(0) ?? "?"}
                        </div>
                      )}
                      <span className="text-gray-600 font-medium">
                        {job.company_name}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#008CBA] transition-colors">
                      {job.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-[#008CBA]" />
                        {translateLocation(job.location)}
                      </div>
                      {salary && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-[#008CBA]" />
                          {salary}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-[#008CBA]" />
                        {t("jobPosted")}{" "}
                        {moment(job.created_at)
                          .locale(i18nInstance.language)
                          .fromNow()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.job_type && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                          {t(job.job_type)}
                        </span>
                      )}
                      {job.job_mode && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                          {t(job.job_mode)}
                        </span>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobPost/${job.id}`);
                        }}
                        className="px-4 py-2 bg-linear-to-r from-[#008CBA] to-[#005F7F] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#008CBA]/30 transition-all transform hover:scale-105"
                      >
                        {t("jobApply")}
                      </button>
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 border-border-gray-200 relative overflow-hidden ">
              <div className="absolute inset-0 bg-[url('/src/assets/gg.png')] bg-cover bg-center bg-fixed"></div>
           <div className="absolute inset-0 bg-[#06192d]/70"></div>
  <div className="relative z-10 max-w-7xl mx-auto p-10">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full justify-between px-6">
      <CounterCard
        label={t("statsCvs")}
        target={5000}
        suffix="+"
        className=""
      />
      <CounterCard
        label={t("statsCompanies")}
        target={200}
        suffix="+"
        className=""
      />
      <CounterCard
        label={t("statsJobs")}
        target={100}
        suffix="+"
        className=""
      />
    </div>
  </div>
</section>

      {/* Features */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bottom-reveal text-center mb-16">
            <div className="inline-block  bg-[#06192d]/50 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 w-70">
              {t("featuresTitle")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("featuresSubtitle")}
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              {t("featuresText")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="left-reveal group relative bg-linear-to-br from-white to-[#F0F8FF] p-8 rounded-2xl border-2 border-[#008CBA] hover:border-[#005F7F] transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-[#008CBA]/10 to-transparent rounded-bl-3xl"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-linear-to-br from-[#008CBA] to-[#005F7F] rounded-xl flex items-center justify-center text-white mb-4 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Sponsored Ads Section */}
      <section className="py-10">
        <div className="max-w-7xl text-center mb-16 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-block  bg-[#06192d]/50 text-white px-4 py-2 mb-10 rounded-full text-sm font-semibold w-70">
          <p className="text-sm  uppercase tracking-widest text-center">
            {t("sponsored")}
          </p>
          </div>
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden h-64 md:h-auto">
              <img
                src={add1}
                alt="Advertisement"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="rounded-2xl overflow-hidden h-64 md:h-auto">
              <img
                src={add2}
                alt="Advertisement"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Employers */}
      <section className="py-10 overflow-hidden border-t-2 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bottom-reveal text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              {t("employersTitle")}
            </h2>
            <p className="text-lg text-[#cccccc]">{t("employersSubtitle")}</p>
          </div>
        </div>
        {/* Infinite marquee strip */}
        <div dir="ltr" className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-transparent" />
          <div
            className={`flex gap-6 w-max ${isRTL ? "animate-marquee-rtl" : "animate-marquee"}`}
          >
            {[
              img8,
              img3,
              img4,
              img5,
              img6,
              img7,
              img13,
              img14,
              img15,
              img16,
              img8,
              img3,
              img4,
              img5,
              img6,
              img7,
              img13,
              img14,
              img15,
              img16,
            ].map((src, i) => (
              <div
                key={i}
                className="shrink-0 w-36 h-36 flex items-center justify-center "
              >
                <img
                  src={src}
                  alt=""
                  className="h-36 w-full bg-white/30 border-2 border-white/90 rounded-lg object-contain  transition-all duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110 hover:scale-115"  
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bottom-reveal text-center mb-16">
            <div className="inline-block  bg-[#06192d]/50 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 w-70">
              {t("testimonialsTitle")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              {t("testimonialsSubtitle")}
            </h2>
            <p className="text-xl text-[#cccccc]">{t("testimonialsText")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="left-reveal bg-linear-to-br from-white to-[#F0F8FF] rounded-2xl p-8 border-2 border-[#008CBA] hover:border-[#005F7F] transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-linear-to-br from-[#008CBA] to-[#005F7F] rounded-2xl flex items-center justify-center text-white font-bold text-xl ltr:mr-4 rtl:ml-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="bottom-reveal relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-4xl md:text-5xl font-bold text-[#06192d] mb-6 leading-tight">
            {t("ctaTitle")}
          </h2>
          <p className="text-xl text-[#06192d] mb-10 max-w-2xl mx-auto">
            {t("ctaText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard?dash=profileAccess")}
              className="cursor-pointer px-8 py-4 
              bg-linear-to-r from-[#008CBA] to-[#005F7F]
               text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform
               hover:scale-105 shadow-[0_4px_16px_ [#06192d]]
              hover:shadow-[0_8px_28px_rgba(0,140,186,0.5)]
              hover:-translate-y-0.5 transition-all duration-200"
            >
              {t("ctaButton")}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
);}


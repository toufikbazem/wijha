import { useEffect, useState } from "react";
import {
  Shield,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Target,
  Rocket,
} from "lucide-react";
import Hero from "@/assets/Hero.png";
import img3 from "@/assets/2.png";
import img4 from "@/assets/3.png";
import img5 from "@/assets/4.png";
import img6 from "@/assets/9.png";
import img7 from "@/assets/6.png";
import img8 from "@/assets/7.png";
import img13 from "@/assets/13.png";
import img14 from "@/assets/14.png";
import img15 from "@/assets/15.png";
import add1 from "@/assets/add1.jpg";
import add2 from "@/assets/add2.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollReveal from "scrollreveal";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import moment from "moment/min/moment-with-locales";
import addressData from "@/utils/address.json";

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

  const jobCategories = [
    { id: 1, name: t("cat1") },
    { id: 2, name: t("cat2") },
    { id: 3, name: t("cat3") },
    { id: 4, name: t("cat4") },
    { id: 5, name: t("cat5") },
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section
        dir={isRTL ? "rtl" : "ltr"}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-cyan-50"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#008CBA]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="left-reveal">
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight text-center rtl:lg:text-right ltr:lg:text-left">
                {t("yourCareer")}{" "}
                <span className="lg:block bg-[#008CBA] bg-clip-text text-transparent">
                  {t("startHere")}
                </span>
              </h1>
              <p className="text-center rtl:lg:text-right ltr:lg:text-left text-xl text-gray-600 mb-8 leading-relaxed">
                {t("heroText")}
              </p>
              <div className="flex flex-col sm:justify-center lg:justify-start sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/jobSearch")}
                  className="cursor-pointer px-4 py-2 rounded-xl text-white font-semibold bg-[#008CBA] hover:bg-[#00668C] transition-all flex items-center justify-center"
                >
                  {t("exploreJobs")}
                </button>
                <button
                  onClick={() => navigate("/dashboard?dash=profileAccess")}
                  className="cursor-pointer hover:text-white box-border hover:bg-[#008CBA] text-[#008CBA] border-2 border-[#008CBA] rounded-xl px-4 py-2 font-medium transition"
                >
                  {t("forEmployers")}
                </button>
              </div>
            </div>
            <div className="right-reveal hidden lg:flex justify-center items-center">
              <img src={Hero} alt="hero" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 bg-gray-50">
        <div className="bottom-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("categoriesTitle")}
            </h2>
            <p className="text-lg text-gray-600">{t("categoriesSubtitle")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {jobCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate("/jobSearch")}
                className="first:bg-linear-to-br from-primary-500 via-primary-400 to-primary-700 px-6 py-3 rounded-xl font-semibold transition-all bg-white text-gray-700 hover:shadow-md"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bottom-reveal text-center mb-16">
            <div className="inline-block bg-[#008CBA]/10 text-[#008CBA] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {t("featuresTitle")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("featuresSubtitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("featuresText")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="left-reveal group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#008CBA]/10 to-transparent rounded-bl-3xl"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#008CBA] to-[#005F7F] rounded-xl flex items-center justify-center text-white mb-4 transition-transform">
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

      {/* Featured Jobs */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bottom-reveal text-center mb-16">
            <div className="inline-block bg-[#008CBA]/10 text-[#008CBA] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {t("jobsTitle")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("jobsSubtitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("jobsText")}
            </p>
          </div>

          {jobsLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 animate-pulse"
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
                    className="right-reveal group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#008CBA] hover:shadow-2xl transition-all duration-300 cursor-pointer"
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

      {/* Sponsored Ads Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-4">
            {t("sponsored")}
          </p>
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
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bottom-reveal text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("employersTitle")}
            </h2>
            <p className="text-lg text-gray-600">{t("employersSubtitle")}</p>
          </div>
        </div>
        {/* Infinite marquee strip */}
        <div dir="ltr" className="relative w-full overflow-hidden">
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white to-transparent"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent"
          />
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
              img8,
              img3,
              img4,
              img5,
              img6,
              img7,
              img13,
              img14,
              img15,
            ].map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-36 h-36 flex items-center justify-center"
              >
                <img
                  src={src}
                  alt=""
                  className="max-h-36 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bottom-reveal text-center mb-16">
            <div className="inline-block bg-[#008CBA]/10 text-[#008CBA] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {t("testimonialsTitle")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("testimonialsSubtitle")}
            </h2>
            <p className="text-xl text-gray-600">{t("testimonialsText")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="left-reveal bg-white rounded-2xl p-8 shadow-lg"
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#008CBA] via-[#006D94] to-[#005F7F]"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="bottom-reveal relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t("ctaTitle")}
          </h2>
          <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
            {t("ctaText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/SignIn")}
              className="cursor-pointer px-8 py-4 bg-white text-[#008CBA] rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              {t("ctaButton")}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

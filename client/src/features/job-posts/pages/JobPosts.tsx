import { useEffect, useState } from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  Bookmark,
  Building2,
  GraduationCap,
  Globe,
} from "lucide-react";

import { useParams, useNavigate, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  createApplication,
  saveJobPost,
  unsaveJobPost,
} from "@/features/auth/userSlice";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Footer from "@/features/public/components/Footer";
import Header from "@/features/public/components/Header";

export default function JobPosts() {
  const { user } = useSelector((state: any) => state.user);
  const [data, setData] = useState<any>(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [onSaving, setOnSaving] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t } = useTranslation("jobs");
  const { t: tc } = useTranslation("common");
  const { id } = useParams();

  useEffect(() => {
    const getJobData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/job-posts/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await res.json();

        if (res.ok) {
          console.log("Fetched job data:", data);
          setData(data);
          setSaved(user?.saved?.includes(data?.id));
          setApplied(user?.applications?.includes(data?.id));
        } else {
          console.error("Failed to fetch job data", data);
        }
      } catch (error) {
        console.error("Error fetching job data", error);
      } finally {
        setLoading(false);
      }
    };

    // const getApplication = async () => {
    //   try {
    //     const res = await fetch(
    //       `${import.meta.env.VITE_API_URL}/api/application/get?jobSeekerId=${currentUser.userId}&jobOfferId=${id}`,
    //       {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       },
    //     );
    //     const data = await res.json();
    //     if (res.ok) {
    //       if (data) {
    //         console.log(data);
    //         setApplied(true);
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error fetching application data", error);
    //   }
    // };

    // if (user) {
    //   getApplication();
    // }

    getJobData();
  }, []);

  const handleSave = async (id: any) => {
    setOnSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/saved-jobs`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ jobId: id, userId: user.id }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        if (data.error_code === "ACCOUNT_INACTIVE") {
          toast.error(t("accountInactive"));
        } else {
          toast.error(t("failedSave"));
        }
      } else {
        toast.success(t("successSave"));
        setSaved(true);
        dispatch(saveJobPost(id));
      }
    } catch (error) {
      toast.error(t("failedSave"));
    } finally {
      setOnSaving(false);
    }
  };
  const handleUnsave = async (id: any) => {
    setOnSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/saved-jobs`,
        {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({ jobId: id, userId: user.id }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        if (data.error_code === "ACCOUNT_INACTIVE") {
          toast.error(t("accountInactive"));
        } else {
          toast.error(t("failedUnsave"));
        }
      } else {
        toast.success(t("successUnsave"));
        setSaved(false);
        dispatch(unsaveJobPost(id));
      }
    } catch (error) {
      toast.error(t("failedUnsave"));
    } finally {
      setOnSaving(false);
    }
  };

  const handleApplication = async () => {
    setApplyLoading(true);
    if (!user.cv) {
      toast.error(t("uploadCV"));
      setApplyLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/applications`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ jobId: data.id, jobseekerId: user.id }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const result = await res.json();
      if (!res.ok) {
        if (result.error_code === "ACCOUNT_INACTIVE") {
          toast.error(t("accountInactive"));
        } else {
          toast.error(t("failedApply"));
        }
      } else {
        dispatch(createApplication(data.id));
        setApplied(true);
        toast.success(t("successApply"));
      }
    } catch (error) {
      toast.error(t("failedApply"));
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      {!loading ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="flex flex-col lg:flex-row gap-6 px-8 py-6">
              <div className="flex justify-between">
                {data && data.logo ? (
                  <img
                    src={data?.logo}
                    alt="logo"
                    className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-semibold text-5xl mb-3">
                      {data?.company_name?.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 h-fit lg:hidden">
                  {!user && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="cursor-pointer px-8 py-3 bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md">
                          {t("applyNow")}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("needsLogin")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("loginOrCreate")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors shadow-md">
                            {tc("cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => navigate("/signIn")}
                            className="bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md"
                          >
                            {tc("continue")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {user && user?.role === "jobseeker" && !applied && (
                    <button
                      onClick={() => handleApplication()}
                      className="cursor-pointer px-8 py-3 bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md"
                    >
                      {applyLoading ? (
                        <>
                          <Spinner className="w-5 h-5 mr-2 animate-spin" />
                          <span>{t("applying")}</span>
                        </>
                      ) : (
                        <>Apply Now</>
                      )}
                    </button>
                  )}
                  {user && user?.role === "jobseeker" && applied && (
                    <button className="cursor-pointer px-8 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md cursor-default flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {t("applied")}
                    </button>
                  )}
                  {user && user?.role === "employer" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="cursor-pointer px-8 py-3 bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md">
                          {t("applyNow")}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("employersCantApply")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("loginJobseeker")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors shadow-md">
                            {tc("cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction className="bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md">
                            {tc("continue")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {user?.role === "jobseeker" && saved && (
                    <button
                      disabled={onSaving}
                      onClick={() => handleUnsave(data.id)}
                      className=" cursor-pointer p-3 rounded-xl bg-gray-100 text-gray-600  transition-all"
                    >
                      <Bookmark className="w-5 h-5 text-yellow-300 fill-current" />
                    </button>
                  )}
                  {user?.role === "jobseeker" && !saved && (
                    <button
                      disabled={onSaving}
                      onClick={() => handleSave(data.id)}
                      className="cursor-pointer p-3 rounded-xl bg-gray-100 text-gray-600 fill-current hover:text-yellow-300 transition-all"
                    >
                      <Bookmark className={`w-5 h-5`} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h1 className=" text-3xl font-bold text-gray-900 mb-2">
                  {data && data.title}
                </h1>
                <p className="cursor-pointer text-xl font-medium text-gray-600 mb-3">
                  <Link to={`/companyProfile/${data?.employerid}`}>
                    {data && data.company_name}
                  </Link>
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008CBA] backdrop-blur-sm rounded-full text-white text-sm">
                    <MapPin size={14} />
                    {data.location}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008CBA] backdrop-blur-sm rounded-full text-white text-sm">
                    <Briefcase size={14} />
                    {data.job_type}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008CBA] backdrop-blur-sm rounded-full text-white text-sm">
                    <Clock size={14} />
                    {data.job_mode}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008CBA] backdrop-blur-sm rounded-full text-white text-sm">
                    <Calendar size={14} />
                    {moment(data.created_at).fromNow()}
                  </span>
                </div>
              </div>
              <div className="lg:flex gap-2 h-fit hidden">
                {!user && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="cursor-pointer px-8 py-3 bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md">
                        Apply Now
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          You need to be logged in to apply
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Please log in or create an account to apply for this
                          job.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors shadow-md">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => navigate("/signIn")}
                          className="bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {user && user?.role === "jobseeker" && !applied && (
                  <button
                    onClick={() => handleApplication()}
                    className="cursor-pointer px-8 py-3 bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md"
                  >
                    {applyLoading ? (
                      <>
                        <Spinner className="w-5 h-5 mr-2 animate-spin" />
                        {t("applying")}
                      </>
                    ) : (
                      <>Apply Now</>
                    )}
                  </button>
                )}
                {user && user?.role === "jobseeker" && applied && (
                  <button className="cursor-pointer px-8 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md cursor-default flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {t("applied")}
                  </button>
                )}
                {user && user?.role === "employer" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="cursor-pointer px-8 py-3 bg-[#008CBA] text-white font-semibold rounded-xl hover:bg-[#0077A3] transition-colors shadow-md">
                        Apply Now
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Employers cannot apply for job offers
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Please log in with a job seeker account to apply for
                          this job.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors shadow-md">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-primary-500! text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-md">
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {user?.role === "jobseeker" && saved && (
                  <button
                    disabled={onSaving}
                    onClick={() => handleUnsave(data.id)}
                    className=" cursor-pointer p-3 rounded-xl bg-gray-100 text-gray-600  transition-all"
                  >
                    <Bookmark className="w-5 h-5 text-yellow-300 fill-current" />
                  </button>
                )}
                {user?.role === "jobseeker" && !saved && (
                  <button
                    disabled={onSaving}
                    onClick={() => handleSave(data.id)}
                    className="cursor-pointer p-3 rounded-xl bg-gray-100 text-gray-600 fill-current hover:text-yellow-300 transition-all"
                  >
                    <Bookmark className={`w-5 h-5`} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-6">
            {/* Left Column - Main Details */}
            <div className="col-span-3 xl:col-span-2 space-y-6">
              {/* Quick Info Grid */}
              <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
                <div className="flex flex-col gap-3 lg:border-r-2 lg:border-gray-200 lg:pr-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#E6F7FB] rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#008CBA]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{tc("industry")}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#E6F7FB] rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#008CBA]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {tc("experienceLevel")}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.experience_level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#E6F7FB] rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-[#008CBA]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {tc("educationLevel")}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.education_level}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#E6F7FB] rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#008CBA]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("deadline")}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data && moment(data.deadline).format("MMMM D, YYYY")}
                      </p>
                    </div>
                  </div>
                  {data && data.min_salary && data.max_salary && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-[#E6F7FB] rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[#008CBA]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Salary Range</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {data && data.salaryRange}$
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#E6F7FB] rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#008CBA]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("numberOfPositions")}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {data.number_of_positions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Job Description */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#008CBA] rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("jobDescription")}
                  </h2>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {data.description}
                </p>
              </div>
            </div>

            {/* Right Column - Skills & Actions */}
            <div className="col-span-2 xl:col-span-1 space-y-6">
              {/* Required Skills */}
              <aside className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#008CBA] rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t("aboutCompany")}
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">{t("company")}</p>
                    <p className="font-bold text-gray-900 text-lg">
                      {data.company_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Industry</p>
                      <p className="whitespace-nowrap truncate font-semibold text-gray-900 text-sm">
                        {/* {data && data.employerIdInfo.industry} */}
                        {data.employer_industry}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">{t("size")}</p>
                      <p className="whitespace-nowrap font-semibold text-gray-900 text-sm">
                        {/* {data && data.employerIdInfo.size} */}
                        {data.employer_size}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        {t("founded")}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {/* {data && data.employerIdInfo.foundingYear} */}
                        {data.employer_founded_year}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Globe className="w-4 h-4 text-gray-400 mb-1" />
                      <a
                        href={`http://${data.employer_website}`}
                        className="font-semibold text-blue-600 hover:underline text-sm block truncate"
                      >
                        {tc("website")}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {/* {data && data.employerIdInfo.description} */}
                    {data.employer_description}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/companyProfile/${data.employerid}`)}
                  className="cursor-pointer w-full px-4 py-3 bg-[#008CBA] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  {t("viewCompanyProfile")}
                </button>
              </aside>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <Skeleton className="h-8 w-2/3 bg-gray-300" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-md bg-gray-300" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 bg-gray-300" />
                <Skeleton className="h-3 w-32 bg-gray-300" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Job meta */}
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-24 bg-gray-300" />
                <Skeleton className="h-4 w-28 bg-gray-300" />
                <Skeleton className="h-4 w-20 bg-gray-300" />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-40 bg-gray-300" />
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-4 w-5/6 bg-gray-300" />
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-52 bg-gray-300" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full bg-gray-300" />
                ))}
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-48 bg-gray-300" />
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-11/12 bg-gray-300" />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Apply box */}
              <div className="space-y-4 rounded-lg">
                <Skeleton className="h-10 w-full rounded-md bg-gray-300" />
                <Skeleton className="h-4 w-3/4 bg-gray-300" />
              </div>

              {/* Job info */}
              <div className="space-y-4 rounded-lg">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-gray-300" />
                    <Skeleton className="h-4 w-28 bg-gray-300" />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

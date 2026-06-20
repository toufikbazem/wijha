import { useEffect, useState } from "react";
import {
  Bookmark,
  Building2,
  Edit2,
  FileText,
  Save,
  Settings,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ProfileSchema } from "../Schema";
import ProfileHeader from "../components/ProfileHeader";
import ProfileContent from "../components/ProfileContent";
import { toast } from "sonner";
import { updateProfile } from "@/features/auth/userSlice";
import { useDispatch } from "react-redux";
import DashSaved from "./DashSaved";
import DashApplication from "./DashApplications";
import DashSettings from "./DashSettings";
import Header from "@/features/public/components/Header";
import ProfileCompletionCard from "@/components/ProfileCompletionCard";

const TABS = ["Profile", "Applications", "SavedJobs"] as const;
type Tab = (typeof TABS)[number];

const getTabFromParam = (value: string | null): Tab => {
  const match = TABS.find(
    (tab) => tab.toLowerCase() === (value ?? "").toLowerCase(),
  );
  return match ?? "Profile";
};

const DashProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("jobseeker");
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = getTabFromParam(searchParams.get("tab"));

  const setTab = (next: Tab) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("tab", next.toLowerCase());
        return params;
      },
      { replace: true },
    );
  };
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [languages, setLanguages] = useState<
    Array<{ language: string; level: string }>
  >([]);
  const [experiences, setExperiences] = useState<
    Array<{ company: string; role: string; startDate: string; endDate: string }>
  >([]);
  const [educations, setEducations] = useState<
    Array<{
      school: string;
      degree: string;
      startDate: string;
      endDate: string;
    }>
  >([]);

  const [profile, setProfile] = useState<{
    first_name?: string;
    last_name?: string;
    professional_title?: string;
    professional_summary?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    gender?: string;
    resume?: string;
    profile_image?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    experience_level?: string;
    education_level?: string;
    skills?: string[];
    cv?: string;
    status?: "active" | "unverified" | "suspended" | "deactivated";
  }>({});

  const [applicationsTotal, setApplicationsTotal] = useState(0);
  const [savedJobsTotal, setSavedJobsTotal] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const { user } = useSelector((state: any) => state.user);

  const [profileCompletion, setProfileCompletion] = useState(0);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: profile?.first_name ? profile?.first_name : "",
      last_name: profile?.last_name ? profile?.last_name : "",
      professional_title: profile?.professional_title
        ? profile?.professional_title
        : "",
      professional_summary: profile?.professional_summary
        ? profile?.professional_summary
        : "",
      email: profile?.email ? profile?.email : "",
      phone_number: profile?.phone_number ? profile?.phone_number : "",
      address: profile?.address ? profile?.address : "",
      resume: profile?.resume ? profile?.resume : "",
      linkedin: profile?.linkedin ? profile?.linkedin : "",
      github: profile?.github ? profile?.github : "",
      portfolio: profile?.portfolio ? profile?.portfolio : "",
      experience_level: profile?.experience_level
        ? profile?.experience_level
        : "",
      education_level: profile?.education_level ? profile?.education_level : "",
      skills: profile?.skills ? profile?.skills : [],
      profile_image: profile?.profile_image ? profile?.profile_image : "",
      cv: profile?.cv ? profile?.cv : "",
    },
  });

  useEffect(() => {
    const getUserProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobseekers/${user?.user_id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok) {
          setLanguages(data.languages || []);
          setExperiences(data.experiences || []);
          setEducations(data.educations || []);
          setProfile({
            first_name: data.first_name,
            last_name: data.last_name,
            professional_title: data.professional_title,
            email: data.email,
            phone_number: data.phone_number,
            address: data.address,
            gender: data.gender,
            resume: data.resume,
            profile_image: data.profile_image,
            linkedin: data.linkedin,
            github: data.github,
            portfolio: data.portfolio,
            experience_level: data.experience_level,
            education_level: data.education_level,
            skills: data.skills,
            cv: data.cv,
            status: data.status,
          });
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, []);

  useEffect(() => {
    const getStats = async () => {
      if (!user?.id) return;
      setStatsLoading(true);
      try {
        const [applicationsRes, savedJobsRes, dashboardStatsRes] =
          await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_URL}/api/v1/applications?jobseekerId=${user.id}&page=1&limit=1`,
              { method: "GET", credentials: "include" },
            ),
            fetch(
              `${import.meta.env.VITE_API_URL}/api/v1/saved-jobs?jobseekerId=${user.id}&page=1&limit=1`,
              { method: "GET", credentials: "include" },
            ),
            fetch(
              `${import.meta.env.VITE_API_URL}/api/v1/jobseekers/dashboard-stats`,
              { method: "GET", credentials: "include" },
            ),
          ]);
        const applicationsData = await applicationsRes.json();
        const savedJobsData = await savedJobsRes.json();
        const dashboardStatsData = await dashboardStatsRes.json();
        if (applicationsRes.ok)
          setApplicationsTotal(applicationsData.total || 0);
        if (savedJobsRes.ok) setSavedJobsTotal(savedJobsData.total || 0);
        if (dashboardStatsRes.ok)
          setProfileCompletion(dashboardStatsData.profileCompletion || 0);
      } catch (error) {
        console.error("Error fetching profile stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    getStats();
  }, [user?.id]);

  useEffect(() => {
    if (profile && profile.first_name) {
      form.reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        professional_title: profile.professional_title || "",
        email: profile.email,
        phone_number: profile.phone_number,
        professional_summary: profile.professional_summary || "",
        experience_level: profile.experience_level || "",
        education_level: profile.education_level || "",
        address: profile.address,
        gender: profile.gender,
        resume: profile.resume,
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
        skills: profile.skills || [],
        cv: profile.cv || "",
        profile_image: profile.profile_image || "",
      });
    }
  }, [profile]);

  const onSubmit = async (data: z.infer<typeof ProfileSchema>) => {
    setLoadingEdit(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/jobseekers/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );
      const result = await res.json();
      if (res.ok) {
        setProfile({ ...result, email: profile.email });
        dispatch(updateProfile({ ...result, email: profile.email }));
        toast.success(t("profileUpdated"));
      } else {
        if (result.error_code === "ACCOUNT_INACTIVE") {
          toast.error(t("accountInactive"));
        } else {
          toast.error(t("failedUpdateProfile") + ": " + result.message);
        }
      }
    } catch (error) {
      toast.error(t("errorUpdateProfile"));
    } finally {
      setIsEditing(false);
      setLoadingEdit(false);
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {loading && (
          <div className="space-y-8">
            {/* ===== Header ===== */}
            <div className="relative">
              {/* Cover image */}
              <Skeleton className="h-48 w-full rounded-lg bg-gray-200" />

              {/* Avatar + name */}
              <div className="flex items-end gap-4 mt-10 px-4">
                <Skeleton className="h-20 w-20 rounded-full bg-gray-200" />

                <div className="space-y-2 pb-2">
                  <Skeleton className="h-6 w-48 bg-gray-200" />
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                </div>
              </div>
            </div>

            {/* ===== Content ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-5 w-40" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-10/12" />
                  <Skeleton className="h-4 w-9/12" />
                </div>

                {/* Section */}
                <Skeleton className="h-5 w-32 mt-4 bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-5/6 bg-gray-200" />
                  <Skeleton className="h-4 w-4/6 bg-gray-200" />
                </div>
              </div>

              {/* Side content */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 bg-gray-200" />

                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-5/6 bg-gray-200" />
                  <Skeleton className="h-4 w-4/6 bg-gray-200" />
                </div>

                <Skeleton className="h-5 w-28 mt-4 bg-gray-200" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        )}
        {!loading && (
          <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 mb-16">
            {/* Top Navigation */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-6 py-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("myProfile")}
                </h1>
                <p className="mt-1 text-gray-600">{t("viewEditProfile")}</p>
              </div>
              <div className="mt-6 sm:mt-0 flex items-center gap-3">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                    className=" cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-[#008CBA] text-white rounded-xl hover:bg-[#007B9E] transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t("editProfile2")}
                  </button>
                ) : (
                  <>
                    <button
                      className=" cursor-pointer flex items-center gap-2 px-5 py-2.5  text-white rounded-xl bg-[#008CBA] hover:bg-[#007B9E] transition"
                      type="submit"
                    >
                      <Save className="w-4 h-4" />
                      {loadingEdit ? (
                        <>
                          <Spinner /> {t("loading")}
                        </>
                      ) : (
                        t("saveChanges")
                      )}
                    </button>
                  </>
                )}
              </div>
            </div> */}

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 py-4 pt-6">
              {/* Profile Completion */}
              <ProfileCompletionCard
                namespace="jobseeker"
                percentage={profileCompletion}
                loading={statsLoading}
              />

              {/* Applications */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-[#008CBA]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t("totalApplications")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("totalApplicationsDesc")}
                    </p>
                  </div>
                </div>
                {statsLoading ? (
                  <Skeleton className="h-9 w-16 bg-gray-200" />
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {applicationsTotal}
                  </span>
                )}
              </div>

              {/* Saved Jobs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t("totalSavedJobs")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("totalSavedJobsDesc")}
                    </p>
                  </div>
                </div>
                {statsLoading ? (
                  <Skeleton className="h-9 w-16 bg-gray-200" />
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {savedJobsTotal}
                  </span>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Card with Photo and Title */}
              <ProfileHeader
                profile={profile}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                loadingEdit={loadingEdit}
                setLoadingEdit={setLoadingEdit}
                form={form}
                setProfile={setProfile}
              />

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-6 overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                  <button
                    key={1}
                    type="button"
                    onClick={() => setTab("Profile")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer
                        ${
                          tab === "Profile"
                            ? "bg-[#008CBA] text-white shadow-sm"
                            : "text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900"
                        }`}
                  >
                    <User className="w-4 h-4" />
                    {t("profile")}
                  </button>
                  <button
                    key={2}
                    type="button"
                    onClick={() => setTab("Applications")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer
                        ${
                          tab === "Applications"
                            ? "bg-[#008CBA] text-white shadow-sm"
                            : "text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900"
                        }`}
                  >
                    <FileText className="w-4 h-4" />
                    {t("applications")}
                  </button>
                  <button
                    key={3}
                    type="button"
                    onClick={() => setTab("SavedJobs")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer
                        ${
                          tab === "SavedJobs"
                            ? "bg-[#008CBA] text-white shadow-sm"
                            : "text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900"
                        }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    {t("savedJobs")}
                  </button>
                </div>
              </div>

              {tab === "Profile" && (
                <ProfileContent
                  profile={profile}
                  setProfile={setProfile}
                  isEditing={isEditing}
                  form={form}
                  experiences={experiences}
                  setExperiences={setExperiences}
                  educations={educations}
                  setEducations={setEducations}
                  languages={languages}
                  setLanguages={setLanguages}
                />
              )}
              {tab === "SavedJobs" && <DashSaved />}
              {tab === "Applications" && <DashApplication />}
            </div>
          </div>
        )}
      </form>
    </>
  );
};
export default DashProfile;

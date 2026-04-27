import { useEffect, useState } from "react";
import { Edit2, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ProfileSchema } from "../Schema";
import ProfileHeader from "../components/ProfileHeader";
import ProfileContent from "../components/ProfileContent";
import { toast } from "sonner";
import { updateProfile } from "@/features/auth/userSlice";
import { useDispatch } from "react-redux";

const DashProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("jobseeker");
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

  const { user } = useSelector((state: any) => state.user);

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
      education_level: profile?.education_level
        ? profile?.education_level
        : "",
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
    if (profile && profile.first_name) {
      form.reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        professional_title: profile.professional_title || "",
        email: profile.email,
        phone_number: profile.phone_number,
        professional_summary: profile.professional_summary || "",
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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {loading && (
        <div className="space-y-8">
          {/* ===== Header ===== */}
          <div className="relative">
            {/* Cover image */}
            <Skeleton className="h-48 w-full rounded-lg bg-gray-200" />

            {/* Avatar + name */}
            <div className="flex items-end gap-4 mt-[-40px] px-4">
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
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
          {/* Top Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-6 py-4">
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
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header Card with Photo and Title */}
            <ProfileHeader
              profile={profile}
              isEditing={isEditing}
              form={form}
              setProfile={setProfile}
            />

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
          </div>
        </div>
      )}
    </form>
  );
};
export default DashProfile;

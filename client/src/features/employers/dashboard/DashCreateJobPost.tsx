import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { jobPostSchema } from "../schema";
import JobPostForm from "../components/JobPostForm";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const DashCreateJobPost = () => {
  const [state, setState] = useState("In-review");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation("employer");

  const form = useForm<z.infer<typeof jobPostSchema>>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      company_name: user?.company_name,
      industry: "",
      job_type: "",
      job_mode: "",
      experience_level: "",
      education_level: "",
      number_of_positions: "",
      min_salary: "",
      max_salary: "",
      deadline: undefined,
      is_anonymous: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof jobPostSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/job-posts`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            employerId: user?.id,
            state: state,
          }),
        },
      );
      const info = await res.json();
      if (res.ok) {
        toast.success(t("jobPostCreatedSuccess"));
        form.reset();
        navigate("/dashboard?tab=jobPosts");
      } else if (info.code === "NO_SUBSCRIPTION") {
        toast.error(t("noSubscriptionError"), {
          action: {
            label: t("subscribe"),
            onClick: () => navigate("/dashboard?tab=subscription"),
          },
        });
      } else if (info.code === "LIMIT_REACHED") {
        toast.error(t("limitReachedError"), {
          action: {
            label: t("viewPlans"),
            onClick: () => navigate("/dashboard?tab=subscription"),
          },
        });
      } else {
        toast.error(t("failedCreateJobPost"));
      }
    } catch (error) {
      toast.error(t("errorCreatingJobPost"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("createJobPost")}
            </h1>
            <p className="mt-1 text-gray-600">{t("jobPostReach")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <JobPostForm
            form={form}
            onSubmit={onSubmit}
            setState={setState}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default DashCreateJobPost;

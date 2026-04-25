import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jobPostSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import JobPostForm from "../components/JobPostForm";
import { useLocation, useNavigate } from "react-router";
import type z from "zod";
import { useTranslation } from "react-i18next";

function DashEditJob() {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("employer");
  const [state, setState] = useState("In-review");
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get("jobPost");
  const [jobPost, setJobPost] = useState({
    title: "",
    description: "",
    location: "",
    company_name: "TechCorp Solutions",
    industry: "",
    job_type: "",
    job_mode: "",
    experience_level: "",
    education_level: "",
    number_of_positions: "0",
    min_salary: "",
    max_salary: "",
    deadline: new Date(),
    is_anonymous: false,
  });

  const { user } = useSelector((state: any) => state.user);

  const form = useForm<z.infer<typeof jobPostSchema>>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      company_name: user?.company_name || "",
      industry: "",
      job_type: "",
      job_mode: "",
      experience_level: "",
      education_level: "",
      number_of_positions: "0",
      min_salary: "",
      max_salary: "",
      deadline: new Date(),
      is_anonymous: false,
    },
  });

  useEffect(() => {
    const getJobPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/job-posts/${tabFromUrl}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok) {
          setJobPost(data);
        } else {
          console.error("Failed to fetch job post:", data);
        }
      } catch (error) {
        console.error("Error fetching job post:", error);
      } finally {
        setLoading(false);
      }
    };
    getJobPost();
  }, [tabFromUrl]);

  useEffect(() => {
    if (jobPost && jobPost.title) {
      form.reset({
        title: jobPost.title,
        description: jobPost.description,
        location: jobPost.location,
        company_name: user?.company_name || "",
        industry: jobPost.industry,
        job_type: jobPost.job_type,
        job_mode: jobPost.job_mode,
        experience_level: jobPost.experience_level,
        education_level: jobPost.education_level,
        number_of_positions: jobPost.number_of_positions,
        min_salary: jobPost.min_salary ? jobPost.min_salary.toString() : "",
        max_salary: jobPost.max_salary ? jobPost.max_salary.toString() : "",
        deadline: new Date(jobPost.deadline),
        is_anonymous: jobPost.is_anonymous ?? false,
      });
    }
  }, [jobPost]);

  const onSubmit = async (data: z.infer<typeof jobPostSchema>) => {
    setLoadingSave(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/job-posts/${tabFromUrl}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, state }),
        },
      );
      const result = await res.json();
      if (res.ok) {
        toast.success(t("jobPostUpdatedSuccess"));
        navigate("/dashboard?tab=jobPosts");
      } else {
        console.error("Failed to update job post:", result);
      }
    } catch (error) {
      console.error("Error updating job post:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  console.log(form.getValues());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            {t("jobManagement")}
          </h1>
          <p className="text-slate-600">{t("manageJobPostings")}</p>
        </div>

        {/* Job Details Tab */}
        {loading ? (
          <div className="space-y-2">
            {/* ===== Page Header ===== */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-56 bg-gray-400" />
              <Skeleton className="h-4 w-96 bg-gray-400" />
            </div>

            {/* ===== Content ===== */}
            <div className="grid grid-cols-1  gap-3">
              {/* ===== Main Form ===== */}
              <div className="space-y-2">
                {/* Job title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-400" />
                  <Skeleton className="h-10 w-full bg-gray-400" />
                </div>

                {/* Job description */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40 bg-gray-400" />
                  <Skeleton className="h-32 w-full" />
                </div>

                {/* Two-column inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-28 bg-gray-400" />
                      <Skeleton className="h-10 w-full bg-gray-400" />
                    </div>
                  ))}
                </div>

                {/* Skills / tags */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36 bg-gray-400" />
                  <Skeleton className="h-10 w-full bg-gray-400" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Skeleton className="h-10 w-32 bg-gray-400" />
                  <Skeleton className="h-10 w-24 bg-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <JobPostForm
              form={form}
              onSubmit={onSubmit}
              setState={setState}
              loading={loadingSave}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashEditJob;

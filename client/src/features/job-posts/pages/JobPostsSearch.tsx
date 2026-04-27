import { useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  educationLevels,
  experienceLevels,
  industries,
  jobModes,
  jobTypes,
} from "@/utils/data";
import { jobPostsFilterSchema } from "../schema";
import JobPostsList from "../components/JobPostsList";
import JobPostsFilter from "../components/JobPostsFilter";
import Header from "@/features/public/components/Header";
import Footer from "@/features/public/components/Footer";

const JobSearchPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const limit = 4;
  const [totalJobs, setTotalJobs] = useState(0);
  const totalPages = Math.ceil(totalJobs / limit);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: any) => state.user);

  const fetchJobs = async (filters?: any) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/job-posts?page=${page}&limit=${limit}${filters?.search ? `&search=${filters.search}` : ""}${filters?.location ? `&location=${filters.location}` : ""}${filters?.job_type ? `&job_type=${filters.job_type}` : ""}${filters?.job_mode ? `&job_mode=${filters.job_mode}` : ""}${filters?.experience_level ? `&experience_level=${filters.experience_level}` : ""}${filters?.education_level ? `&education_level=${filters.education_level}` : ""}${filters?.industry ? `&industry=${encodeURIComponent(filters.industry)}` : ""}${filters?.status ? `&status=${filters.status}` : ""}${filters?.sortBy ? `&sortBy=${filters.sortBy}` : ""}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs);
        setTotalJobs(data.total);
      } else {
        console.error("Error fetching job posts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const form = useForm<z.infer<typeof jobPostsFilterSchema>>({
    resolver: zodResolver(jobPostsFilterSchema),
    defaultValues: {
      search: "",
      location: "",
      job_type: "",
      industry: "",
      job_mode: "",
      experience_level: "",
      education_level: "",
      sortBy: "latest",
    },
  });

  const onSubmit = async (data: z.infer<typeof jobPostsFilterSchema>) => {
    console.log(data);
    fetchJobs(data);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Advanced Filter Sidebar */}
          <JobPostsFilter
            onSubmit={onSubmit}
            form={form}
            fetchJobs={fetchJobs}
            loading={loading}
          />

          {/* Premium Job Listings */}
          <JobPostsList jobs={jobs} loading={loading} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobSearchPage;

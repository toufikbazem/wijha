import { useEffect, useState } from "react";
import {
  X,
  Edit2,
  Trash2,
  Eye,
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Upload,
  Pause,
  Play,
  Building2,
  SearchIcon,
  RouteOff,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import DashJobPostsList from "../components/DashJobPostsList";
import DashJobPostsFilterBar from "../components/DashJobPostsFilterBar";
import { jobPostsFilterSchema } from "../schema";
import { useTranslation } from "react-i18next";

export default function DashJobPost() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const limit = 4;
  const totalPages = Math.ceil(totalJobs / limit);

  const { user } = useSelector((state: any) => state.user);
  const { t } = useTranslation("employer");

  const fetchJobs = async (filters?: any) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/job-posts?page=${page}&limit=${limit}&employerId=${user.id}${filters?.search ? `&search=${filters.search}` : ""}${filters?.location ? `&location=${filters.location}` : ""}${filters?.job_type ? `&job_type=${filters.job_type}` : ""}${filters?.job_mode ? `&job_mode=${filters.job_mode}` : ""}${filters?.experience_level ? `&experience_level=${filters.experience_level}` : ""}${filters?.education_level ? `&education_level=${filters.education_level}` : ""}${filters?.industry ? `&industry=${encodeURIComponent(filters.industry)}` : ""}${filters?.status ? `&status=${filters.status}` : ""}${filters?.sortBy ? `&sortBy=${filters.sortBy}` : ""}`,
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

  const form = useForm<z.infer<typeof jobPostsFilterSchema>>({
    resolver: zodResolver(jobPostsFilterSchema),
    defaultValues: {
      search: "",
      location: "",
      job_type: "",
      job_mode: "",
      industry: "",
      experience_level: "",
      education_level: "",
      status: "",
      sortBy: "latest",
    },
  });

  useEffect(() => {
    fetchJobs();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("jobManagement")}</h1>
            <p className="mt-1 text-gray-600">
              {t("createManage")}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard?tab=createJobPost")}
            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-[#008CBA] text-white font-medium rounded-lg hover:bg-[#007399] transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            {t("createNewJob")}
          </button>
        </div>
        <DashJobPostsFilterBar
          form={form}
          fetchJobs={fetchJobs}
          loading={loading}
        />
        <DashJobPostsList
          loading={loading}
          jobs={jobs}
          totalpages={totalPages}
          page={page}
          setPage={setPage}
          onStatusChange={() => fetchJobs(form.getValues())}
        />
      </div>
    </div>
  );
}

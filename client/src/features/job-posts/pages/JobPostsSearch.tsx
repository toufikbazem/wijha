import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobPostsFilterSchema } from "../schema";
import JobPostsList from "../components/JobPostsList";
import JobPostsFilter from "../components/JobPostsFilter";
import Header from "@/features/public/components/Header";
import Footer from "@/features/public/components/Footer";
import DashJobPostsPagination from "@/features/employers/components/DashJobPostsPagination";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type Filters = z.infer<typeof jobPostsFilterSchema>;

const FILTER_KEYS: (keyof Filters)[] = [
  "search",
  "location",
  "industry",
  "job_type",
  "job_mode",
  "experience_level",
  "education_level",
  "sortBy",
];

const DEFAULT_FILTERS: Filters = {
  search: "",
  location: "",
  industry: "",
  job_type: "",
  job_mode: "",
  experience_level: "",
  education_level: "",
  sortBy: "latest",
};

const filtersFromParams = (params: URLSearchParams): Filters => {
  const result = { ...DEFAULT_FILTERS };
  for (const key of FILTER_KEYS) {
    const value = params.get(key);
    if (value !== null) result[key] = value;
  }
  return result;
};

const JobSearchPage = () => {
  useDocumentTitle("meta.title.jobSearch");

  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 4;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const initialFilters = useMemo(
    () => filtersFromParams(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [totalJobs, setTotalJobs] = useState(0);
  const totalPages = Math.ceil(totalJobs / limit);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<Filters>({
    resolver: zodResolver(jobPostsFilterSchema),
    defaultValues: initialFilters,
  });

  const activeFilters = useMemo(
    () => filtersFromParams(searchParams),
    [searchParams],
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          status: "Active",
        });
        for (const key of FILTER_KEYS) {
          const value = activeFilters[key];
          if (value) params.set(key, value);
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/job-posts?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
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
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching job posts:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    return () => controller.abort();
  }, [page, activeFilters]);

  const writeFiltersToUrl = (filters: Filters, nextPage: number) => {
    const next = new URLSearchParams();
    for (const key of FILTER_KEYS) {
      const value = filters[key];
      if (value && value !== DEFAULT_FILTERS[key]) next.set(key, value);
    }
    if (nextPage > 1) next.set("page", String(nextPage));
    setSearchParams(next, { replace: false });
  };

  const onSubmit = (data: Filters) => {
    writeFiltersToUrl(data, 1);
  };

  const onReset = () => {
    form.reset(DEFAULT_FILTERS);
    writeFiltersToUrl(DEFAULT_FILTERS, 1);
  };

  const setPage = (nextPage: number) => {
    writeFiltersToUrl(form.getValues(), nextPage);
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
            onReset={onReset}
            loading={loading}
          />

          {/* Premium Job Listings */}
          <div className="flex-1 min-w-0 flex flex-col">
            <JobPostsList jobs={jobs} loading={loading} />
            {totalPages > 1 && (
              <DashJobPostsPagination
                totalPages={totalPages}
                page={page}
                setPage={setPage}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobSearchPage;

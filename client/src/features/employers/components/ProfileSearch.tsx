import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Filter, Search, X, Briefcase, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddressCombobox } from "@/components/ui/address-combobox";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { profileSearchFilterSchema } from "../schema";
import ProfileSearchCard from "./ProfileSearchCard";
import DashJobPostsPagination from "./DashJobPostsPagination";

export default function ProfileSearch() {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const { t } = useTranslation("employer");
  const limit = 9;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const form = useForm<z.infer<typeof profileSearchFilterSchema>>({
    resolver: zodResolver(profileSearchFilterSchema),
    defaultValues: {
      professional_title: "",
      skills: "",
      experience_years: "",
      address: "",
    },
  });

  const fetchProfiles = async (
    filters?: z.infer<typeof profileSearchFilterSchema>,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));

      if (filters?.professional_title)
        params.set("professional_title", filters.professional_title);
      if (filters?.skills) params.set("skills", filters.skills);
      if (filters?.experience_years)
        params.set("experience_years", filters.experience_years);
      if (filters?.address) params.set("address", filters.address);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile-access/search?${params.toString()}`,
        { method: "GET", credentials: "include" },
      );
      const data = await res.json();
      if (res.ok) {
        setProfiles(data.profiles || []);
        setTotal(data.total || 0);
      } else {
        console.error("Error searching profiles:", data.message);
        setProfiles([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error searching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(form.getValues());
  }, [page]);

  const onSubmit = (data: z.infer<typeof profileSearchFilterSchema>) => {
    setPage(1);
    fetchProfiles(data);
  };

  const onAccessGranted = (jobSeekerId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === jobSeekerId ? { ...p, has_access: true } : p,
      ),
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Filter Drawer Overlay */}
      <div
        className={`z-[48] fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          filterOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setFilterOpen(false)}
      />

      {/* Filter Drawer */}
      <div
        className={`z-[49] fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 flex flex-col
        ${filterOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[15px] font-medium text-gray-900 leading-tight">
              {t("searchFilters")}
            </h2>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {t("filterProfiles")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors mt-0.5"
          >
            <X size={12} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {/* Professional Title */}
          <Controller
            name="professional_title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">
                  {t("professionalTitle")}
                </FieldLabel>
                <div className="relative">
                  <Briefcase className="input-icon-filter" size={16} />
                  <Input
                    placeholder="e.g. Software Engineer"
                    type="text"
                    className="input-filter"
                    {...field}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Skills */}
          <Controller
            name="skills"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">{t("skills")}</FieldLabel>
                <div className="relative">
                  <Wrench className="input-icon-filter" size={16} />
                  <Input
                    placeholder="e.g. React, Node.js"
                    type="text"
                    className="input-filter"
                    {...field}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Experience Years */}
          <Controller
            name="experience_years"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">
                  {t("minExperience")}
                </FieldLabel>
                <div className="relative">
                  <Briefcase className="input-icon-filter" size={16} />
                  <Input
                    placeholder="e.g. 3"
                    type="number"
                    className="input-filter"
                    {...field}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Address */}
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">{t("location")}</FieldLabel>
                <AddressCombobox
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                  variant="filter"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex gap-2">
          <button
            type="button"
            onClick={() => form.reset()}
            className="cursor-pointer flex-1 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {t("clearAll")}
          </button>
          <button
            onClick={() => setFilterOpen(false)}
            type="submit"
            className="cursor-pointer flex-[2] py-2 rounded-lg bg-[#008CBA] text-[13px] font-medium text-white hover:bg-[#007aa6] transition-colors"
          >
            {loading ? (
              <>
                <Spinner /> {t("loading", { ns: "common" })}
              </>
            ) : (
              <>{t("applyFilters")}</>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between gap-2">
          <div className="flex gap-4 flex-1">
            <Controller
              name="professional_title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="relative">
                    <Search className="input-icon-filter" size={16} />
                    <Input
                      placeholder={t("searchByTitle")}
                      type="text"
                      className="input-filter"
                      {...field}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Button
            type="submit"
            className="py-2 px-4 text-white bg-[#008CBA] cursor-pointer"
          >
            <Search className="ltr:mr-1 rtl:ml-1 w-4 h-4" />
            <span className="hidden md:block">{t("search")}</span>
          </Button>

          <Button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="py-2 px-4 text-white bg-[#008CBA] cursor-pointer"
          >
            <Filter className="ltr:mr-1 rtl:ml-1 w-4 h-4" />
            <span className="hidden md:block">{t("filters")}</span>
          </Button>
        </div>
      </div>

      {/* Results */}
      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3 bg-gray-200" />
                  <Skeleton className="h-3 w-1/2 bg-gray-200" />
                </div>
              </div>
              <Skeleton className="h-3 w-3/4 bg-gray-200" />
              <div className="flex gap-1.5">
                <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
                <Skeleton className="h-6 w-14 rounded-full bg-gray-200" />
                <Skeleton className="h-6 w-18 rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && profiles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("noProfilesFound")}
          </h3>
          <p className="text-gray-500">
            {t("adjustSearchFilters")}
          </p>
        </div>
      )}

      {/* Cards grid + pagination */}
      {!loading && profiles.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {total} {t("profilesFound")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <ProfileSearchCard
                key={profile.id}
                profile={profile}
                onAccessGranted={onAccessGranted}
              />
            ))}
          </div>
          <DashJobPostsPagination
            totalPages={totalPages}
            setPage={setPage}
            page={page}
          />
        </div>
      )}
    </form>
  );
}

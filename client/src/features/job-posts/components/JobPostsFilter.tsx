import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { Spinner } from "@/components/ui/spinner";
import i18n from "@/i18n/i18n";
import {
  educationLevels,
  experienceLevels,
  industries,
  jobModes,
  jobTypes,
} from "@/utils/data";
import {
  ArrowUpDown,
  Check,
  Filter,
  Mail,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

function JobPostsFilter({ form, onSubmit, fetchJobs, loading }: any) {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState(form.getValues("sortBy"));
  const { t } = useTranslation("common");

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="lg:hidden">
          <div
            className={`z-[48] fixed inset-0 bg-black/50 transition-opacity duration-300 ${
              open ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div
            className={`z-[49] fixed top-0 ltr:right-0 rtl:left-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 flex flex-col
                    ${open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-[15px] font-medium text-gray-900 leading-tight">
                  {t("filters")}
                </h2>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {t("refineSearch")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors mt-0.5"
              >
                <X size={12} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
              {/* location */}
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("location")}
                    </FieldLabel>
                    <div className="relative">
                      <MapPin className="input-icon-filter" size={16} />
                      <Input
                        placeholder={t("location") + "..."}
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

              {/* industry */}
              <Controller
                name="industry"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("industry")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {industries.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* job_type */}
              <Controller
                name="job_type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("jobType")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {jobTypes.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* job_mode */}
              <Controller
                name="job_mode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("jobMode")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {jobModes.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* education_level */}
              <Controller
                name="education_level"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("educationLevel")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {industries.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* experience_level */}
              <Controller
                name="experience_level"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("experienceLevel")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {experienceLevels.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* status */}
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("status")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter ltr:pr-8 rtl:pl-8">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          <SelectItem value="Pending" key={1}>
                            {t("pending")}
                          </SelectItem>
                          <SelectItem value="In-review" key={2}>
                            {t("inReview")}
                          </SelectItem>
                          <SelectItem value="Paused" key={3}>
                            {t("paused")}
                          </SelectItem>
                          <SelectItem value="Rejected" key={4}>
                            {t("rejected")}
                          </SelectItem>
                          <SelectItem value="Closed" key={5}>
                            {t("closed")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                onClick={() => {
                  form.reset();
                }}
                className="cursor-pointer flex-1 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {t("clearAll")}
              </button>
              <button
                onClick={() => setOpen(false)}
                type="submit"
                className="cursor-pointer flex-[2] py-2 rounded-lg bg-[#008CBA] text-[13px] font-medium text-white hover:bg-[#007aa6] transition-colors"
              >
                {loading ? (
                  <>
                    <Spinner /> {t("loading")}
                  </>
                ) : (
                  <>{t("applyFilters")}</>
                )}
              </button>
            </div>
          </div>

          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between gap-2">
              <div className="flex gap-4 flex-1">
                <Controller
                  name="search"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="relative">
                        <Input
                          placeholder={t("searchJobs")}
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    className="py-2 px-4 text-white bg-[#008CBA] cursor-pointer"
                  >
                    <ArrowUpDown className="ltr:mr-1 rtl:ml-1" />{" "}
                    <span className="hidden md:block">{t("sort")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Button
                    onClick={() => {
                      setSort("latest");
                      form.setValue("sortBy", "latest", {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      fetchJobs({
                        ...form.getValues(),
                        sortBy: "latest",
                      });
                    }}
                    className={`hover:bg-gray-50 justify-between ${sort == "latest" && "bg-gray-100"}`}
                  >
                    {t("latest")}
                    {sort === "latest" && <Check className="" />}
                  </Button>
                  <Button
                    onClick={() => {
                      setSort("oldest");
                      form.setValue("sortBy", "oldest", {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      fetchJobs({
                        ...form.getValues(),
                        sortBy: "oldest",
                      });
                    }}
                    className={`hover:bg-gray-50 justify-between ${sort == "oldest" && "bg-gray-100"}`}
                  >
                    {t("oldest")}
                    {sort === "oldest" && <Check className="justify-end" />}
                  </Button>
                </PopoverContent>
              </Popover>

              <Button
                type="button"
                onClick={() => setOpen(true)}
                className="py-2 px-4 text-white bg-[#008CBA] cursor-pointer"
              >
                <Filter className="ltr:mr-1 rtl:ml-1" />{" "}
                <span className="hidden md:block">{t("filters")}</span>
              </Button>
            </div>
          </div>
        </div>
        <aside className="hidden lg:block lg:w-72 xl:w-80 max-h-full flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#008CBA]" />
                <h3 className="text-lg font-bold text-gray-900">
                  {t("filters")}
                </h3>
              </div>
            </div>

            <div className="overflow-y-auto max-h-full flex flex-col gap-3">
              {/* search */}
              <Controller
                name="search"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("search")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        placeholder={t("search") + "..."}
                        type="text"
                        className="input-filter rtl:pr-2.5! ltr:pl-2.5!"
                        {...field}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Location */}
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("location")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        placeholder={t("location") + "..."}
                        type="text"
                        className="input-filter rtl:pr-2.5! ltr:pl-2.5!"
                        {...field}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* industry */}
              <Controller
                name="industry"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("industry")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {industries.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* job type */}
              <Controller
                name="job_type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("jobType")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {jobTypes.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* job_mode */}
              <Controller
                name="job_mode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("jobMode")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {jobModes.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* experience level */}
              <Controller
                name="experience_level"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("experienceLevel")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {experienceLevels.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Education Level */}
              <Controller
                name="education_level"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("educationLevel")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          {educationLevels.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="hover:bg-blue-50"
                                value={item}
                              >
                                {t(item)}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* sort by */}
              <Controller
                name="sortBy"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel className="input-label">
                      {t("sortBy")}
                    </FieldLabel>
                    <div className="relative">
                      <Select
                        dir={i18n.dir()}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                          <SelectValue placeholder={t("selectIndustry")} />
                        </SelectTrigger>
                        <SelectContent className="p-2 border-gray-300 bg-white">
                          <SelectItem key={1} value="oldest">
                            {t("oldest")}
                          </SelectItem>
                          <SelectItem key={2} value="latest">
                            {t("latest")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="mt-6 flex justify-center items-center gap-3">
              <button
                type="submit"
                className="flex-1 cursor-pointer px-6 py-2 bg-[#008CBA] hover:bg-[#00668C] text-white transition rounded-lg border-2 border-[#008CBA] hover:border-[#00668C]"
              >
                {t("apply")}
              </button>
              <button
                type="button"
                className="flex-1 cursor-pointer px-6 py-2 bg-white hover:bg-[#008CBA] text-[#008CBA] hover:text-white transition rounded-lg border-2 border-[#008CBA]"
                onClick={() => {
                  form.reset();
                  fetchJobs();
                }}
              >
                {t("clear")}
              </button>
            </div>
          </div>
        </aside>
      </form>
    </>
  );
}

export default JobPostsFilter;

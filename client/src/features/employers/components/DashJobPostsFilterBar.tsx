import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  ArrowUpDown,
  Check,
  Filter,
  Mail,
  MapPin,
  Pin,
  Search,
  X,
} from "lucide-react";
import { jobPostsFilterSchema } from "../schema";
import z, { set } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import {
  educationLevels,
  experienceLevels,
  industries,
  jobModes,
  jobTypes,
} from "@/utils/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

function DashJobPostsFilterBar({
  form,
  fetchJobs,
  loading,
}: {
  form: any;
  fetchJobs: any;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState(form.getValues().sortBy);
  const { t } = useTranslation("employer");

  const onSubmit = async (data: z.infer<typeof jobPostsFilterSchema>) => {
    fetchJobs(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Overlay */}
      <div
        className={`z-[48] fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`z-[49] fixed top-0 ltr:right-0 rtl:left-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 flex flex-col
        ${open ? "ltr:translate-x-0 rtl:-translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"}`}
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
                <FieldLabel className="input-label">{t("location")}</FieldLabel>
                <div className="relative">
                  <Input
                    placeholder={t("enterLocation")}
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
                <FieldLabel className="input-label">{t("industry")}</FieldLabel>
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
                <FieldLabel className="input-label">{t("jobType")}</FieldLabel>
                <div className="relative">
                  <Select
                    dir={i18n.dir()}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                      <SelectValue placeholder={t("selectJobType")} />
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
                <FieldLabel className="input-label">{t("jobMode")}</FieldLabel>
                <div className="relative">
                  <Select
                    dir={i18n.dir()}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                      <SelectValue placeholder={t("selectJobMode")} />
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
                      <SelectValue placeholder={t("selectEducationLevel")} />
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
                      <SelectValue placeholder={t("selectExperienceLevel")} />
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
                <FieldLabel className="input-label">{t("status")}</FieldLabel>
                <div className="relative">
                  <Select
                    dir={i18n.dir()}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="input-filter rtl:pr-2.5! ltr:pl-2.5!">
                      <SelectValue placeholder={t("selectStatus")} />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      <SelectItem value="Draft" key={1}>
                        {t("Draft")}
                      </SelectItem>
                      <SelectItem value="In-review" key={2}>
                        {t("In-review")}
                      </SelectItem>
                      <SelectItem value="Active" key={3}>
                        {t("Active")}
                      </SelectItem>
                      <SelectItem value="Pending" key={4}>
                        {t("Pending")}
                      </SelectItem>
                      <SelectItem value="Paused" key={5}>
                        {t("Paused")}
                      </SelectItem>
                      <SelectItem value="Rejected" key={6}>
                        {t("Rejected")}
                      </SelectItem>
                      <SelectItem value="Expired" key={7}>
                        {t("Expired")}
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
                <Spinner /> {t("loading", { ns: "common" })}
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
                    <Search className="input-icon-filter" size={16} />
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
    </form>
  );
}

export default DashJobPostsFilterBar;

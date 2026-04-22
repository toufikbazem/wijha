import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AddressCombobox } from "@/components/ui/address-combobox";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  educationLevels,
  experienceLevels,
  industries,
  jobModes,
  jobTypes,
} from "@/utils/data";
import {
  Briefcase,
  Building2,
  CalendarIcon,
  ClipboardList,
  Clock,
  FileText,
  Save,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

function JobPostForm({
  form,
  onSubmit,
  setState,
  loading,
}: {
  form: any;
  onSubmit: any;
  setState: any;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("employer");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
      {/* Basic Information */}
      <section className="">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#008CBA] text-white w-10 h-10 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("basicInformation")}
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {/* Job Title */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">{t("jobTitle")}</FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g., Senior Software Engineer"
                  type="text"
                  className="input pl-4!"
                />
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
                <FieldLabel className="input-label">{t("location")}</FieldLabel>
                <AddressCombobox
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                  variant="default"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Company Name */}
          <Controller
            name="company_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">
                  {t("companyName")}
                </FieldLabel>
                <Input
                  {...field}
                  disabled
                  placeholder="e.g., Acme Corp"
                  type="text"
                  className="input pl-4!"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </section>

      {/* Employment Details */}
      <section className="">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#008CBA] text-white w-10 h-10 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("employmentDetails")}
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6 ">
            {/* Job Type */}
            <Controller
              name="job_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="input-label">
                    {t("jobType")}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    key={field.value}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="input pl-4!"
                    >
                      <SelectValue placeholder="Select Job Type" />
                    </SelectTrigger>
                    <SelectContent className="p-3" position="item-aligned">
                      {jobTypes.map((type, index) => {
                        return (
                          <SelectItem
                            key={index}
                            value={type}
                            className="hover:bg-gray-50"
                          >
                            {type}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Industry */}
            <Controller
              name="industry"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="input-label">
                    {t("industry")}
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    key={field.value}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="input pl-4!"
                    >
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent className="p-3" position="item-aligned">
                      {industries.map((industry, index) => {
                        return (
                          <SelectItem
                            key={index}
                            value={industry}
                            className="hover:bg-gray-50"
                          >
                            {industry}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="job_mode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">{t("jobMode")}</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  key={field.value}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="input pl-4!"
                  >
                    <SelectValue placeholder="Select Job Mode" />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    {jobModes.map((mode, index) => {
                      return (
                        <SelectItem
                          key={index}
                          value={mode}
                          className="hover:bg-gray-50"
                        >
                          {mode}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-6 ">
            {/* Experience Level */}
            <Controller
              name="experience_level"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="input-label">
                    {t("experienceLevel")}
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    key={field.value}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="input pl-4!"
                    >
                      <SelectValue placeholder="Select Experience Level" />
                    </SelectTrigger>
                    <SelectContent className="p-3" position="item-aligned">
                      {experienceLevels.map((level, index) => {
                        return (
                          <SelectItem
                            key={index}
                            value={level}
                            className="hover:bg-gray-50"
                          >
                            {level}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="input-label">
                    {t("educationLevel")}
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    key={field.value}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="input pl-4!"
                    >
                      <SelectValue placeholder="Select Education Level" />
                    </SelectTrigger>
                    <SelectContent className="p-3" position="item-aligned">
                      {educationLevels.map((level, index) => {
                        return (
                          <SelectItem
                            key={index}
                            value={level}
                            className="hover:bg-gray-50"
                          >
                            {level}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 ">
            <Controller
              name="min_salary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="input-label">
                    {t("minimumSalary")}
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 50000"
                    type="text"
                    className="input pl-4!"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="max_salary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="input-label">
                    {t("maximumSalary")}
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 100000"
                    type="text"
                    className="input pl-4!"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Number of Positions */}
          <Controller
            name="number_of_positions"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">
                  {t("numberOfPositions")}
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g., 5"
                  type="text"
                  className="input pl-4!"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </section>

      {/* Job Description */}
      <section className="">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#008CBA] text-white w-10 h-10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("jobDescription")}
          </h2>
        </div>

        <div className="space-y-6">
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">
                  {t("jobDescription")}
                </FieldLabel>
                <Textarea
                  placeholder="Mission / Role Overview

The purpose of this role is to support the company’s growth by contributing to key projects, ensuring efficient operations, and delivering high-quality work. The candidate will play an important role in improving processes, collaborating with team members, and helping the company achieve its goals.

Key Responsibilities

• Assist in planning and executing daily tasks and projects.
• Collaborate with team members to ensure smooth workflow and timely delivery.
• Monitor and report progress, highlighting any issues or improvements.
• Maintain accurate documentation and follow company procedures.
• Communicate effectively with internal teams and external partners when needed.

Requirements (Qualifications & Skills)

• Basic understanding of the field or relevant experience is preferred.
• Strong communication and organizational skills.
• Ability to manage time, prioritize tasks, and work independently when required.
• Problem-solving mindset and willingness to learn.
• Knowledge of common tools or software used in the role is a plus."
                  {...field}
                  className="h-[446px] text-[16px] w-full  px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CBA] focus:border-transparent outline-none transition"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </section>

      {/* Application Deadline */}
      <section className="">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#008CBA] text-white w-10 h-10 rounded-lg flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("applicationDeadline")}
          </h2>
        </div>

        <div className="max-w-md">
          <Controller
            name="deadline"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">
                  {t("applicationDeadline")}
                </FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <div className="w-full">
                      <Button
                        type="button"
                        className="input pl-4! justify-start cursor-pointer"
                        variant={"outline"}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t("pickDate")}</span>
                        )}
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className=" border-none bg-white"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpen(false);
                      }}
                      captionLayout="dropdown"
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date <= today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <p className="mt-2 text-xs text-gray-500">
            {t("applicationsCloseAt")}
          </p>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          onClick={() => setState("Draft")}
          type="submit"
          className="bg-white border-box cursor-pointer h-auto flex-1 px-4 py-2 border-2 border-primary-500 text-primary-500 font-semibold rounded-lg transition"
        >
          {loading ? (
            <>
              <Spinner className="w-5 h-5" />
              <span>{t("saving")}</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{t("saveDraft")}</span>
            </>
          )}
        </Button>
        <Button
          type="submit"
          className="border-box cursor-pointer flex-1 px-4 py-2 bg-primary-500 text-white h-auto font-semibold rounded-lg hover:opacity-90 transition"
        >
          {loading ? (
            <>
              <Spinner className="w-5 h-5" />
              <span>{t("saving")}</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{t("save")}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default JobPostForm;

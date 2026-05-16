import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import {
  ArrowUpDown,
  Check,
  Filter,
  MapPin,
  Search,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
import { experienceLevels, educationLevels } from "@/lib/data";

import type { JobSeekersFilters } from "@/lib/jobSeekersFilters";

const STATUSES = ["active", "deactivated", "unverified", "suspended"] as const;

type Props = {
  form: UseFormReturn<JobSeekersFilters>;
  onApply: (values: JobSeekersFilters) => void;
  onReset: () => void;
  loading: boolean;
};

export default function JobSeekersFilterBar({
  form,
  onApply,
  onReset,
  loading,
}: Props) {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<"latest" | "oldest">(
    form.getValues("sortBy"),
  );

  const applySort = (value: "latest" | "oldest") => {
    setSort(value);
    form.setValue("sortBy", value, { shouldDirty: true, shouldTouch: true });
    onApply({ ...form.getValues(), sortBy: value });
  };

  return (
    <form onSubmit={form.handleSubmit(onApply)}>
      {/* Overlay */}
      <div
        className={`z-[48] fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`z-[49] fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 flex flex-col
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[15px] font-medium text-gray-900 leading-tight">
              Filters
            </h2>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Refine your search
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
          {/* personal search */}
          <Controller
            name="personalSearch"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">Personal search</FieldLabel>
                <div className="relative">
                  <User className="input-icon-filter" size={16} />
                  <Input
                    placeholder="First name, last name, email..."
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

          {/* address */}
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">Address</FieldLabel>
                <div className="relative">
                  <MapPin className="input-icon-filter" size={16} />
                  <Input
                    placeholder="City, wilaya..."
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

          {/* experience_level */}
          <Controller
            name="experience_level"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">
                  Experience level
                </FieldLabel>
                <div className="relative">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="input-filter pl-2.5!">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      {experienceLevels.map((lvl:string) => (
                        <SelectItem
                          key={lvl}
                          className="hover:bg-blue-50"
                          value={lvl}
                        >
                          {lvl}
                        </SelectItem>
                      ))}
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
                <FieldLabel className="input-label">Education level</FieldLabel>
                <div className="relative">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="input-filter pl-2.5!">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      {educationLevels.map((lvl: string) => (
                        <SelectItem
                          key={lvl}
                          className="hover:bg-blue-50"
                          value={lvl}
                        >
                          {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* gender */}
          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">Gender</FieldLabel>
                <div className="relative">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="input-filter pl-2.5!">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      <SelectItem className="hover:bg-blue-50" value="male">
                        Male
                      </SelectItem>
                      <SelectItem className="hover:bg-blue-50" value="female">
                        Female
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

          {/* has_cv */}
          <Controller
            name="has_cv"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">Has CV</FieldLabel>
                <div className="relative">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="input-filter pl-2.5!">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      <SelectItem className="hover:bg-blue-50" value="true">
                        With CV
                      </SelectItem>
                      <SelectItem className="hover:bg-blue-50" value="false">
                        Without CV
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

          {/* is_email_verified */}
          <Controller
            name="is_email_verified"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">Email verified</FieldLabel>
                <div className="relative">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="input-filter pl-2.5!">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      <SelectItem className="hover:bg-blue-50" value="true">
                        Verified
                      </SelectItem>
                      <SelectItem className="hover:bg-blue-50" value="false">
                        Not verified
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

          {/* status */}
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">Status</FieldLabel>
                <div className="relative">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="input-filter pl-2.5!">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      {STATUSES.map((s) => (
                        <SelectItem
                          key={s}
                          className="hover:bg-blue-50"
                          value={s}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* registered_type */}
          <Controller
            name="registered_type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel className="input-label">Registered type</FieldLabel>
                <div className="relative">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="input-filter pl-2.5!">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      <SelectItem
                        className="hover:bg-blue-50"
                        value="registered"
                      >
                        Registered
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-blue-50"
                        value="admin_created"
                      >
                        Added by Admin
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

          {/* joined_from / joined_to */}
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="joined_from"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="input-label">Joined from</FieldLabel>
                  <Input
                    type="date"
                    className="input-filter pl-2.5!"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="joined_to"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="input-label">Joined to</FieldLabel>
                  <Input
                    type="date"
                    className="input-filter pl-2.5!"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSort("latest");
              onReset();
              setOpen(false);
            }}
            className="cursor-pointer flex-1 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Clear all
          </button>
          <button
            type="submit"
            onClick={() => setOpen(false)}
            className="cursor-pointer flex-[2] py-2 rounded-lg bg-[#008CBA] text-[13px] font-medium text-white hover:bg-[#007aa6] transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner /> Loading
              </>
            ) : (
              <>Apply filters</>
            )}
          </button>
        </div>
      </div>

      {/* Top bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between gap-2">
          <div className="flex gap-4 flex-1">
            <Controller
              name="globalSearch"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <div className="relative">
                    <Search className="input-icon-filter" size={16} />
                    <Input
                      placeholder="Search by professional title, skills, summary..."
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
                className="py-2 px-4 text-white bg-[#008CBA] hover:bg-[#007aa6] cursor-pointer"
              >
                <ArrowUpDown className="mr-1" />
                <span className="hidden md:block">Sort</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => applySort("latest")}
                className={`hover:bg-gray-50 justify-between ${
                  sort === "latest" ? "bg-gray-100" : ""
                }`}
              >
                Latest
                {sort === "latest" && <Check />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => applySort("oldest")}
                className={`hover:bg-gray-50 justify-between ${
                  sort === "oldest" ? "bg-gray-100" : ""
                }`}
              >
                Oldest
                {sort === "oldest" && <Check />}
              </Button>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="py-2 px-4 text-white bg-[#008CBA] hover:bg-[#007aa6] cursor-pointer"
          >
            <Filter className="mr-1" />
            <span className="hidden md:block">Filters</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

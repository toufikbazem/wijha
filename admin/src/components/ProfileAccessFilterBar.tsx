import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { ArrowUpDown, Check, Clock, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
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

import {
  ACCESSED_IN_OPTIONS,
  type ProfileAccessFilters,
} from "@/lib/profileAccessFilters";

type Props = {
  form: UseFormReturn<ProfileAccessFilters>;
  onApply: (values: ProfileAccessFilters) => void;
  onReset: () => void;
  loading: boolean;
};

export default function ProfileAccessFilterBar({ form, onApply }: Props) {
  const [sort, setSort] = useState<"latest" | "oldest">(
    form.getValues("sortBy"),
  );

  const applySort = (value: "latest" | "oldest") => {
    setSort(value);
    form.setValue("sortBy", value, { shouldDirty: true, shouldTouch: true });
    onApply({ ...form.getValues(), sortBy: value });
  };

  const applyAccessedIn = (value: string) => {
    const next = value === "any" ? "" : value;
    form.setValue("accessed_in", next, {
      shouldDirty: true,
      shouldTouch: true,
    });
    onApply({ ...form.getValues(), accessed_in: next });
  };

  return (
    <form onSubmit={form.handleSubmit(onApply)}>
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Search */}
          <Controller
            name="globalSearch"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                className="w-full sm:flex-1 sm:min-w-0"
                data-invalid={fieldState.invalid}
              >
                <div className="relative">
                  <Search className="input-icon-filter" size={16} />
                  <Input
                    placeholder="Search by company or job seeker name..."
                    type="text"
                    className="input-filter w-full"
                    {...field}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Right-side controls: accessed_in + sort */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Accessed in */}
            <Controller
              name="accessed_in"
              control={form.control}
              render={({ field }) => (
                <div className="relative flex-1 sm:flex-initial sm:w-44">
                  <Clock
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
                    size={16}
                  />
                  <Select
                    onValueChange={applyAccessedIn}
                    value={field.value ? field.value : "any"}
                  >
                    <SelectTrigger className="input-filter pl-8! w-full">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent className="p-2 border-gray-300 bg-white">
                      <SelectItem className="hover:bg-blue-50" value="any">
                        Any time
                      </SelectItem>
                      {ACCESSED_IN_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          className="hover:bg-blue-50"
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            {/* Sort */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  className="shrink-0 py-2 px-3 sm:px-4 text-white bg-[#008CBA] hover:bg-[#007aa6] cursor-pointer"
                >
                  <ArrowUpDown className="sm:mr-1" />
                  <span className="hidden sm:block">Sort</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="flex flex-col p-1">
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
          </div>
        </div>
      </div>
    </form>
  );
}

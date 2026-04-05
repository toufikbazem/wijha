import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail } from "lucide-react";
import { Controller } from "react-hook-form";

function EmployerRegisterForm({ form }: { form: any }) {
  return (
    <div className="flex flex-col gap-5 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Company Information
      </h3>

      {/* Company Name */}
      <Controller
        name="companyName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">Company Name</FieldLabel>
            <div className="relative">
              <Mail className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="acme corp"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Phone Number */}
      <Controller
        name="phoneNumber"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="input-label">Phone Number</FieldLabel>
            <div className="relative">
              <Mail className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="+213 123 456 789"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              <Mail className="input-icon" size={20} />
              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Chrega, Algiers"
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Industry */}
        <Controller
          name="industry"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">Industry</FieldLabel>
              <div className="relative">
                <Mail className="input-icon" size={20} />
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="input"
                  >
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    <SelectItem key="tech" value="tech">
                      Technology
                    </SelectItem>
                    <SelectItem key="finance" value="finance">
                      Finance
                    </SelectItem>
                    <SelectItem key="healthcare" value="healthcare">
                      Healthcare
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Company Size */}
        <Controller
          name="size"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="input-label">Company Size</FieldLabel>
              <div className="relative">
                <Mail className="input-icon" size={20} />
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="input"
                  >
                    <SelectValue placeholder="Select Company Size" />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    <SelectItem key="small" value="1-10">
                      Small (1-50 employees)
                    </SelectItem>
                    <SelectItem key="large" value="51-200">
                      Large (201+ employees)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}

export default EmployerRegisterForm;

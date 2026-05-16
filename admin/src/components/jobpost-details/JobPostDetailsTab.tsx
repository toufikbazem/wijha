import { Controller } from "react-hook-form";
import {
  AlertCircle,
  Briefcase,
  CalendarIcon,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  MapPin,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  educationLevels,
  experienceLevels,
  industries,
  jobModes,
  jobTypes,
} from "@/lib/data";

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="bg-[#008CBA] text-white w-10 h-10 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{children}</h2>
    </div>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-[#008CBA08] border border-[#008CBA20]">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#008CBA]" />
        <p className="text-xs uppercase tracking-wide text-gray-600 font-medium">
          {label}
        </p>
      </div>
      <p className="text-base font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}

function looksLikeHtml(s: string) {
  return /<\/?[a-z][\s\S]*>/i.test(s);
}

function formatSalary(post: any) {
  if (post.salary_range) return post.salary_range;
  const min = post.salary_min ?? post.min_salary;
  const max = post.salary_max ?? post.max_salary;
  if (min && max) return `${min} – ${max}`;
  if (min) return `From ${min}`;
  if (max) return `Up to ${max}`;
  return null;
}

function daysUntil(dateStr: string) {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export default function JobPostDetailsTab({
  post,
  isEditing,
  form,
}: {
  post: any;
  isEditing: boolean;
  form?: any;
}) {
  return (
    <div className="space-y-6">
      {/* ─── Basic Information ─── */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <SectionTitle icon={Briefcase}>Basic Information</SectionTitle>

        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Job Title</FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g., Senior Frontend Engineer"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Location</FieldLabel>
                  <Input
                    {...field}
                    placeholder="City, Country"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="industry"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Industry</FieldLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {industries.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="md:col-span-2">
              <Controller
                name="is_anonymous"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="is_anonymous"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="is_anonymous"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Post anonymously
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">
                      Hide the employer's identity from job seekers.
                    </p>
                  </Field>
                )}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <InfoField label="Job Title" value={post.title} />
              <InfoField
                label="Company"
                value={
                  post.is_anonymous ? "Anonymous Company" : post.company_name
                }
              />
              <InfoField label="Industry" value={post.industry} />
              <InfoField
                label="Posted On"
                value={new Date(post.created_at).toLocaleDateString()}
              />
            </div>

            <div className="mt-5 flex items-start gap-3 p-4 rounded-lg bg-[#008CBA08] border border-[#008CBA20]">
              <MapPin className="w-5 h-5 text-[#008CBA] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.location || "Location not specified"}
                </p>
                {post.job_mode && (
                  <p className="text-xs text-gray-600 mt-1">
                    Work mode:{" "}
                    <span className="font-medium">{post.job_mode}</span>
                  </p>
                )}
              </div>
            </div>

            {post.is_anonymous && (
              <div className="mt-3 flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <User className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Anonymous posting
                  </p>
                  <p className="text-xs text-amber-800 mt-1">
                    The employer's identity is hidden from job seekers.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Employment Details ─── */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <SectionTitle icon={ClipboardList}>Employment Details</SectionTitle>

        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Controller
              name="job_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Job Type</FieldLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {jobTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="job_mode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Job Mode</FieldLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select job mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {jobModes.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="experience_level"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Experience Level</FieldLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {experienceLevels.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="education_level"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Education Level</FieldLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {educationLevels.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="min_salary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Minimum Salary</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 50000"
                    inputMode="numeric"
                    aria-invalid={fieldState.invalid}
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
                  <FieldLabel>Maximum Salary</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 100000"
                    inputMode="numeric"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="number_of_positions"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Number of Positions</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 3"
                    inputMode="numeric"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard icon={Clock} label="Job Type" value={post.job_type} />
            <MetricCard icon={Clock} label="Job Mode" value={post.job_mode} />
            <MetricCard
              icon={TrendingUp}
              label="Experience Level"
              value={post.experience_level}
            />
            <MetricCard
              icon={GraduationCap}
              label="Education Level"
              value={post.education_level}
            />
            <MetricCard
              icon={DollarSign}
              label="Salary Range"
              value={formatSalary(post)}
            />
            <MetricCard
              icon={Users}
              label="Positions Available"
              value={post.number_of_positions}
            />
          </div>
        )}
      </div>

      {/* ─── Description ─── */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <SectionTitle icon={FileText}>Job Description</SectionTitle>

        {isEditing ? (
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  placeholder="Describe the role, responsibilities and requirements…"
                  className="min-h-48"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Plain text or HTML. Existing rich-text content is preserved.
                </p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ) : !post.description ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No description provided.</p>
          </div>
        ) : looksLikeHtml(post.description) ? (
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.description }}
          />
        ) : (
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.description}
          </div>
        )}
      </div>

      {/* ─── Deadline ─── */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <SectionTitle icon={CalendarIcon}>Application Deadline</SectionTitle>

        {isEditing ? (
          <Controller
            name="deadline"
            control={form.control}
            render={({ field, fieldState }) => {
              const dateValue = field.value
                ? new Date(field.value).toISOString().slice(0, 10)
                : "";
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Closing Date</FieldLabel>
                  <Input
                    type="date"
                    value={dateValue}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    aria-invalid={fieldState.invalid}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be within the next 3 months.
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        ) : !post.deadline ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No deadline set.</p>
          </div>
        ) : (
          <DeadlineCards deadline={post.deadline} />
        )}
      </div>
    </div>
  );
}

function DeadlineCards({ deadline }: { deadline: string }) {
  const days = daysUntil(deadline);
  const isExpired = days < 0;
  const isUrgent = days >= 0 && days <= 7;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 rounded-xl bg-[#008CBA08] border border-[#008CBA20]">
        <p className="text-xs uppercase tracking-wide text-gray-600 font-medium mb-2">
          Closing Date
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {new Date(deadline).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Applications close at end of day
        </p>
      </div>

      <div
        className={`p-5 rounded-xl border ${
          isExpired
            ? "bg-red-50 border-red-200"
            : isUrgent
              ? "bg-amber-50 border-amber-200"
              : "bg-green-50 border-green-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isExpired ? (
            <AlertCircle className="w-4 h-4 text-red-600" />
          ) : isUrgent ? (
            <AlertCircle className="w-4 h-4 text-amber-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          )}
          <p
            className={`text-xs uppercase tracking-wide font-medium ${
              isExpired
                ? "text-red-700"
                : isUrgent
                  ? "text-amber-700"
                  : "text-green-700"
            }`}
          >
            Status
          </p>
        </div>
        <p
          className={`text-2xl font-bold ${
            isExpired
              ? "text-red-900"
              : isUrgent
                ? "text-amber-900"
                : "text-green-900"
          }`}
        >
          {isExpired
            ? `Closed ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`
            : days === 0
              ? "Closes today"
              : `${days} day${days === 1 ? "" : "s"} left`}
        </p>
        <p
          className={`mt-1 text-xs ${
            isExpired
              ? "text-red-700"
              : isUrgent
                ? "text-amber-700"
                : "text-green-700"
          }`}
        >
          {isExpired
            ? "No new applications will be accepted"
            : isUrgent
              ? "Deadline approaching soon"
              : "Plenty of time left"}
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Controller } from "react-hook-form";
import { Globe, Phone, PlusIcon, Share2, X } from "lucide-react";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 bg-[#008CBA] rounded-full" />
      <h3 className="text-xl font-bold text-gray-900">{children}</h3>
    </div>
  );
}

export default function EmployerProfileTab({
  companyInfo,
  setCompanyInfo,
  isEditing,
  form,
}: {
  companyInfo: any;
  setCompanyInfo: (updater: (prev: any) => any) => void;
  isEditing: boolean;
  form: any;
}) {
  const [mission, setMission] = useState("");

  const removeMission = (index: number) => {
    const updated = [...(companyInfo.missions ?? [])];
    updated.splice(index, 1);
    setCompanyInfo((prev: any) => ({ ...prev, missions: updated }));
    form.setValue("missions", updated, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-6">
        {/* About */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <SectionTitle>About Us</SectionTitle>
          {isEditing ? (
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    placeholder="Company description"
                    className="min-h-40"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {companyInfo.description || "No description provided."}
            </p>
          )}
        </div>

        {/* What We Do (missions) */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>What We Do</SectionTitle>
            <Dialog>
              <DialogTrigger asChild>
                {isEditing && (
                  <Button
                    type="button"
                    className="bg-[#008CBA] hover:bg-[#007399] text-white flex items-center gap-2 cursor-pointer"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add mission
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogTitle>Add new mission</DialogTitle>
                <Input
                  type="text"
                  placeholder="Enter mission statement"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="mt-4 mb-6"
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="border-[#008CBA] text-[#008CBA] hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        const trimmed = mission.trim();
                        if (!trimmed) {
                          toast.error("Please enter a mission");
                          return;
                        }
                        const next = [
                          ...((form.getValues("missions") as string[]) || []),
                          trimmed,
                        ];
                        form.setValue("missions", next, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                        setCompanyInfo((prev: any) => ({
                          ...prev,
                          missions: next,
                        }));
                        setMission("");
                      }}
                      className="bg-[#008CBA] hover:bg-[#007399] text-white cursor-pointer"
                    >
                      Save
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {companyInfo.missions && companyInfo.missions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyInfo.missions.map((item: string, index: number) => (
                <div
                  key={index}
                  className="relative p-4 rounded-lg bg-[#008CBA10] border-t-3 border-[#008CBA]"
                >
                  {isEditing && (
                    <X
                      onClick={() => removeMission(index)}
                      className="cursor-pointer absolute top-2 right-2 w-4 h-4 text-[#008CBA]"
                    />
                  )}
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No missions added.</p>
          )}
        </div>
      </div>

      {/* Right column — Contact info */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-[#008CBA]" />
            <h3 className="text-lg font-bold text-gray-900">Contact Info</h3>
          </div>

          <div className="space-y-4">
            {/* LinkedIn */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5 mt-0.5 text-[#008CBA]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">LinkedIn</p>
                {isEditing ? (
                  <Controller
                    name="linkedin"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          placeholder="linkedin.com/company/…"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ) : companyInfo.linkedin ? (
                  <a
                    href={companyInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#008CBA] hover:underline block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium"
                  >
                    {companyInfo.linkedin}
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="w-5 h-5 mt-0.5 text-[#008CBA]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">Phone</p>
                {isEditing ? (
                  <Controller
                    name="phone_number"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          placeholder="Phone number"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ) : companyInfo.phone_number ? (
                  <a
                    href={`tel:${companyInfo.phone_number}`}
                    className="text-sm font-medium text-gray-900 block overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {companyInfo.phone_number}
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe className="w-5 h-5 mt-0.5 text-[#008CBA]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">Website</p>
                {isEditing ? (
                  <Controller
                    name="website"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          placeholder="https://example.com"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ) : companyInfo.website ? (
                  <a
                    href={companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#008CBA] hover:underline block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium"
                  >
                    {companyInfo.website}
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </div>
            </div>

            {/* Email (read-only — managed in Account tab) */}
            {!isEditing && companyInfo.email && (
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 mb-0.5">Email</p>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="text-sm text-gray-700 block overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {companyInfo.email}
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

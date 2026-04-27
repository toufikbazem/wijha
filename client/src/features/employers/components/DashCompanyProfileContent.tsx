import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Globe, Phone, PlusIcon, Share2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

function DashCompanyProfileContent({
  companyInfo,
  setCompanyInfo,
  editMode,
  form,
}: {
  companyInfo: any;
  setCompanyInfo: any;
  editMode: boolean;
  form: any;
}) {
  const navigate = useNavigate();
  const [mission, setMission] = useState("");
  const { t } = useTranslation("employer");

  const removeMission = (index: number) => {
    const updatedMission = [...companyInfo.missions];
    updatedMission.splice(index, 1);
    setCompanyInfo({ ...companyInfo, missions: updatedMission });
    form.setValue("missions", updatedMission, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Main Content Column */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("aboutUs")}
            </h2>
            {companyInfo.description && !editMode && (
              <p className="text-gray-700 leading-relaxed mb-4">
                {companyInfo.description}
              </p>
            )}

            {editMode && (
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="relative">
                      <Textarea
                        placeholder={t("companyDescription")}
                        {...field}
                        className="h-[446px] text-[16px] w-full  px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CBA] focus:border-transparent outline-none transition"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </div>

          {/* What We Do */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t("whatWeDo")}
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  {editMode && (
                    <Button
                      type="button"
                      className="bg-[#008CBA] hover:bg-[#007399] text-white flex items-center gap-2 cursor-pointer"
                    >
                      <PlusIcon className="w-4 h-4" />
                      {t("addMission")}
                    </Button>
                  )}
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogTitle>{t("addNewMission")}</DialogTitle>
                  <Input
                    type="text"
                    placeholder={t("addNewMissionPlaceholder")}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="input-filter mb-6 mt-6 pl-2!"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        className="border-primary-500 text-primary-500 hover:bg-gray-50 cursor-pointer"
                        variant="outline"
                      >
                        {t("cancel", { ns: "common" })}
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          if (mission !== "") {
                            form.setValue(
                              "missions",
                              [...(form.getValues("missions") || []), mission],
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              },
                            );
                            setCompanyInfo(form.getValues());
                            setMission("");
                          } else {
                            toast.error(t("pleaseAddMission"));
                          }
                        }}
                        className="bg-[#008CBA] hover:bg-[#007399] text-white cursor-pointer"
                      >
                        {t("saveChanges")}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyInfo.missions?.map((item: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative p-4 rounded-lg bg-[#008CBA10] border-t-3 border-[#008CBA]"
                  >
                    {editMode && (
                      <X
                        onClick={() => removeMission(index)}
                        className="cursor-pointer absolute top-2 right-2 w-4 h-4 text-[#008CBA]"
                      />
                    )}
                    <p className="text-sm text-gray-600">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-tertiary)] rounded-xl p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-medium tracking-widest uppercase text-blue-600 mb-1">
                  Company Purpose
                </p>
                <h3 className="text-xl font-medium text-gray-900 m-0">
                  What We Do
                </h3>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  {editMode && (
                    <Button
                      type="button"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5 text-sm font-medium cursor-pointer shadow-none"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      Add mission
                    </Button>
                  )}
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogTitle>Add new mission</DialogTitle>
                  <Input
                    type="text"
                    placeholder="Enter mission statement..."
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="mt-4 mb-6 pl-3"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="cursor-pointer">
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          if (mission !== "") {
                            form.setValue(
                              "mission",
                              [...(form.getValues("mission") || []), mission],
                              { shouldDirty: true, shouldTouch: true },
                            );
                            setCompanyInfo(form.getValues());
                            setMission("");
                          } else {
                            toast.error(t("pleaseAddMission"));
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        {t("saveChanges")}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companyInfo.missions?.map((item, index) => (
                <div
                  key={index}
                  className="relative p-4 rounded-md bg-gray-50 border border-gray-100 border-l-2 border-l-blue-500"
                >
                  <p className="text-[11px] font-medium text-blue-600 tracking-wide mb-1.5">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  {editMode && (
                    <button
                      onClick={() => removeMission(index)}
                      className="absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Sidebar Column */}
      <div className="space-y-6">
        {/* Contact Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {t("contactInfo")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <Share2 className="w-5 h-5 mt-0.5 text-[#008CBA]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">{t("linkedin")}</p>
                {editMode ? (
                  <Controller
                    name="linkedin"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="relative">
                          <Share2 className="input-icon-filter h-4 w-4" />
                          <Input
                            {...field}
                            type="text"
                            className="input-filter text-3xl font-bold"
                            aria-invalid={fieldState.invalid}
                            placeholder="linkedin.com/company"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ) : (
                  <Link
                    to={companyInfo.linkedin}
                    target="_blank"
                    className="text-primary-500 hover:text-primary-600 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium"
                  >
                    LinkedIn
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <Phone className="w-5 h-5 mt-0.5 text-[#008CBA]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">
                  {t("phoneNumber")}
                </p>
                {editMode ? (
                  <Controller
                    name="phone_number"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="relative">
                          <Phone className="input-icon-filter h-4 w-4" />
                          <Input
                            {...field}
                            type="text"
                            className="input-filter text-3xl font-bold"
                            aria-invalid={fieldState.invalid}
                            placeholder="Company Name"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ) : (
                  <Link
                    to={`tel:${companyInfo.phone_number}`}
                    className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {companyInfo.phone_number}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <Globe className="w-5 h-5 mt-0.5 text-[#008CBA]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">{t("website")}</p>
                {editMode ? (
                  <Controller
                    name="website"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="relative">
                          <Globe className="input-icon-filter h-4 w-4" />
                          <Input
                            {...field}
                            type="text"
                            className="input-filter text-3xl font-bold"
                            aria-invalid={fieldState.invalid}
                            placeholder="website.com"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ) : (
                  <Link
                    to={companyInfo.website}
                    target="_blank"
                    className="text-primary-500 hover:text-primary-600 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium"
                  >
                    Website
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashCompanyProfileContent;

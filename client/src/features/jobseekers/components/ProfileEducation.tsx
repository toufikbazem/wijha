import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Pen, Plus, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from(
  { length: new Date().getFullYear() - 1980 + 1 },
  (_, i) => 1980 + i,
).reverse();

function ProfileEducation({ isEditing, educations, setEducations }: any) {
  const { t } = useTranslation("jobseeker");
  const { user } = useSelector((state: any) => state.user);

  const [formation, setFormation] = useState({
    title: "",
    institution: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    description: "",
    isCurrent: false,
  });

  const handleAddFormation = async () => {
    const startDate = new Date(
      parseInt(formation.fromYear),
      parseInt(formation.fromMonth) - 1,
    );
    const endDate = new Date(
      parseInt(formation.toYear),
      parseInt(formation.toMonth) - 1,
    );

    if (startDate > endDate) {
      toast.error(t("endDateAfterStart"));
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/educations`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            title: formation.title,
            institution: formation.institution,
            from: startDate,
            to: endDate,
            description: formation.description,
          }),
        },
      );
      const newFormation = await res.json();
      if (!res.ok) {
        toast.error(t("failedAddFormation"));
      } else {
        toast.success(t("formationAdded"));
        setEducations([...educations, newFormation]);
      }
    } catch (error) {
      console.error("Error adding formation:", error);
      toast.error(t("failedAddFormation"));
    } finally {
      // reset formation form
      setFormation({
        title: "",
        institution: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        description: "",
        isCurrent: false,
      });
    }
  };

  const handleRemoveFormation = async (formationId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/educations/${formationId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        toast.error(t("failedRemoveFormation"));
      } else {
        setEducations(educations.filter((edu: any) => edu.id !== formationId));
        toast.success(t("formationRemoved"));
      }
    } catch (error) {
      toast.error("Failed to remove formation");
    }
  };

  const handleEditFormation = async () => {
    const startDate = new Date(
      parseInt(formation.fromYear),
      parseInt(formation.fromMonth),
    );
    const endDate = new Date(
      parseInt(formation.toYear),
      parseInt(formation.toMonth),
    );
    if (startDate > endDate) {
      toast.error(t("endDateAfterStart"));
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/educations/${formation.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            degree: formation.title,
            institution: formation.institution,
            from: startDate,
            to: endDate,
          }),
        },
      );
      const updatedFormation = await res.json();
      if (!res.ok) {
        toast.error(t("failedUpdateFormation"));
      } else {
        toast.success(t("formationUpdated"));
        setEducations(
          educations.map((edu: any) =>
            edu.id === formation.id ? updatedFormation : edu,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating formation:", error);
      toast.error(t("failedUpdateFormation"));
    } finally {
      setFormation({
        title: "",
        institution: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        description: "",
        isCurrent: false,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[#008CBA] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">{t("education")}</h3>
        </div>
        {isEditing && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#008CBA] hover:bg-[#007399] text-white rounded-lg  transition text-sm font-medium">
                <Plus className="w-4 h-4" />
                {t("add")}
              </button>
            </DialogTrigger>
            <DialogContent
              dir={i18n.dir()}
              className="bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden"
            >
              <DialogTitle>{t("addNewFormation")}</DialogTitle>
              <div className="flex flex-col gap-1">
                <Label className="input-label">{t("formationTitle")}</Label>
                <Input
                  type="text"
                  placeholder={t("formationTitle")}
                  onChange={(e) =>
                    setFormation({
                      ...formation,
                      title: e.target.value,
                    })
                  }
                  className="input-filter ltr:pl-2! rtl:pr-2!"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="input-label">{t("institution")}</Label>
                <Input
                  type="text"
                  placeholder={t("institution")}
                  onChange={(e) =>
                    setFormation({
                      ...formation,
                      institution: e.target.value,
                    })
                  }
                  className="input-filter ltr:pl-2! rtl:pr-2!"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  <Label className="input-label">{t("from")}</Label>
                  <div className="flex justify-center items-center gap-2">
                    <Select
                      onValueChange={(value) =>
                        setFormation((prev) => ({
                          ...prev,
                          fromMonth: value,
                        }))
                      }
                      value={formation.fromMonth}
                    >
                      <SelectTrigger
                        dir={i18n.dir()}
                        className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                      >
                        <SelectValue placeholder={t("selectMonth")} />
                      </SelectTrigger>
                      <SelectContent dir={i18n.dir()} className="bg-white">
                        {months.map((month, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                          >
                            {t(month)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) =>
                        setFormation((prev) => ({
                          ...prev,
                          fromYear: value,
                        }))
                      }
                    >
                      <SelectTrigger
                        dir={i18n.dir()}
                        className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                      >
                        <SelectValue placeholder={t("selectYear")} />
                      </SelectTrigger>
                      <SelectContent dir={i18n.dir()} className="bg-white">
                        {years.map((year, index) => (
                          <SelectItem key={index} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <Label className="input-label">{t("to")}</Label>
                  <div className="flex justify-center items-center gap-2">
                    <Select
                      onValueChange={(value) =>
                        setFormation((prev) => ({
                          ...prev,
                          toMonth: value,
                        }))
                      }
                    >
                      <SelectTrigger
                        dir={i18n.dir()}
                        className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                      >
                        <SelectValue placeholder={t("selectMonth")} />
                      </SelectTrigger>
                      <SelectContent dir={i18n.dir()} className="bg-white">
                        {months.map((month, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                          >
                            {t(month)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) =>
                        setFormation((prev) => ({
                          ...prev,
                          toYear: value,
                        }))
                      }
                    >
                      <SelectTrigger
                        dir={i18n.dir()}
                        className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                      >
                        <SelectValue placeholder={t("selectYear")} />
                      </SelectTrigger>
                      <SelectContent dir={i18n.dir()} className="bg-white">
                        {years.map((year, index) => (
                          <SelectItem key={index} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    className="border-[#008CBA] text-[#008CBA] hover:bg-gray-50 cursor-pointer"
                    variant="outline"
                  >
                    {t("cancel", { ns: "common" })}
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() => handleAddFormation()}
                    className="bg-[#008CBA] hover:bg-[#007399] text-white cursor-pointer"
                  >
                    {t("saveChanges")}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-5">
        {educations?.map((edu, index) => (
          <div key={index} className="flex gap-4 relative">
            <div className="flex-shrink-0 w-12 h-12 bg-[#E6F7FB] rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#008CBA]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{edu?.degree}</h4>
              <p className="text-[#008CBA] font-medium mt-1">
                {edu?.institution}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t(months[new Date(edu.from).getMonth()])}-
                {new Date(edu.from).getFullYear()}
                {"    "}
                {t(months[new Date(edu.to).getMonth()])}-
                {new Date(edu.to).getFullYear()}
              </p>
            </div>
            {isEditing && (
              <div className="absolute top-2 ltr:right-2 rtl:left-2 flex flex-row gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      onClick={() =>
                        setFormation({
                          id: edu.id,
                          title: edu.degree,
                          institution: edu.institution,
                          fromMonth: (
                            new Date(edu.from).getMonth() + 1
                          ).toString(),
                          fromYear: new Date(edu.from).getFullYear().toString(),
                          toMonth: (new Date(edu.to).getMonth() + 1).toString(),
                          toYear: new Date(edu.to).getFullYear().toString(),
                        })
                      }
                      className="box-content bg-primary-50 rounded-lg block text-primary-500 cursor-pointer p-2"
                    >
                      <Pen className=" w-5 h-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    dir={i18n.dir()}
                    className="bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden"
                  >
                    <DialogTitle>{t("addNewFormation")}</DialogTitle>
                    <div className="flex flex-col gap-1">
                      <Label className="input-label">
                        {t("formationTitle")}
                      </Label>
                      <Input
                        type="text"
                        placeholder={t("formationTitle")}
                        value={formation.title}
                        onChange={(e) =>
                          setFormation({
                            ...formation,
                            title: e.target.value,
                          })
                        }
                        className="input-filter ltr:pl-2! rtl:pr-2!"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="input-label">{t("institution")}</Label>
                      <Input
                        type="text"
                        placeholder={t("institution")}
                        value={formation.institution}
                        onChange={(e) =>
                          setFormation({
                            ...formation,
                            institution: e.target.value,
                          })
                        }
                        className="input-filter ltr:pl-2! rtl:pr-2!"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <Label className="input-label">{t("from")}</Label>
                        <div className="flex justify-center items-center gap-2">
                          <Select
                            onValueChange={(value) =>
                              setFormation((prev) => ({
                                ...prev,
                                fromMonth: value,
                              }))
                            }
                            value={formation.fromMonth}
                          >
                            <SelectTrigger
                              dir={i18n.dir()}
                              className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                            >
                              <SelectValue placeholder={t("selectMonth")} />
                            </SelectTrigger>
                            <SelectContent
                              dir={i18n.dir()}
                              className="bg-white"
                            >
                              {months.map((month, index) => (
                                <SelectItem
                                  key={index}
                                  value={(index + 1).toString()}
                                >
                                  {t(month)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            onValueChange={(value) =>
                              setFormation((prev) => ({
                                ...prev,
                                fromYear: value,
                              }))
                            }
                            value={formation.fromYear}
                          >
                            <SelectTrigger
                              dir={i18n.dir()}
                              className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                            >
                              <SelectValue placeholder={t("selectYear")} />
                            </SelectTrigger>
                            <SelectContent
                              dir={i18n.dir()}
                              className="bg-white"
                            >
                              {years.map((year, index) => (
                                <SelectItem key={index} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <Label className="input-label">{t("to")}</Label>
                        <div className="flex justify-center items-center gap-2">
                          <Select
                            onValueChange={(value) =>
                              setFormation((prev) => ({
                                ...prev,
                                toMonth: value,
                              }))
                            }
                            value={formation.toMonth}
                          >
                            <SelectTrigger
                              dir={i18n.dir()}
                              className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                            >
                              <SelectValue placeholder={t("selectMonth")} />
                            </SelectTrigger>
                            <SelectContent
                              dir={i18n.dir()}
                              className="bg-white"
                            >
                              {months.map((month, index) => (
                                <SelectItem
                                  key={index}
                                  value={(index + 1).toString()}
                                >
                                  {t(month)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            onValueChange={(value) =>
                              setFormation((prev) => ({
                                ...prev,
                                toYear: value,
                              }))
                            }
                            value={formation.toYear}
                          >
                            <SelectTrigger
                              dir={i18n.dir()}
                              className="input-filter flex w-full justify-between ltr:pl-2! rtl:pr-2!"
                            >
                              <SelectValue placeholder={t("selectYear")} />
                            </SelectTrigger>
                            <SelectContent
                              dir={i18n.dir()}
                              className="bg-white"
                            >
                              {years.map((year, index) => (
                                <SelectItem key={index} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          className="border-[#008CBA] text-[#008CBA] hover:bg-gray-50 cursor-pointer"
                          variant="outline"
                        >
                          {t("cancel", { ns: "common" })}
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          onClick={() => handleEditFormation()}
                          className="bg-[#008CBA] hover:bg-[#007399] text-white cursor-pointer"
                        >
                          {t("saveChanges")}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <XIcon
                  onClick={() => handleRemoveFormation(edu.id)}
                  className="box-content bg-red-50 rounded-lg block text-red-500 cursor-pointer w-5 h-5 p-2"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileEducation;

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
import { Pen, Plus, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { set } from "zod";
import { useTranslation } from "react-i18next";

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

function ProfileExperience({ isEditing, experiences, setExperiences }: any) {
  const { t } = useTranslation("jobseeker");
  const { user } = useSelector((state: any) => state.user);
  const [experience, setExperience] = useState({
    title: "",
    company: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    description: "",
  });

  const handleAddExperience = async () => {
    // check the validity of the experience data
    const startDate = new Date(
      parseInt(experience.fromYear),
      parseInt(experience.fromMonth) - 1,
    );
    const endDate = new Date(
      parseInt(experience.toYear),
      parseInt(experience.toMonth) - 1,
    );

    if (startDate > endDate) {
      toast.error(t("endDateAfterStart"));
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/experiences`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            title: experience.title,
            company: experience.company,
            from: startDate,
            to: endDate,
            description: experience.description,
          }),
        },
      );
      const newExperience = await res.json();
      if (!res.ok) {
        toast.error(t("failedAddExperience"));
      } else {
        toast.success(t("experienceAdded"));
        setExperiences([...experiences, newExperience]);
        console.log(experiences);
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      toast.error(t("failedAddExperience"));
    } finally {
      // reset experience form
      setExperience({
        title: "",
        company: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        description: "",
      });
    }
  };

  const handleRemoveExperience = async (experienceId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/experiences/${experienceId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        toast.error(t("failedRemoveExperience"));
      } else {
        setExperiences(
          experiences.filter((exp: any) => exp.id !== experienceId),
        );
        toast.success(t("experienceRemoved"));
      }
    } catch (error) {
      toast.error("Failed to remove experience");
    }
  };

  const handleEditExperience = async () => {
    const startDate = new Date(
      parseInt(experience.fromYear),
      parseInt(experience.fromMonth),
    );
    const endDate = new Date(
      parseInt(experience.toYear),
      parseInt(experience.toMonth),
    );

    if (startDate > endDate) {
      toast.error(t("endDateAfterStart"));
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/experiences/${experience.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: experience.title,
            company: experience.company,
            from: startDate,
            to: endDate,
            description: experience.description,
          }),
        },
      );
      const updatedExperience = await res.json();
      if (!res.ok) {
        toast.error(t("failedUpdateExperience"));
      } else {
        toast.success(t("experienceUpdated"));
        setExperiences(
          experiences.map((exp: any) =>
            exp.id === experience.id ? updatedExperience : exp,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error(t("failedUpdateExperience"));
    } finally {
      // reset experience form
      setExperience({
        title: "",
        company: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        description: "",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-blue rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">
            {t("professionalExperience")}
          </h3>
        </div>
        {isEditing && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#008CBA] hover:bg-[#007399] text-white rounded-lg  transition text-sm font-medium">
                <Plus className="w-4 h-4" />
                {t("add")}
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden">
              <DialogTitle>{t("addNewExperience")}</DialogTitle>
              <div className="flex flex-col gap-1">
                <Label className="input-label">{t("jobTitle")}</Label>
                <Input
                  type="text"
                  placeholder={t("jobTitle")}
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      title: e.target.value,
                    })
                  }
                  className="input-filter pl-2!"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="input-label">{t("company")}</Label>
                <Input
                  type="text"
                  placeholder={t("company")}
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      company: e.target.value,
                    })
                  }
                  className="input-filter pl-2!"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  <Label className="input-label">{t("from")}</Label>
                  <div className="flex justify-center items-center gap-2">
                    <Select
                      onValueChange={(value) =>
                        setExperience((prev) => ({
                          ...prev,
                          fromMonth: value,
                        }))
                      }
                      value={experience.fromMonth}
                    >
                      <SelectTrigger className="input-filter flex w-full justify-between pl-2!">
                        <SelectValue placeholder={t("selectMonth")} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {months.map((month, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) =>
                        setExperience((prev) => ({
                          ...prev,
                          fromYear: value,
                        }))
                      }
                    >
                      <SelectTrigger className="input-filter flex w-full justify-between pl-2!">
                        <SelectValue placeholder={t("selectYear")} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
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
                        setExperience((prev) => ({
                          ...prev,
                          toMonth: value,
                        }))
                      }
                    >
                      <SelectTrigger className="input-filter flex w-full justify-between pl-2!">
                        <SelectValue placeholder={t("selectMonth")} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {months.map((month, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) =>
                        setExperience((prev) => ({
                          ...prev,
                          toYear: value,
                        }))
                      }
                    >
                      <SelectTrigger className="input-filter flex w-full justify-between pl-2!">
                        <SelectValue placeholder={t("selectYear")} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
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
              <div className="flex flex-col gap-1 w-full">
                <Label className="input-label">{t("jobDescription")}</Label>
                <textarea
                  placeholder={t("jobDescription")}
                  rows={4}
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      description: e.target.value,
                    })
                  }
                  className="input-filter pl-2! resize-none"
                />
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
                    onClick={() => handleAddExperience()}
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

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-[#008CBA] before:rounded-full before:shadow-lg"
          >
            {index !== experiences.length - 1 && (
              <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-gray-200"></div>
            )}
            <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
            <p className="text-[#008CBA] font-semibold mt-1">{exp.company}</p>
            <p className="text-sm text-gray-500 mt-1">
              {months[new Date(exp.from).getMonth()]}-
              {new Date(exp.from).getFullYear()}
              {"    "}
              {months[new Date(exp.to).getMonth()]}-
              {new Date(exp.to).getFullYear()}
            </p>
            <p className="text-gray-700 mt-3 leading-relaxed">
              {exp.description}
            </p>
            {isEditing && (
              <div className="top-2 right-2 absolute flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      onClick={() =>
                        setExperience({
                          id: exp.id,
                          title: exp.title,
                          company: exp.company,
                          fromMonth: (
                            new Date(exp.from).getMonth() + 1
                          ).toString(),
                          fromYear: new Date(exp.from).getFullYear().toString(),
                          toMonth: (new Date(exp.to).getMonth() + 1).toString(),
                          toYear: new Date(exp.to).getFullYear().toString(),
                          description: exp.description,
                        })
                      }
                      className="p-2 rounded-lg box-content bg-primary-50 text-primary-500 cursor-pointer"
                    >
                      <Pen className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden">
                    <DialogTitle>{t("addNewExperience")}</DialogTitle>
                    <div className="flex flex-col gap-1">
                      <Label className="input-label">Job Title</Label>
                      <Input
                        type="text"
                        placeholder="Job Title"
                        onChange={(e) =>
                          setExperience({
                            ...experience,
                            title: e.target.value,
                          })
                        }
                        value={experience.title}
                        className="input-filter pl-2!"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="input-label">Company</Label>
                      <Input
                        type="text"
                        placeholder="Company"
                        onChange={(e) =>
                          setExperience({
                            ...experience,
                            company: e.target.value,
                          })
                        }
                        value={experience.company}
                        className="input-filter pl-2!"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <Label className="input-label">{t("from")}</Label>
                        <div className="flex justify-center items-center gap-2">
                          <Select
                            onValueChange={(value) =>
                              setExperience((prev) => ({
                                ...prev,
                                fromMonth: value,
                              }))
                            }
                            value={experience.fromMonth}
                          >
                            <SelectTrigger className="input-filter flex w-full justify-between pl-2!">
                              <SelectValue placeholder={t("selectMonth")} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {months.map((month, index) => (
                                <SelectItem
                                  key={index}
                                  value={(index + 1).toString()}
                                >
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            onValueChange={(value) =>
                              setExperience((prev) => ({
                                ...prev,
                                fromYear: value,
                              }))
                            }
                            value={experience.fromYear}
                          >
                            <SelectTrigger className="input-filter flex w-full justify-between pl-2!">
                              <SelectValue placeholder={t("selectYear")} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
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
                              setExperience((prev) => ({
                                ...prev,
                                toMonth: value,
                              }))
                            }
                            value={experience.toMonth}
                          >
                            <SelectTrigger className="input-filter flex w-full justify-between pl-2!">
                              <SelectValue placeholder={t("selectMonth")} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {months.map((month, index) => (
                                <SelectItem
                                  key={index}
                                  value={(index + 1).toString()}
                                >
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            onValueChange={(value) =>
                              setExperience((prev) => ({
                                ...prev,
                                toYear: value,
                              }))
                            }
                            value={experience.toYear}
                          >
                            <SelectTrigger className="input-filter flex w-full justify-between pl-2!">
                              <SelectValue placeholder={t("selectYear")} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
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
                    <div className="flex flex-col gap-1 w-full">
                      <Label className="input-label">Job Description</Label>
                      <textarea
                        placeholder="Job Description"
                        rows={4}
                        onChange={(e) =>
                          setExperience({
                            ...experience,
                            description: e.target.value,
                          })
                        }
                        value={experience.description}
                        className="input-filter pl-2! resize-none"
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          className="border-[#008CBA] text-[#008CBA] hover:bg-gray-50 cursor-pointer"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          onClick={() => handleEditExperience()}
                          className="bg-[#008CBA] hover:bg-[#007399] text-white cursor-pointer"
                        >
                          Save changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <XIcon
                  onClick={() => handleRemoveExperience(exp.id)}
                  className="p-2 rounded-lg box-content bg-red-50 text-red-500 cursor-pointer w-5 h-5"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileExperience;

import { useState } from "react";
import { Languages, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

interface Language {
  language: string;
  level: string;
}

function ProfileLanguage({
  isEditing,
  languages,
  setLanguages,
}: {
  isEditing: boolean;
  languages: Language[];
  setLanguages: React.Dispatch<React.SetStateAction<Language[]>>;
}) {
  const { t } = useTranslation("jobseeker");
  const { user } = useSelector((state: any) => state.user);
  const [language, setLanguage] = useState<Language>({
    language: "",
    level: "",
  });

  const handleAddLanguage = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/languages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...language, userId: user.id }),
        },
      );
      if (!res.ok) {
        toast.error(t("failedAddLanguage"));
        return;
      } else {
        const newLanguage = await res.json();
        setLanguages((prev) => [...prev, newLanguage]);
        toast.success(t("languageAdded"));
      }
    } catch (error) {
      toast.error(t("failedAddLanguage"));
    } finally {
      setLanguage({
        language: "",
        level: "",
      });
    }
  };

  const handleDeleteLanguage = async (id: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/languages/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        toast.error(t("failedDeleteLanguage"));
        return;
      } else {
        setLanguages((prev) => prev.filter((lang) => lang.id !== id));
        toast.success(t("languageDeleted"));
      }
    } catch (error) {
      toast.error(t("failedDeleteLanguage"));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-[#008CBA]" />
          <h3 className="text-lg font-bold text-gray-900">{t("languages")}</h3>
        </div>
        {isEditing && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#008CBA] hover:bg-[#007399] text-white rounded-lg transition text-sm font-medium">
                <Plus className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent
              dir={i18n.dir()}
              className="bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden"
            >
              <DialogTitle>{t("addLanguage")}</DialogTitle>
              <div className="flex flex-col gap-1">
                <Label className="input-label mb-1">{t("languageLabel")}</Label>
                <Input
                  type="text"
                  placeholder={t("languageLabel")}
                  onChange={(e) =>
                    setLanguage({
                      ...language,
                      language: e.target.value,
                    })
                  }
                  className="input-filter ltr:pl-2! rtl:pr-2!"
                />
              </div>
              <div className="relative">
                <Label className="input-label mb-1.5">
                  {t("languageLevel")}
                </Label>
                <Select
                  value={language.level}
                  onValueChange={(value) =>
                    setLanguage({ ...language, level: value })
                  }
                >
                  <SelectTrigger
                    dir={i18n.dir()}
                    className="input-filter rtl:pr-2! ltr:pl-2!"
                  >
                    <SelectValue placeholder={t("selectLanguageLevel")} />
                  </SelectTrigger>
                  <SelectContent
                    dir={i18n.dir()}
                    className="p-2 border-gray-300 bg-white"
                  >
                    <SelectItem value="A1 - Beginner">{t("A1")}</SelectItem>
                    <SelectItem value="A2 - Elementary">{t("A2")}</SelectItem>
                    <SelectItem value="B1 - Intermediate">{t("B1")}</SelectItem>
                    <SelectItem value="B2 - Upper Intermediate">
                      {t("B2")}
                    </SelectItem>
                    <SelectItem value="C1 - Advanced">{t("C1")}</SelectItem>
                    <SelectItem value="C2 - Proficient">{t("C2")}</SelectItem>
                    <SelectItem value="Native">{t("Native")}</SelectItem>
                  </SelectContent>
                </Select>
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
                    onClick={() => handleAddLanguage()}
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

      <div className="space-y-3">
        {languages?.map((lang, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
          >
            <div>
              <p className="font-semibold text-gray-900">{lang.language}</p>
              <p className="text-sm text-gray-600">{lang.level}</p>
            </div>
            {isEditing && (
              <button
                onClick={() => handleDeleteLanguage(lang.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileLanguage;

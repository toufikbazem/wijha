import { useState } from "react";
import { Languages, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
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
import { Label } from "@/components/ui/label";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

const levels = [
  "A1 - Beginner",
  "A2 - Elementary",
  "B1 - Intermediate",
  "B2 - Upper Intermediate",
  "C1 - Advanced",
  "C2 - Proficient",
  "Native",
];

export default function JobSeekerLanguageSection({
  isEditing,
  userId,
  languages,
  setLanguages,
}: {
  isEditing: boolean;
  userId?: string;
  languages: any[];
  setLanguages: (next: any[]) => void;
}) {
  const [draft, setDraft] = useState<{ language: string; level: string }>({
    language: "",
    level: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function add() {
    if (!userId) {
      toast.error("This seeker has no linked user account");
      return;
    }
    if (!draft.language || !draft.level) {
      toast.error("Please provide both language and level");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/languages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, userId }),
      });
      const newLang = await res.json();
      if (!res.ok) throw new Error(newLang?.message ?? "Failed");
      setLanguages([...languages, newLang]);
      toast.success("Language added");
      setDraft({ language: "", level: "" });
    } catch (e: any) {
      toast.error(e.message ?? "Failed to add language");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: number | string) {
    if (!confirm("Remove this language?")) return;
    try {
      const res = await fetch(`${BASE}/languages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      setLanguages(languages.filter((l: any) => l.id !== id));
      toast.success("Language removed");
    } catch {
      toast.error("Failed to remove language");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-[#008CBA]" />
          <h3 className="text-lg font-bold text-gray-900">Languages</h3>
        </div>
        {isEditing && (
          <Dialog
            onOpenChange={(open) => {
              if (open) setDraft({ language: "", level: "" });
            }}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-[#008CBA] hover:bg-[#007399] text-white rounded-lg transition text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
              <DialogTitle>Add language</DialogTitle>
              <div className="flex flex-col gap-1">
                <Label>Language</Label>
                <Input
                  placeholder="e.g. English"
                  value={draft.language}
                  onChange={(e) =>
                    setDraft({ ...draft, language: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Level</Label>
                <Select
                  value={draft.level}
                  onValueChange={(v) => setDraft({ ...draft, level: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    disabled={submitting}
                    onClick={add}
                    className="bg-[#008CBA] hover:bg-[#007399] text-white"
                  >
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {languages.length === 0 ? (
        <p className="text-sm text-gray-500 py-2">No languages added.</p>
      ) : (
        <div className="space-y-3">
          {languages.map((lang: any, i: number) => (
            <div
              key={lang.id ?? i}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-900">{lang.language}</p>
                <p className="text-sm text-gray-600">{lang.level}</p>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => remove(lang.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove language"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

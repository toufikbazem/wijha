import { useState } from "react";
import { Pen, Plus, X, Briefcase } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

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

type ExperienceForm = {
  id?: string;
  title: string;
  company: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  description: string;
};

const empty: ExperienceForm = {
  title: "",
  company: "",
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
  description: "",
};

export default function JobSeekerExperienceSection({
  isEditing,
  userId,
  experiences,
  setExperiences,
}: {
  isEditing: boolean;
  userId?: string;
  experiences: any[];
  setExperiences: (next: any[]) => void;
}) {
  const [exp, setExp] = useState<ExperienceForm>(empty);
  const [submitting, setSubmitting] = useState(false);

  async function add() {
    if (!userId) {
      toast.error("This seeker has no linked user account");
      return;
    }
    const startDate = new Date(
      parseInt(exp.fromYear),
      parseInt(exp.fromMonth) - 1,
    );
    const endDate = new Date(parseInt(exp.toYear), parseInt(exp.toMonth) - 1);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast.error("Please fill in all date fields");
      return;
    }
    if (startDate > endDate) {
      toast.error("End date must be after start date");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/experiences`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: exp.title,
          company: exp.company,
          from: startDate,
          to: endDate,
          description: exp.description,
        }),
      });
      const newExp = await res.json();
      if (!res.ok) throw new Error(newExp?.message ?? "Failed");
      setExperiences([...experiences, newExp]);
      toast.success("Experience added");
      setExp(empty);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? "Failed to add experience");
    } finally {
      setSubmitting(false);
    }
  }

  async function update() {
    if (!exp.id) return;
    const startDate = new Date(
      parseInt(exp.fromYear),
      parseInt(exp.fromMonth) - 1,
    );
    const endDate = new Date(parseInt(exp.toYear), parseInt(exp.toMonth) - 1);
    if (startDate > endDate) {
      toast.error("End date must be after start date");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/experiences/${exp.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: exp.title,
          company: exp.company,
          from: startDate,
          to: endDate,
          description: exp.description,
        }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.message ?? "Failed");
      setExperiences(
        experiences.map((e: any) => (e.id === exp.id ? updated : e)),
      );
      toast.success("Experience updated");
      setExp(empty);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update experience");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this experience?")) return;
    try {
      const res = await fetch(`${BASE}/experiences/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      setExperiences(experiences.filter((e: any) => e.id !== id));
      toast.success("Experience removed");
    } catch {
      toast.error("Failed to remove experience");
    }
  }

  const dialogFields = (
    <>
      <div className="flex flex-col gap-1">
        <Label>Job title</Label>
        <Input
          placeholder="Job title"
          value={exp.title}
          onChange={(e) => setExp({ ...exp, title: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Company</Label>
        <Input
          placeholder="Company"
          value={exp.company}
          onChange={(e) => setExp({ ...exp, company: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>From</Label>
          <div className="flex gap-2">
            <Select
              value={exp.fromMonth}
              onValueChange={(v) => setExp((p) => ({ ...p, fromMonth: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={exp.fromYear}
              onValueChange={(v) => setExp((p) => ({ ...p, fromYear: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label>To</Label>
          <div className="flex gap-2">
            <Select
              value={exp.toMonth}
              onValueChange={(v) => setExp((p) => ({ ...p, toMonth: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={exp.toYear}
              onValueChange={(v) => setExp((p) => ({ ...p, toYear: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Label>Description</Label>
        <Textarea
          rows={4}
          placeholder="Description"
          value={exp.description}
          onChange={(e) => setExp({ ...exp, description: e.target.value })}
        />
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[#008CBA] rounded-full" />
          <h3 className="text-xl font-bold text-gray-900">
            Professional Experience
          </h3>
        </div>
        {isEditing && (
          <Dialog
            onOpenChange={(open) => {
              if (open) setExp(empty);
            }}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-[#008CBA] hover:bg-[#007399] text-white rounded-lg transition text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
              <DialogTitle>Add experience</DialogTitle>
              {dialogFields}
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

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm">No experience added.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((e: any, index: number) => (
            <div
              key={e.id ?? index}
              className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-[#008CBA] before:rounded-full before:shadow-lg"
            >
              {index !== experiences.length - 1 && (
                <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-gray-200" />
              )}
              <h4 className="font-bold text-gray-900 text-lg">{e.title}</h4>
              <p className="text-[#008CBA] font-semibold mt-1">{e.company}</p>
              {e.from && (
                <p className="text-sm text-gray-500 mt-1">
                  {months[new Date(e.from).getMonth()]}-
                  {new Date(e.from).getFullYear()}
                  {"  —  "}
                  {e.to
                    ? `${months[new Date(e.to).getMonth()]}-${new Date(e.to).getFullYear()}`
                    : "Present"}
                </p>
              )}
              {e.description && (
                <p className="text-gray-700 mt-3 leading-relaxed">
                  {e.description}
                </p>
              )}
              {isEditing && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) {
                        setExp({
                          id: e.id,
                          title: e.title ?? "",
                          company: e.company ?? "",
                          fromMonth: e.from
                            ? (new Date(e.from).getMonth() + 1).toString()
                            : "",
                          fromYear: e.from
                            ? new Date(e.from).getFullYear().toString()
                            : "",
                          toMonth: e.to
                            ? (new Date(e.to).getMonth() + 1).toString()
                            : "",
                          toYear: e.to
                            ? new Date(e.to).getFullYear().toString()
                            : "",
                          description: e.description ?? "",
                        });
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="p-2 rounded-lg bg-[#E6F7FB] text-[#008CBA] cursor-pointer"
                        aria-label="Edit experience"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
                      <DialogTitle>Edit experience</DialogTitle>
                      {dialogFields}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            disabled={submitting}
                            onClick={update}
                            className="bg-[#008CBA] hover:bg-[#007399] text-white"
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <button
                    type="button"
                    onClick={() => remove(e.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 cursor-pointer"
                    aria-label="Remove experience"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

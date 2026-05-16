import { useState } from "react";
import { GraduationCap, Pen, Plus, X } from "lucide-react";
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

type EducationForm = {
  id?: string;
  degree: string;
  institution: string;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
};

const empty: EducationForm = {
  degree: "",
  institution: "",
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
};

export default function JobSeekerEducationSection({
  isEditing,
  userId,
  educations,
  setEducations,
}: {
  isEditing: boolean;
  userId?: string;
  educations: any[];
  setEducations: (next: any[]) => void;
}) {
  const [edu, setEdu] = useState<EducationForm>(empty);
  const [submitting, setSubmitting] = useState(false);

  async function add() {
    if (!userId) {
      toast.error("This seeker has no linked user account");
      return;
    }
    const startDate = new Date(parseInt(edu.fromYear), parseInt(edu.fromMonth) - 1);
    const endDate = new Date(parseInt(edu.toYear), parseInt(edu.toMonth) - 1);
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
      const res = await fetch(`${BASE}/educations`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: edu.degree,
          institution: edu.institution,
          from: startDate,
          to: endDate,
        }),
      });
      const newEdu = await res.json();
      if (!res.ok) throw new Error(newEdu?.message ?? "Failed");
      setEducations([...educations, newEdu]);
      toast.success("Education added");
      setEdu(empty);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to add education");
    } finally {
      setSubmitting(false);
    }
  }

  async function update() {
    if (!edu.id) return;
    const startDate = new Date(parseInt(edu.fromYear), parseInt(edu.fromMonth) - 1);
    const endDate = new Date(parseInt(edu.toYear), parseInt(edu.toMonth) - 1);
    if (startDate > endDate) {
      toast.error("End date must be after start date");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/educations/${edu.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          degree: edu.degree,
          institution: edu.institution,
          from: startDate,
          to: endDate,
        }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.message ?? "Failed");
      setEducations(
        educations.map((e: any) => (e.id === edu.id ? updated : e)),
      );
      toast.success("Education updated");
      setEdu(empty);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update education");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this education entry?")) return;
    try {
      const res = await fetch(`${BASE}/educations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      setEducations(educations.filter((e: any) => e.id !== id));
      toast.success("Education removed");
    } catch {
      toast.error("Failed to remove education");
    }
  }

  const dialogFields = (
    <>
      <div className="flex flex-col gap-1">
        <Label>Degree</Label>
        <Input
          placeholder="Degree"
          value={edu.degree}
          onChange={(e) => setEdu({ ...edu, degree: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Institution</Label>
        <Input
          placeholder="Institution"
          value={edu.institution}
          onChange={(e) => setEdu({ ...edu, institution: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>From</Label>
          <div className="flex gap-2">
            <Select
              value={edu.fromMonth}
              onValueChange={(v) => setEdu((p) => ({ ...p, fromMonth: v }))}
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
              value={edu.fromYear}
              onValueChange={(v) => setEdu((p) => ({ ...p, fromYear: v }))}
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
              value={edu.toMonth}
              onValueChange={(v) => setEdu((p) => ({ ...p, toMonth: v }))}
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
              value={edu.toYear}
              onValueChange={(v) => setEdu((p) => ({ ...p, toYear: v }))}
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
    </>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[#008CBA] rounded-full" />
          <h3 className="text-xl font-bold text-gray-900">Education</h3>
        </div>
        {isEditing && (
          <Dialog
            onOpenChange={(open) => {
              if (open) setEdu(empty);
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
              <DialogTitle>Add education</DialogTitle>
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

      {educations.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm">No education added.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {educations.map((e: any, index: number) => (
            <div key={e.id ?? index} className="flex gap-4 relative">
              <div className="flex-shrink-0 w-12 h-12 bg-[#E6F7FB] rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#008CBA]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{e.degree}</h4>
                <p className="text-[#008CBA] font-medium mt-1">
                  {e.institution}
                </p>
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
              </div>
              {isEditing && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) {
                        setEdu({
                          id: e.id,
                          degree: e.degree ?? "",
                          institution: e.institution ?? "",
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
                        });
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="p-2 rounded-lg bg-[#E6F7FB] text-[#008CBA] cursor-pointer"
                        aria-label="Edit education"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
                      <DialogTitle>Edit education</DialogTitle>
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
                    aria-label="Remove education"
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

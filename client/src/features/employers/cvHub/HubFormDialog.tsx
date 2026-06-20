import { useEffect, useState } from "react";
import { Check, FolderOpen, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { statuses } from "./constants";
import type { CvHub, HubStatus } from "./types";

/**
 * HubFormDialog — create / edit hub dialog.
 *
 * In "create" mode it renders its own trigger button. In "edit" mode it is a
 * controlled dialog (open/onOpenChange supplied by the parent card).
 */
export default function HubFormDialog({
  mode,
  hub,
  onSaved,
  open: controlledOpen,
  onOpenChange,
}: {
  mode: "create" | "edit";
  hub?: CvHub;
  onSaved: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [name, setName] = useState(hub?.name ?? "");
  const [description, setDescription] = useState(hub?.description ?? "");
  const [status, setStatus] = useState<HubStatus>(hub?.status ?? "active");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset fields to the hub's values whenever the dialog opens.
  useEffect(() => {
    if (open) {
      setName(hub?.name ?? "");
      setDescription(hub?.description ?? "");
      setStatus(hub?.status ?? "active");
      setError("");
    }
  }, [open, hub]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Hub name is required.");
      return;
    }
    setSaving(true);
    try {
      const BASE = `${import.meta.env.VITE_API_URL}/api/v1/cv-hub`;
      if (mode === "create") {
        const res = await fetch(BASE, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, status }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error("Failed to save hub");
        }
        toast.success("CV hub created");
      } else if (hub) {
        const res = await fetch(`${BASE}/${hub.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, status }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast("Failed to save hub");
        }
        toast.success("CV hub updated");
      }
      setOpen(false);
      onSaved();
    } catch (err: any) {
      toast.error("Failed to save hub");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === "create" && (
        <DialogTrigger asChild>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-[#008CBA] text-white font-medium rounded-lg hover:bg-[#007399] transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            Create CV Hub
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader className="flex flex-row gap-4 mr-8">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F7FB]">
            <FolderOpen className="h-6 w-6 text-[#008CBA]" />
          </div>
          <div>
            <DialogTitle className="text-xl">
              {mode === "create" ? "Create a new CV Hub" : "Edit CV Hub"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Set up a talent pool. You'll get a shareable form for candidates to submit their CVs."
                : "Update this hub's name, description, or status."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="hub-name"
              className="text-sm font-medium text-gray-700"
            >
              Hub name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="hub-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Frontend Engineers — 2026"
              maxLength={80}
              className="focus-visible:ring-[#008CBA]"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="hub-description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="hub-description"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe who this talent pool is for…"
              rows={3}
              maxLength={300}
              className="resize-none focus-visible:ring-[#008CBA]"
            />
            <p className="text-right text-[11px] text-gray-400">
              {(description ?? "").length}/300
            </p>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`cursor-pointer px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                    status === s
                      ? "bg-[#008CBA] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-2 gap-2 sm:gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer text-gray-700"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={saving}
              className="cursor-pointer bg-[#008CBA] text-white hover:bg-[#007399]"
            >
              {saving ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <>
                  {mode === "create" ? (
                    <Plus className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
                  ) : (
                    <Check className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
                  )}
                  {mode === "create" ? "Create Hub" : "Save changes"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

export type ReasonRequiredStatus = "Pending" | "Rejected";

export default function StatusReasonDialog({
  open,
  status,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  status: ReasonRequiredStatus | null;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Reason is required.");
      return;
    }
    onConfirm(reason.trim());
  };

  const isReject = status === "Rejected";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isReject ? "Reject Job Post" : "Set Job Post to Pending"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Provide a reason that will be visible to the employer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter reason..."
          className={`min-h-[100px] text-sm border rounded-lg focus:ring-2 focus:ring-[#008CBA] focus:border-transparent ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={`text-white font-semibold rounded-xl transition-colors ${
              isReject
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#008CBA] hover:bg-[#007B9E]"
            }`}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

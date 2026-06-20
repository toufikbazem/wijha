import { useState } from "react";
import {
  Archive,
  Eye,
  FolderOpen,
  Inbox,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
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
import { statusStyles } from "./constants";
import HubFormDialog from "./HubFormDialog";
import ShareHubDialog from "./ShareHubDialog";
import Metric from "./Metric";
import MenuItem from "./MenuItem";
import type { CvHub } from "./types";

/**
 * HubCard — a single hub tile in the hubs grid. Shows status, stats, share /
 * view actions, and an actions menu (edit / close / delete).
 */
export default function HubCard({
  hub,
  onChanged,
}: {
  hub: CvHub;
  onChanged: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const status = statusStyles[hub.status];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/cv-hub/${hub.id}`,
        { method: "DELETE", credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to delete hub");
      }
      toast.success("Hub deleted");
      setConfirmDelete(false);
      onChanged();
    } catch (err: any) {
      toast.error("Failed to delete hub");
    } finally {
      setDeleting(false);
    }
  };

  // Close hub = set status to "closed" (stops accepting submissions).
  const handleClose = async () => {
    setMenuOpen(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/cv-hub/${hub.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "closed" }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to close hub");
      } else {
        toast.success("Hub closed");
        onChanged();
      }
    } catch (err: any) {
      toast.error("Failed to close hub");
    }
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300  hover:shadow-md hover:shadow-[#008CBA]/10">
      {/* Header: icon + title/status + actions menu */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#008CBA] to-[#00a8db] text-white shadow-sm shadow-[#008CBA]/20">
          <FolderOpen className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            title={hub.name}
            className="truncate text-base font-semibold leading-tight text-gray-900"
          >
            {hub.name}
          </h3>
          <span
            className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-gray-200/80 ${status.dotText}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {menuOpen && (
            <>
              {/* Click-away backdrop */}
              <div
                className="fixed inset-0 z-0"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg ltr:right-0 rtl:left-0">
                <MenuItem
                  icon={Pencil}
                  label="Edit"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditOpen(true);
                  }}
                />
                {hub.status !== "closed" && (
                  <MenuItem
                    icon={Archive}
                    label="Close hub"
                    onClick={handleClose}
                  />
                )}
                <div className="my-1 h-px bg-gray-100" />
                <MenuItem
                  icon={Trash2}
                  label="Delete"
                  danger
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmDelete(true);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {hub.description && (
        <p className="mt-4 line-clamp-2 flex-1 text-sm text-gray-500">
          {hub.description}
        </p>
      )}

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric icon={Users} value={hub.cv_count ?? 0} label="CVs" />
        <Metric
          icon={Inbox}
          value={hub.new_count ?? 0}
          label="New"
          highlight={(hub.new_count ?? 0) > 0}
        />
        <Metric icon={Eye} value={hub.views} label="Views" />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
        <div className="ltr:ml-auto rtl:mr-auto flex items-center gap-2">
          <ShareHubDialog hub={hub} />
          <button
            type="button"
            onClick={() => navigate(`/dashboard?tab=cvHubCvs&id=${hub.id}`)}
            className="text-ellipsis inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-[#008CBA] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#007399] hover:shadow-md"
          >
            <Eye className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />
            View CVs
          </button>
        </div>
      </div>

      {/* Edit dialog (controlled) */}
      <HubFormDialog
        mode="edit"
        hub={hub}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={onChanged}
      />

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this hub?</AlertDialogTitle>
            <AlertDialogDescription>
              “{hub.name}” and all {hub.cv_count ?? 0} collected CVs will be
              permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
            >
              {deleting ? <Spinner className="h-4 w-4" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

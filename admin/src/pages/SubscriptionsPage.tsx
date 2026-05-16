import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { adminApi } from "@/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Subscriptions", "Plans"] as const;

const planSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(0),
  duration_days: z.coerce.number().min(1),
  job_posts_limit: z.coerce.number().min(0),
  profile_access_limit: z.coerce.number().min(0),
  description: z.string().optional(),
});

export default function SubscriptionsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Subscriptions");

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Subscriptions</h1>

      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 text-sm font-medium transition-colors",
              tab === t ? "border-b-2 border-primary-600 text-primary-700" : "text-gray-500 hover:text-gray-900"
            )}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Subscriptions" && <SubscriptionsList />}
      {tab === "Plans" && <PlansList />}
    </div>
  );
}

function SubscriptionsList() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  function load(p = page) {
    setLoading(true);
    adminApi.getSubscriptions({ page: p, limit: 20 }).then(setData).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [page]);

  const rows = data?.subscriptions ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  async function changeStatus(id: string, status: string) {
    try {
      await adminApi.changeSubscriptionStatus(id, status);
      setData((prev: any) => ({
        ...prev,
        subscriptions: prev.subscriptions.map((s: any) => s.id === id ? { ...s, status } : s),
      }));
      toast.success("Status updated");
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Employer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Start</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">End</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-gray-100" /></td>)}</tr>
                ))
              : rows.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.company_name ?? r.employer_id}</td>
                    <td className="px-4 py-3 text-gray-600">{r.plan_name ?? "Custom"}</td>
                    <td className="px-4 py-3">
                      <Select value={r.status} onValueChange={(v) => changeStatus(r.id, v)}>
                        <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.start_day ? new Date(r.start_day).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{r.end_day ? new Date(r.end_day).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <ExtendDialog subId={r.id} onExtended={(s) => setData((prev: any) => ({
                        ...prev,
                        subscriptions: prev.subscriptions.map((x: any) => x.id === r.id ? { ...x, ...s } : x),
                      }))} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="size-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ExtendDialog({ subId, onExtended }: { subId: string; onExtended: (s: any) => void }) {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: { days: 30 } });

  async function onSubmit(v: any) {
    try {
      const res = await adminApi.extendSubscription(subId, v.days);
      onExtended(res);
      toast.success("Extended");
      setOpen(false);
      reset();
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Extend</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Extend Subscription</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <FieldLabel>Days to extend</FieldLabel>
            <Controller name="days" control={control} render={({ field }) => <Input type="number" min={1} {...field} />} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Extend</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PlansList() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    adminApi.getPlans().then((d) => setPlans(d?.plans ?? d ?? [])).finally(() => setLoading(false));
  }, []);

  async function deletePlan(id: string) {
    if (!confirm("Delete plan?")) return;
    await adminApi.deletePlan(id);
    setPlans(plans.filter(p => p.id !== id));
    toast.success("Deleted");
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="size-4" /> New Plan
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-100" />)
          : plans.map((p) => (
              <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-2xl font-bold text-primary-700 mt-1">${p.price}</p>
                    <p className="text-xs text-gray-400">{p.duration_days} days</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setEditPlan(p)}><Pencil className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => deletePlan(p.id)} className="text-red-500 hover:text-red-700"><Trash2 className="size-3.5" /></Button>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>Job Posts: <span className="font-medium">{p.job_posts_limit ?? "Unlimited"}</span></p>
                  <p>Profile Access: <span className="font-medium">{p.profile_access_limit ?? "Unlimited"}</span></p>
                </div>
                {p.description && <p className="mt-2 text-xs text-gray-400">{p.description}</p>}
              </div>
            ))}
      </div>

      <PlanFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={(plan) => { setPlans([...plans, plan]); setCreateOpen(false); }}
      />
      {editPlan && (
        <PlanFormDialog
          open={!!editPlan}
          onOpenChange={(o) => !o && setEditPlan(null)}
          defaultValues={editPlan}
          planId={editPlan.id}
          onSave={(updated) => { setPlans(plans.map(p => p.id === editPlan.id ? updated : p)); setEditPlan(null); }}
        />
      )}
    </div>
  );
}

function PlanFormDialog({ open, onOpenChange, defaultValues, planId, onSave }: any) {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: defaultValues ?? { name: "", price: 0, duration_days: 30, job_posts_limit: 5, profile_access_limit: 10, description: "" },
  });

  useEffect(() => { if (open) reset(defaultValues ?? { name: "", price: 0, duration_days: 30, job_posts_limit: 5, profile_access_limit: 10, description: "" }); }, [open]);

  async function onSubmit(values: any) {
    try {
      const res = planId
        ? await adminApi.updatePlan(planId, values)
        : await adminApi.createPlan(values);
      onSave(res?.plan ?? res);
      toast.success(planId ? "Plan updated" : "Plan created");
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{planId ? "Edit Plan" : "New Plan"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
            <FieldError errors={errors.name ? [errors.name] : []} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Price ($)</FieldLabel>
              <Controller name="price" control={control} render={({ field }) => <Input type="number" min={0} step={0.01} {...field} />} />
            </Field>
            <Field>
              <FieldLabel>Duration (days)</FieldLabel>
              <Controller name="duration_days" control={control} render={({ field }) => <Input type="number" min={1} {...field} />} />
            </Field>
            <Field>
              <FieldLabel>Job Posts Limit</FieldLabel>
              <Controller name="job_posts_limit" control={control} render={({ field }) => <Input type="number" min={0} {...field} />} />
            </Field>
            <Field>
              <FieldLabel>Profile Access Limit</FieldLabel>
              <Controller name="profile_access_limit" control={control} render={({ field }) => <Input type="number" min={0} {...field} />} />
            </Field>
          </div>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Controller name="description" control={control} render={({ field }) => <Input {...field} />} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{planId ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

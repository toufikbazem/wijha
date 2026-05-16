import { Skeleton } from "@/components/ui/skeleton";

export default function EmployerDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="relative">
        <Skeleton className="h-40 w-full rounded-2xl bg-gray-200" />
        <div className="flex items-end gap-4 mt-[-40px] px-6">
          <Skeleton className="h-32 w-32 rounded-xl bg-gray-200" />
          <div className="space-y-2 pb-2">
            <Skeleton className="h-7 w-56 bg-gray-200" />
            <Skeleton className="h-4 w-32 bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-5 w-40 bg-gray-200" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-11/12 bg-gray-200" />
            <Skeleton className="h-4 w-10/12 bg-gray-200" />
            <Skeleton className="h-4 w-9/12 bg-gray-200" />
          </div>
          <Skeleton className="h-5 w-32 mt-4 bg-gray-200" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 w-full bg-gray-200" />
            <Skeleton className="h-20 w-full bg-gray-200" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-32 bg-gray-200" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full bg-gray-200" />
            <Skeleton className="h-12 w-full bg-gray-200" />
            <Skeleton className="h-12 w-full bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Unlock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MyAccessCard from "./MyAccessCard";
import DashJobPostsPagination from "./DashJobPostsPagination";
import { useTranslation } from "react-i18next";

export default function MyAccessList({
  page,
  setPage,
}: {
  page: number;
  setPage: (page: number) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const limit = 9;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const { t } = useTranslation("employer");

  const fetchMyAccess = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/profile-access/my-access?page=${page}&limit=${limit}`,
        { method: "GET", credentials: "include" },
      );
      const data = await res.json();
      if (res.ok) {
        setProfiles(data.profiles || []);
        setTotal(data.total || 0);
      } else {
        console.error("Error fetching access list:", data.message);
        setProfiles([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching access list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAccess();
  }, [page]);

  return (
    <>
      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3 bg-gray-200" />
                  <Skeleton className="h-3 w-1/2 bg-gray-200" />
                </div>
              </div>
              <Skeleton className="h-3 w-3/4 bg-gray-200" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-20 bg-gray-200" />
                <Skeleton className="h-3 w-24 bg-gray-200" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
                <Skeleton className="h-6 w-14 rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && profiles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Unlock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("noUnlockedProfiles")}
          </h3>
          <p className="text-gray-500">
            {t("searchAndRequest")}
          </p>
        </div>
      )}

      {/* Cards grid + pagination */}
      {!loading && profiles.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {total} {t("unlockedProfiles")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <MyAccessCard key={profile.access_id} profile={profile} />
            ))}
          </div>
          <DashJobPostsPagination
            totalPages={totalPages}
            setPage={setPage}
            page={page}
          />
        </div>
      )}
    </>
  );
}

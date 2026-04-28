import { ArrowLeft, ArrowRight } from "lucide-react";

function getPageItems(total: number, page: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const isNearStart = page <= 3;
  const isNearEnd = page >= total - 2;

  if (isNearStart) {
    return [1, 2, 3, "...", total - 1, total];
  }

  if (isNearEnd) {
    return [1, 2, "...", total - 2, total - 1, total];
  }

  return [1, "...", page - 1, page, page + 1, "...", total];
}

function DashJobPostsPagination({
  totalPages = 10,
  setPage,
  page,
}: {
  totalPages: number;
  setPage: (page: number) => void;
  page: number;
}) {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPage(page);
  };

  const items = getPageItems(totalPages, page);
  return (
    <div className="flex justify-center items-center gap-3 p-4 w-full">
      <button
        type="button"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="min-w-[36px] h-9 px-2 rounded-lg border border-gray-200 bg-white text-gray-500
        hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {items.map((item, index) =>
        item === "..." ? (
          <span
            key={`dots-${index}`}
            className="min-w-[36px] h-9 flex items-center justify-center text-gray-400 text-sm tracking-widest select-none"
          >
            ···
          </span>
        ) : (
          <button
            key={`page-${item}`}
            type="button"
            onClick={() => handlePageChange(item as number)}
            className={`px-3 py-2 rounded-lg text-[12px] border transition
        ${
          item === page
            ? "bg-primary-500 text-white"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
        }`}
          >
            {String(item).padStart(2, "0")}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="min-w-[36px] h-9 px-2 rounded-lg border border-gray-200 bg-white text-gray-500
        hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default DashJobPostsPagination;

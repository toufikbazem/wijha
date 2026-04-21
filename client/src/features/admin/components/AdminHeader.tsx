import { Menu, Shield } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { user } = useSelector((state: any) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-3">
        {/* Left: Menu (mobile) */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1" />

        {/* Right: Admin info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-900">Admin</div>
            <div className="text-xs text-gray-500 truncate max-w-[160px]">
              {user?.email}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

export default function SettingsPage() {
  const { user } = useSelector((s: RootState) => s.auth);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>

      <div className="max-w-sm rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-gray-900">Logged in as</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Role</span>
            <span className="capitalize">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

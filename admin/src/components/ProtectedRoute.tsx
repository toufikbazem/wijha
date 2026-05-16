import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "@/app/store";

export default function ProtectedRoute() {
  const { user } = useSelector((s: RootState) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function PublicOnlyRoute() {
  const { user } = useSelector((state: any) => state.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

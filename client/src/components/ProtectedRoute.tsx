import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

interface Props {
  requiredRole?: string;
}

export default function ProtectedRoute({ requiredRole }: Props) {
  const { user } = useSelector((state: any) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

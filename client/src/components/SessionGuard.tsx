import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "@/features/auth/userSlice";

const API_URL = import.meta.env.VITE_API_URL;

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only validate if Redux thinks there's a logged-in user.
    // If there's no user in Redux we skip — no token to check.
    if (!user) {
      setChecked(true);
      return;
    }

    fetch(`${API_URL}/api/v1/auth/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          dispatch(logout());
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        // Network error — leave the user logged in rather than force-logging out.
      })
      .finally(() => {
        setChecked(true);
      });
  }, []); // run once on mount

  if (!checked) return null;

  return <>{children}</>;
}

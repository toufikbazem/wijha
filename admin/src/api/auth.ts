import { api } from "./client";

export const authApi = {
  login: (email: string, password: string, rememberMe?: boolean) =>
    api.post<any>("/admin/auth/login", { email, password, rememberMe }),
  logout: () => api.post<any>("/admin/auth/logout", {}),
  me: () => api.get<any>("/admin/auth/me"),
};

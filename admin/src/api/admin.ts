import { api } from "./client";

const qs = (params: Record<string, any>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get<any>("/admin/dashboard"),

  // Job Seekers
  getJobSeekers: (params?: Record<string, any>) =>
    api.get<any>(`/admin/job-seekers${qs(params ?? {})}`),
  getJobSeeker: (id: string) => api.get<any>(`/admin/job-seekers/${id}`),
  createJobSeeker: (data: any) => api.post<any>("/admin/job-seekers", data),
  updateJobSeeker: (id: string, data: any) => api.put<any>(`/admin/job-seekers/${id}`, data),
  changeJobSeekerStatus: (id: string, status: string) =>
    api.patch<any>(`/admin/job-seekers/${id}/status`, { status }),
  deleteJobSeeker: (id: string) => api.delete<any>(`/admin/job-seekers/${id}`),
  getJobSeekerApplications: (id: string, params?: Record<string, any>) =>
    api.get<any>(`/admin/job-seekers/${id}/applications${qs(params ?? {})}`),
  deleteJobSeekerApplication: (id: string, appId: string) =>
    api.delete<any>(`/admin/job-seekers/${id}/applications/${appId}`),
  getJobSeekerSavedJobs: (id: string, params?: Record<string, any>) =>
    api.get<any>(`/admin/job-seekers/${id}/saved${qs(params ?? {})}`),
  deleteJobSeekerSavedJob: (id: string, savedId: string) =>
    api.delete<any>(`/admin/job-seekers/${id}/saved/${savedId}`),

  // Employers
  getEmployers: (params?: Record<string, any>) =>
    api.get<any>(`/admin/employers${qs(params ?? {})}`),
  getEmployer: (id: string) => api.get<any>(`/admin/employers/${id}`),
  updateEmployer: (id: string, data: any) => api.put<any>(`/admin/employers/${id}`, data),
  changeEmployerStatus: (id: string, status: string) =>
    api.patch<any>(`/admin/employers/${id}/status`, { status }),
  deleteEmployer: (id: string) => api.delete<any>(`/admin/employers/${id}`),
  getEmployerProfileAccess: (id: string, params?: Record<string, any>) =>
    api.get<any>(`/admin/employers/${id}/profile-access${qs(params ?? {})}`),
  getEmployerSubscription: (id: string) =>
    api.get<any>(`/admin/employers/${id}/subscription`),

  // Users
  updateUserEmail: (id: string, email: string) =>
    api.put<any>(`/admin/users/${id}/email`, { email }),
  updateUserPassword: (id: string, password: string) =>
    api.put<any>(`/admin/users/${id}/password`, { password }),
  updateEmailVerification: (id: string, verified: boolean) =>
    api.patch<any>(`/admin/users/${id}/email-verification`, { is_email_verified: verified }),

  // Job Posts
  getJobPosts: (params?: Record<string, any>) =>
    api.get<any>(`/admin/job-posts${qs(params ?? {})}`),
  getJobPost: (id: string) => api.get<any>(`/admin/job-posts/${id}`),
  createJobPost: (data: any) => api.post<any>("/admin/job-posts", data),
  changeJobPostStatus: (id: string, status: string) =>
    api.patch<any>(`/admin/job-posts/${id}/status`, { status }),
  deleteJobPost: (id: string) => api.delete<any>(`/admin/job-posts/${id}`),

  // Applications
  getApplications: (params?: Record<string, any>) =>
    api.get<any>(`/admin/applications${qs(params ?? {})}`),

  // Plans
  getPlans: () => api.get<any>("/admin/plans"),
  createPlan: (data: any) => api.post<any>("/admin/plans", data),
  updatePlan: (id: string, data: any) => api.put<any>(`/admin/plans/${id}`, data),
  deletePlan: (id: string) => api.delete<any>(`/admin/plans/${id}`),

  // Subscriptions
  getSubscriptions: (params?: Record<string, any>) =>
    api.get<any>(`/admin/subscriptions${qs(params ?? {})}`),
  createSubscription: (data: any) => api.post<any>("/admin/subscriptions", data),
  changeSubscriptionStatus: (id: string, status: string) =>
    api.patch<any>(`/admin/subscriptions/${id}/status`, { status }),
  extendSubscription: (id: string, days: number) =>
    api.patch<any>(`/admin/subscriptions/${id}/extend`, { days }),
  assignCustomPlan: (id: string, data: any) =>
    api.patch<any>(`/admin/subscriptions/${id}/custom`, data),

  // Profile Access
  getProfileAccess: (params?: Record<string, any>) =>
    api.get<any>(`/admin/profile-access${qs(params ?? {})}`),
};

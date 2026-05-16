import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import JobSeekersPage from "@/pages/JobSeekersPage";
import JobSeekerDetailsPage from "@/pages/JobSeekerDetailsPage";
import EmployersPage from "@/pages/EmployersPage";
import EmployerDetailsPage from "@/pages/EmployerDetailsPage";
import JobPostsPage from "@/pages/JobPostsPage";
import JobPostDetailsPage from "@/pages/JobPostDetailsPage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import SubscriptionsPage from "@/pages/SubscriptionsPage";
import ProfileAccessPage from "@/pages/ProfileAccessPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/job-seekers" element={<JobSeekersPage />} />
            <Route path="/job-seekers/:id" element={<JobSeekerDetailsPage />} />
            <Route path="/employers" element={<EmployersPage />} />
            <Route path="/employers/:id" element={<EmployerDetailsPage />} />
            <Route path="/job-posts" element={<JobPostsPage />} />
            <Route path="/job-posts/:id" element={<JobPostDetailsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/profile-access" element={<ProfileAccessPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

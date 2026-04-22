import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Register from "./features/auth/pages/Register";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import Login from "./features/auth/pages/Login";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Home from "./features/public/pages/Home";
import JobPostsSearch from "./features/job-posts/pages/JobPostsSearch";
import JobPosts from "./features/job-posts/pages/JobPosts";
import CompanyProfile from "./features/employers/pages/CompanyProfile";
import JobseekerDashboard from "@/features/jobseekers/pages/Dashboard";
import EmployerDashboard from "@/features/employers/pages/Dashboard";
import Admin from "./features/admin/pages/Admin";
import AboutUs from "./features/public/pages/AboutUs";
import ContactUs from "./features/public/pages/ContactUs";

import SessionGuard from "./components/SessionGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

function App() {
  const { user } = useSelector((state: any) => state.user);
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <SessionGuard>
        <Routes>
          {/* Public-only: redirect to /dashboard if already logged in */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Fully public */}
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/jobSearch" element={<JobPostsSearch />} />
          <Route path="/jobPost/:id" element={<JobPosts />} />
          <Route path="/companyProfile/:id" element={<CompanyProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contacts" element={<ContactUs />} />

          {/* Protected: any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                user?.role === "employer" ? (
                  <EmployerDashboard />
                ) : (
                  <JobseekerDashboard />
                )
              }
            />
          </Route>

          {/* Protected: admin only */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </SessionGuard>
    </BrowserRouter>
  );
}

export default App;

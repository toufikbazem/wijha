import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  getDashboardStats,
  getJobSeekers,
  exportJobSeekers,
  getJobSeekerDetails,
  createJobSeekerProfile,
  updateJobSeeker,
  changeJobSeekerStatus,
  deleteJobSeeker,
  getJobSeekerApplications,
  deleteJobSeekerApplication,
  getJobSeekerSavedJobs,
  deleteJobSeekerSavedJob,
  getEmployers,
  getEmployerDetails,
  updateEmployer,
  changeEmployerStatus,
  deleteEmployer,
  getEmployerProfileAccess,
  getEmployerSubscription,
  getJobPosts,
  getJobPostDetails,
  changeJobPostStatus,
  deleteJobPost,
  createAdminJobPost,
  updateJobPostByAdmin,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getSubscriptions,
  createSubscription,
  changeSubscriptionStatus,
  extendSubscription,
  assignCustomPlan,
  getProfileAccessRecords,
  deleteProfileAccessRecord,
  updateUserEmail,
  updateUserPassword,
  updateEmailVerification,
  getApplications,
  deleteApplication,
} from "./admin.controller.js";

const router = express.Router();

// All routes require admin role
router.use(requireAuth(["admin"]));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Job Seekers
router.get("/job-seekers", getJobSeekers);
router.get("/job-seekers/export", exportJobSeekers); // must precede /:id
router.post("/job-seekers", createJobSeekerProfile);
router.get("/job-seekers/:id", getJobSeekerDetails);
router.put("/job-seekers/:id", updateJobSeeker);
router.patch("/job-seekers/:id/status", changeJobSeekerStatus);
router.delete("/job-seekers/:id", deleteJobSeeker);
router.get("/job-seekers/:id/applications", getJobSeekerApplications);
router.delete(
  "/job-seekers/:id/applications/:applicationId",
  deleteJobSeekerApplication,
);
router.get("/job-seekers/:id/saved", getJobSeekerSavedJobs);
router.delete("/job-seekers/:id/saved/:savedId", deleteJobSeekerSavedJob);

// Employers
router.get("/employers", getEmployers);
router.get("/employers/:id", getEmployerDetails);
router.put("/employers/:id", updateEmployer);
router.patch("/employers/:id/status", changeEmployerStatus);
router.delete("/employers/:id", deleteEmployer);
router.get("/employers/:id/profile-access", getEmployerProfileAccess);
router.get("/employers/:id/subscription", getEmployerSubscription);

// Users (account management)
router.put("/users/:id/email", updateUserEmail);
router.put("/users/:id/password", updateUserPassword);
router.patch("/users/:id/email-verification", updateEmailVerification);

// Job Posts
router.get("/job-posts", getJobPosts);
router.post("/job-posts", createAdminJobPost);
router.get("/job-posts/:id", getJobPostDetails);
router.put("/job-posts/:id", updateJobPostByAdmin);
router.patch("/job-posts/:id/status", changeJobPostStatus);
router.delete("/job-posts/:id", deleteJobPost);

// Applications (global)
router.get("/applications", getApplications);
router.delete("/applications/:applicationId", deleteApplication);

// Subscription Plans
router.get("/plans", getPlans);
router.post("/plans", createPlan);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);

// Employer Subscriptions
router.get("/subscriptions", getSubscriptions);
router.post("/subscriptions", createSubscription);
router.patch("/subscriptions/:id/status", changeSubscriptionStatus);
router.patch("/subscriptions/:id/extend", extendSubscription);
router.patch("/subscriptions/:id/custom", assignCustomPlan);

// Profile Access Monitoring
router.get("/profile-access", getProfileAccessRecords);
router.delete("/profile-access/:id", deleteProfileAccessRecord);

export default router;

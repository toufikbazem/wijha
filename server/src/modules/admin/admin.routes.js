import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  getDashboardStats,
  getJobSeekers,
  getJobSeekerDetails,
  createJobSeekerProfile,
  changeJobSeekerStatus,
  deleteJobSeeker,
  getEmployers,
  getEmployerDetails,
  changeEmployerStatus,
  deleteEmployer,
  getJobPosts,
  getJobPostDetails,
  changeJobPostStatus,
  createAdminJobPost,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getSubscriptions,
  changeSubscriptionStatus,
  extendSubscription,
  assignCustomPlan,
  getProfileAccessRecords,
} from "./admin.controller.js";

const router = express.Router();

// All routes require admin role
router.use(requireAuth(["admin"]));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Job Seekers
router.get("/job-seekers", getJobSeekers);
router.post("/job-seekers", createJobSeekerProfile);
router.get("/job-seekers/:id", getJobSeekerDetails);
router.patch("/job-seekers/:id/status", changeJobSeekerStatus);
router.delete("/job-seekers/:id", deleteJobSeeker);

// Employers
router.get("/employers", getEmployers);
router.get("/employers/:id", getEmployerDetails);
router.patch("/employers/:id/status", changeEmployerStatus);
router.delete("/employers/:id", deleteEmployer);

// Job Posts
router.get("/job-posts", getJobPosts);
router.post("/job-posts", createAdminJobPost);
router.get("/job-posts/:id", getJobPostDetails);
router.patch("/job-posts/:id/status", changeJobPostStatus);

// Subscription Plans
router.get("/plans", getPlans);
router.post("/plans", createPlan);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);

// Employer Subscriptions
router.get("/subscriptions", getSubscriptions);
router.patch("/subscriptions/:id/status", changeSubscriptionStatus);
router.patch("/subscriptions/:id/extend", extendSubscription);
router.patch("/subscriptions/:id/custom", assignCustomPlan);

// Profile Access Monitoring
router.get("/profile-access", getProfileAccessRecords);

export default router;

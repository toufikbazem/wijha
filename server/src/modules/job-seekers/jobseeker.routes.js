import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  getJobSeekerProfile,
  updateJobSeekerProfile,
  getJobSeekerProfiles,
  getDashboardStats,
} from "./jobseeker.controller.js";

const router = express.Router();

router.get("/dashboard-stats", requireAuth(["jobseeker"]), getDashboardStats);

router.get(
  "/:id",
  requireAuth(["jobseeker", "admin", "employer"]),
  getJobSeekerProfile,
);

router.put("/:id", requireAuth(["jobseeker", "admin"]), updateJobSeekerProfile);

router.get("/", requireAuth(["employer", "admin"]), getJobSeekerProfiles);

export default router;

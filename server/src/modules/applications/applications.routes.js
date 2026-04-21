import express from "express";
import {
  createApplication,
  getApplication,
  getApplications,
  getApplicantsByJob,
  deleteApplication,
} from "./applications.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth(["jobseeker"]), createApplication);
router.delete("/:id", requireAuth(["jobseeker", "admin"]), deleteApplication);
router.get(
  "/by-job/:jobPostId",
  requireAuth(["employer", "admin"]),
  getApplicantsByJob,
);
router.get("/:id", requireAuth(["jobseeker"]), getApplication);
router.get(
  "/",
  requireAuth(["jobseeker", "admin", "employer"]),
  getApplications,
);

export default router;

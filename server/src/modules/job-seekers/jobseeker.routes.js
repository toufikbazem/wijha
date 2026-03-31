import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {} from "./users.controller.js";

const router = express.Router();

router.get(
  "/:id",
  requireAuth(["jobseeker", "admin"]),
  getJobSeekerProfile,
);

router.put(
  "/:id",
  requireAuth(["jobseeker",  "admin"]),
  updateJobSeekerProfile,
);

router.get(
  "/",
  requireAuth(["employer",  "admin"]),
  getJobSeekerProfiles,
);

export default router;

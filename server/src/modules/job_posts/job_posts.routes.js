import express from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.middleware.js";
import { requireSubscription } from "../../middleware/subscription.middleware.js";
import {
  createJobPost,
  updateJobPost,
  updateJobPostStatus,
  getJobPost,
  getJobPosts,
} from "./job_posts.controller.js";

const router = express.Router();

router.post("/", requireAuth(["employer", "admin"]), requireSubscription("job_post"), createJobPost);
router.get("/", optionalAuth(), getJobPosts);

router.put("/:id", requireAuth(["employer", "admin"]), updateJobPost);
router.patch("/:id/status", requireAuth(["employer", "admin"]), updateJobPostStatus);

router.get("/:id", optionalAuth(), getJobPost);

export default router;

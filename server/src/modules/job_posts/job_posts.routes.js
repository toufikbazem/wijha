import express from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.middleware.js";
import {
  createJobPost,
  updateJobPost,
  getJobPost,
  getJobPosts,
} from "./job_posts.controller.js";

const router = express.Router();

router.post("/", requireAuth(["employer", "admin"]), createJobPost);

router.put("/:id", requireAuth(["employer", "admin"]), updateJobPost);

router.get("/:id", getJobPost);

router.get("/", getJobPosts);

export default router;

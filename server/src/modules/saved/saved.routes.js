import express from "express";
import {
  createSavedJob,
  getSavedJob,
  getSavedJobs,
  deleteSavedJob,
} from "./saved.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth(["jobseeker"]), createSavedJob);
router.delete("/", requireAuth(["jobseeker"]), deleteSavedJob);
router.get("/:id", requireAuth(["jobseeker"]), getSavedJob);
router.get("/", requireAuth(["jobseeker"]), getSavedJobs);

export default router;

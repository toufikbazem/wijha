import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "./experiences.controllers.js";

const router = express.Router();

router.post("/", requireAuth(["jobseeker", "admin"]), createExperience);

router.put("/:id", requireAuth(["jobseeker", "admin"]), updateExperience);

router.delete("/:id", requireAuth(["employer", "admin"]), deleteExperience);

export default router;

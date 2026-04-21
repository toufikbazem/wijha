import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createEducation,
  updateEducation,
  deleteEducation,
} from "./educations.controllers.js";

const router = express.Router();

router.post("/", requireAuth(["jobseeker", "admin"]), createEducation);

router.put("/:id", requireAuth(["jobseeker", "admin"]), updateEducation);

router.delete("/:id", requireAuth(["jobseeker", "admin"]), deleteEducation);

export default router;

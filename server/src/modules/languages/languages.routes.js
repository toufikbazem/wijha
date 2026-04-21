import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createLanguage,
  updateLanguage,
  deleteLanguage,
} from "./languages.controller.js";

const router = express.Router();

router.post("/", requireAuth(["jobseeker", "admin"]), createLanguage);

router.put("/:id", requireAuth(["jobseeker", "admin"]), updateLanguage);

router.delete("/:id", requireAuth(["jobseeker", "admin"]), deleteLanguage);

export default router;

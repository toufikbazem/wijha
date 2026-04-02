import express from "express";
import {
  createApplication,
  getApplication,
  getApplications,
  deleteApplication,
} from "./applications.controller.js";
import { requiredAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requiredAuth(["jobseeker"]), createApplication);
router.delete("/:id", requiredAuth(["jobseeker", "admin"]), deleteApplication);
router.get("/:id", requiredAuth(["jobseeker"]), getApplication);
router.get(
  "/",
  requiredAuth(["jobseeker", "admin", "employer"]),
  getApplications,
);

export default router;

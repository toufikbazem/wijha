import express from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.middleware.js";
import {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployersProfiles,
  getDashboardStats,
} from "./employers.controller.js";

const router = express.Router();

router.get("/dashboard-stats", requireAuth(["employer"]), getDashboardStats);

router.get("/:id", optionalAuth(), getEmployerProfile);

router.put("/:id", requireAuth(["employer", "admin"]), updateEmployerProfile);

router.get("/", requireAuth(["admin"]), getEmployersProfiles);

export default router;

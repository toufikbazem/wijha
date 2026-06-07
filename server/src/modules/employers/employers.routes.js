import express from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.middleware.js";
import {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployersProfiles,
  getDashboardStats,
  getPublicCompanies,
} from "./employers.controller.js";

const router = express.Router();

router.get("/dashboard-stats", requireAuth(["employer"]), getDashboardStats);

// Public listing of companies (search + pagination) — must come before "/:id"
router.get("/public/companies", getPublicCompanies);

router.get("/:id", optionalAuth(), getEmployerProfile);

router.put("/:id", requireAuth(["employer", "admin"]), updateEmployerProfile);

router.get("/", requireAuth(["admin"]), getEmployersProfiles);

export default router;

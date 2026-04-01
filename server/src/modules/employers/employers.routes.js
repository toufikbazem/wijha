import express from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.middleware.js";
import {} from "./employers.controller.js";

const router = express.Router();

router.get("/:id", optionalAuth(), getEmployerProfile);

router.put("/:id", requireAuth(["employer", "admin"]), updateEmployerProfile);

router.get("/", requireAuth(["admin"]), getEmployersProfiles);

export default router;

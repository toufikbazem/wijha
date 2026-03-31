import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { changeEmail, changePassword } from "./users.controller.js";

const router = express.Router();

router.put(
  "/change-password",
  requireAuth(["jobseeker", "employer", "admin"]),
  changePassword,
);
router.put(
  "/change-email",
  requireAuth(["jobseeker", "employer", "admin"]),
  changeEmail,
);

export default router;

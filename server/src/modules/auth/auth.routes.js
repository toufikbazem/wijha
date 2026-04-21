import express from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  me,
} from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);
router.post("/send-verification-email", sendVerificationEmail);
router.get("/me", requireAuth(), me);

export default router;

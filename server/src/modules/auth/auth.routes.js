import express from "express";
import {
  changeEmail,
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "./auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);
router.put("/change-email", changeEmail);

export default router;

import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { adminLogin, adminLogout, adminMe } from "./admin.auth.controller.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/me", requireAuth(["admin"]), adminMe);

export default router;

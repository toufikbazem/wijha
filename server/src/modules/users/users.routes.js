import express from "express";
import { changeEmail, changePassword } from "./users.controller.js";

const router = express.Router();

router.put("/change-password", changePassword);
router.put("/change-email", changeEmail);

export default router;

import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireSubscription } from "../../middleware/subscription.middleware.js";
import {
  searchProfiles,
  getMyAccess,
  checkAccess,
  requestAccess,
} from "./profile-access.controller.js";

const router = express.Router();

router.get("/search", requireAuth(["employer"]), searchProfiles);

router.get("/my-access", requireAuth(["employer"]), getMyAccess);

router.get("/check/:jobSeekerId", requireAuth(["employer"]), checkAccess);

router.post("/request/:jobSeekerId", requireAuth(["employer"]), requireSubscription("profile_access"), requestAccess);

export default router;

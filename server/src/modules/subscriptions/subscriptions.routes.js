import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  getPlans,
  getMySubscription,
  subscribe,
  getInvoices,
} from "./subscriptions.controller.js";

const router = express.Router();

router.get("/plans", getPlans);

router.get("/my-subscription", requireAuth(["employer"]), getMySubscription);

router.post("/subscribe", requireAuth(["employer"]), subscribe);

router.get("/invoices", requireAuth(["employer"]), getInvoices);

export default router;

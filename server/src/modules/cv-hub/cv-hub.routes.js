import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createHub,
  getHub,
  getHubs,
  updateHub,
  deleteHub,
  getSubmissions,
  deleteSubmission,
  getPublicHub,
  submitToHub,
} from "./cv-hub.controller.js";

const router = express.Router();

/* ---- Public (jobseeker via QR / link) — NO auth ---- */
// Declared before the authenticated "/:id" routes so the literal "public"
// prefix is not captured as an :id param.
router.get("/public/:slug", getPublicHub);
router.post("/public/:slug/submit", submitToHub); // checked

/* ---- Submissions (authenticated, employer-facing) ---- */
router.get(
  "/:id/submissions",
  requireAuth(["employer", "admin"]),
  getSubmissions,
); // checked
router.delete(
  "/submissions/:submissionId",
  requireAuth(["employer", "admin"]),
  deleteSubmission,
);

/* ---- Hubs (authenticated, employer-facing) ---- */
router.post("/", requireAuth(["employer", "admin"]), createHub); //checked
router.get("/", requireAuth(["employer", "admin"]), getHubs); // checked
router.get("/:id", requireAuth(["employer", "admin"]), getHub);
router.put("/:id", requireAuth(["employer", "admin"]), updateHub); // checked
router.delete("/:id", requireAuth(["employer", "admin"]), deleteHub); //checked

export default router;

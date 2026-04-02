import express from "express";
import {
  createSavedJob,
  getSavedJob,
  getSavedJobs,
  deleteSavedJob,
} from "./saved.controller.js";
import { requiredAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requiredAuth(["jobseeker"]), createSavedJob);
router.delete("/:id", requiredAuth(["jobseeker"]), deleteSavedJob);
router.get("/:id", requiredAuth(["jobseeker"]), getSavedJob);
router.get(
  "/",
  requiredAuth(["jobseeker"]),
  getSavedJobs,
);

export default router;

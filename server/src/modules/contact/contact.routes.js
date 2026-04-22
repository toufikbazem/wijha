import express from "express";
import { submitContact } from "./contact.controller.js";

const router = express.Router();

router.post("/", submitContact);

export default router;

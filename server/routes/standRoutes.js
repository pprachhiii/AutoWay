import express from "express";
import { getStands, createStand } from "../controllers/standController.js";
const router = express.Router();

router.get("/", getStands);
router.post("/", createStand);

export default router;

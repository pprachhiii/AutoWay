import express from "express";
import { planTrip } from "../controllers/tripController.js";

const router = express.Router();

router.get("/plan", planTrip);

export default router;

import express from "express";
import { swipe, getMatches } from "../controllers/matchController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/swipe", authMiddleware, swipe);
router.get("/matches", authMiddleware, getMatches);

export default router;

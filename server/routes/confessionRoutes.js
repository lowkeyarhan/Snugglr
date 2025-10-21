import express from "express";
import {
  createConfession,
  getConfessions,
  likeConfession,
  commentOnConfession,
  deleteConfession,
} from "../controllers/confessionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createConfession);
router.get("/", authMiddleware, getConfessions);
router.post("/:confessionId/like", authMiddleware, likeConfession);
router.post("/:confessionId/comment", authMiddleware, commentOnConfession);
router.delete("/:confessionId", authMiddleware, deleteConfession);

export default router;

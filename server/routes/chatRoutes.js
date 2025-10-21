import express from "express";
import {
  getChats,
  getMessages,
  sendMessage,
  submitGuess,
  getRevealStatus,
} from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getChats);
router.get("/:chatId/messages", authMiddleware, getMessages);
router.post("/:chatId/message", authMiddleware, sendMessage);
router.post("/guess", authMiddleware, submitGuess);
router.get("/:chatId/reveal-status", authMiddleware, getRevealStatus);

export default router;

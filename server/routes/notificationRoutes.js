import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.patch("/:notificationId/read", authMiddleware, markAsRead);
router.patch("/read-all", authMiddleware, markAllAsRead);
router.delete("/:notificationId", authMiddleware, deleteNotification);
router.delete("/clear-read", authMiddleware, clearReadNotifications);

export default router;

import Notification from "../models/Notification.js";

/**
 * Socket handler for real-time notifications
 * @param {Socket.IO Server} io - The socket.io server instance
 */
const notificationSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Notification socket connected: ${socket.id}`);

    /**
     * Event: join_notifications
     * User joins their personal notification room
     * Data: { userId }
     */
    socket.on("join_notifications", (userId) => {
      if (!userId) {
        socket.emit("error", { message: "User ID is required" });
        return;
      }

      // Join a room specific to this user for notifications
      const notificationRoom = `notifications_${userId}`;
      socket.join(notificationRoom);
      console.log(`📬 User ${userId} joined notification room`);

      // Send confirmation
      socket.emit("notification_room_joined", {
        message: "Successfully joined notification room",
        userId,
      });
    });

    /**
     * Event: leave_notifications
     * User leaves their notification room
     * Data: { userId }
     */
    socket.on("leave_notifications", (userId) => {
      if (!userId) {
        socket.emit("error", { message: "User ID is required" });
        return;
      }

      const notificationRoom = `notifications_${userId}`;
      socket.leave(notificationRoom);
      console.log(`📭 User ${userId} left notification room`);
    });

    /**
     * Event: mark_notification_read
     * Mark a notification as read via socket
     * Data: { notificationId, userId }
     */
    socket.on("mark_notification_read", async (data) => {
      try {
        const { notificationId, userId } = data;

        if (!notificationId || !userId) {
          socket.emit("error", {
            message: "Notification ID and User ID are required",
          });
          return;
        }

        const notification = await Notification.findOne({
          _id: notificationId,
          recipient: userId,
        });

        if (!notification) {
          socket.emit("error", { message: "Notification not found" });
          return;
        }

        notification.read = true;
        await notification.save();

        // Emit confirmation to the user
        socket.emit("notification_marked_read", {
          notificationId,
          success: true,
        });

        console.log(`Notification marked as read: ${notificationId}`);
      } catch (error) {
        console.error(`Error marking notification as read: ${error.message}`);
        socket.emit("error", {
          message: "Failed to mark notification as read",
        });
      }
    });

    /**
     * Event: disconnect
     * User disconnects from notification socket
     */
    socket.on("disconnect", () => {
      console.log(`📢 Notification socket disconnected: ${socket.id}`);
    });
  });
};

/**
 * Helper function to emit a notification to a specific user
 * This function can be called from controllers to send real-time notifications
 * @param {Socket.IO Server} io - The socket.io server instance
 * @param {String} userId - The recipient user ID
 * @param {Object} notification - The notification object
 */
export const emitNotification = (io, userId, notification) => {
  if (!io || !userId || !notification) {
    console.error("Invalid parameters for emitNotification");
    return;
  }

  const notificationRoom = `notifications_${userId}`;
  io.to(notificationRoom).emit("new_notification", notification);
  console.log(`Notification sent to user: ${userId}`);
};

export default notificationSocket;

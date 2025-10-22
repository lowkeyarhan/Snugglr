import { createNotification } from "../controllers/notificationController.js";
import { emitNotification } from "../sockets/notificationSocket.js";

/**
 * Create a notification and emit it via socket
 * This is a helper function to be used by controllers
 * @param {Object} notificationData - The notification data
 * @param {Object} io - The socket.io instance (optional)
 */
export const createAndEmitNotification = async (
  notificationData,
  io = null
) => {
  try {
    const notification = await createNotification(notificationData);
    if (io && notification && notification.recipient) {
      emitNotification(io, notification.recipient.toString(), notification);
    }

    return notification;
  } catch (error) {
    console.error(`Error in createAndEmitNotification: ${error.message}`);
    throw error;
  }
};

export default createAndEmitNotification;

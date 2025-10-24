import Notification from "../models/notification.js";

export const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    console.error(`Error creating notification: ${error.message}`);
    throw error;
  }
};

export const getNotifications = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const filter = { recipient: currentUserId };
    if (unreadOnly === "true") {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .populate("sender", "name username image")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      recipient: currentUserId,
      read: false,
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        unreadCount,
      },
    });
  } catch (error) {
    console.error(`Get Notifications Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const unreadCount = await Notification.countDocuments({
      recipient: currentUserId,
      read: false,
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.error(`Get Unread Count Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const currentUserId = req.user._id;

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: currentUserId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: {
        notification,
      },
    });
  } catch (error) {
    console.error(`Mark as Read Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error marking notification as read",
      error: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const result = await Notification.updateMany(
      { recipient: currentUserId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error(`Mark All as Read Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error marking all notifications as read",
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const currentUserId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: currentUserId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(`Delete Notification Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

export const clearReadNotifications = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const result = await Notification.deleteMany({
      recipient: currentUserId,
      read: true,
    });

    res.status(200).json({
      success: true,
      message: "All read notifications cleared",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error(`Clear Read Notifications Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error clearing read notifications",
      error: error.message,
    });
  }
};

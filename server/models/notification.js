import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Some notifications might not have a sender (system notifications)
    },
    type: {
      type: String,
      enum: [
        "new_message",
        "new_match",
        "confession_like",
        "confession_comment",
        "identity_revealed",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Reference to related entities
    relatedChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    relatedMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
    relatedConfession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Confession",
    },
    relatedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    // Action URL for navigation
    actionUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ read: 1, createdAt: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

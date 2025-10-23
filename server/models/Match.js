import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user1Username: {
      type: String,
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2Username: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "matched"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ user1: 1, user2: 1 });
matchSchema.index({ status: 1 });

const Match = mongoose.model("Match", matchSchema);

export default Match;

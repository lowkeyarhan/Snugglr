import Match from "../models/Match.js";
import Chat from "../models/chat.js";
import { createAndEmitNotification } from "../utils/notificationHelper.js";

export const swipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user._id;

    // Validate input
    if (!targetUserId || !action) {
      return res.status(400).json({
        success: false,
        message: "Please provide targetUserId and action (like/pass)",
      });
    }

    // Can't swipe on yourself
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot swipe on yourself",
      });
    }

    // Only process "like" actions (ignore "pass")
    if (action !== "like") {
      return res.status(200).json({
        success: true,
        message: "Pass recorded",
        data: {
          matched: false,
        },
      });
    }

    // Check if target user already liked current user
    const existingMatch = await Match.findOne({
      user1: targetUserId,
      user2: currentUserId,
    });

    if (existingMatch) {
      // It's a mutual match! Update status to "matched"
      existingMatch.status = "matched";
      await existingMatch.save();

      // Create a chat room for these two users
      const chat = await Chat.create({
        users: [currentUserId, targetUserId],
        revealed: false,
      });

      // Create match notifications for both users
      try {
        const io = req.app.get("io");
        await createAndEmitNotification(
          {
            recipient: currentUserId,
            sender: targetUserId,
            type: "new_match",
            title: "It's a Match! 🎉",
            message: "You have a new match! Start chatting now.",
            relatedMatch: existingMatch._id,
            relatedChat: chat._id,
            actionUrl: `/chat/${chat._id}`,
          },
          io
        );

        await createAndEmitNotification(
          {
            recipient: targetUserId,
            sender: currentUserId,
            type: "new_match",
            title: "It's a Match! 🎉",
            message: "You have a new match! Start chatting now.",
            relatedMatch: existingMatch._id,
            relatedChat: chat._id,
            actionUrl: `/chat/${chat._id}`,
          },
          io
        );
      } catch (notifError) {
        console.error(
          `❌ Error creating match notifications: ${notifError.message}`
        );
        // Don't fail the request if notification creation fails
      }

      return res.status(200).json({
        success: true,
        message: "It's a match! 🎉",
        data: {
          matched: true,
          matchId: existingMatch._id,
          chatId: chat._id,
        },
      });
    }

    // No existing match, create a new pending match
    const newMatch = await Match.create({
      user1: currentUserId,
      user2: targetUserId,
      status: "pending",
    });

    res.status(200).json({
      success: true,
      message: "Like recorded",
      data: {
        matched: false,
        matchId: newMatch._id,
      },
    });
  } catch (error) {
    console.error(`❌ Swipe Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error processing swipe",
      error: error.message,
    });
  }
};

/**
 * Get all mutual matches for current user
 * GET /api/match/matches
 * Protected route
 */
export const getMatches = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all matches where current user is involved and status is "matched"
    const matches = await Match.find({
      $or: [{ user1: currentUserId }, { user2: currentUserId }],
      status: "matched",
    })
      .populate("user1", "-password -guesses") // Populate user1 details
      .populate("user2", "-password -guesses") // Populate user2 details
      .sort({ updatedAt: -1 }); // Sort by most recent

    // Format response to show the other user in each match
    const formattedMatches = matches.map((match) => {
      const otherUser =
        match.user1._id.toString() === currentUserId.toString()
          ? match.user2
          : match.user1;

      return {
        matchId: match._id,
        user: otherUser,
        matchedAt: match.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        matches: formattedMatches,
      },
    });
  } catch (error) {
    console.error(`❌ Get Matches Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching matches",
      error: error.message,
    });
  }
};

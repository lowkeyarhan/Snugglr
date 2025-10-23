import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { createAndEmitNotification } from "../utils/notificationHelper.js";

export const getChats = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const chats = await Chat.find({
      users: currentUserId,
    })
      .populate("users", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        chats,
      },
    });
  } catch (error) {
    console.error(`Get Chats Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching chats",
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const currentUserId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const isParticipant = chat.users.some(
      (userId) => userId.toString() === currentUserId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this chat",
      });
    }

    const messages = await Message.find({ chatId })
      .populate("sender", "name username image")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        messages,
        revealed: chat.revealed,
      },
    });
  } catch (error) {
    console.error(`Get Messages Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const currentUserId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const isParticipant = chat.users.some(
      (userId) => userId.toString() === currentUserId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this chat",
      });
    }

    const message = await Message.create({
      chatId,
      sender: currentUserId,
      text: text.trim(),
    });

    await message.populate("sender", "name username image");

    // Create notification for the other user in the chat
    const recipient = chat.users.find(
      (userId) => userId.toString() !== currentUserId.toString()
    );

    if (recipient) {
      try {
        const io = req.app.get("io");
        await createAndEmitNotification(
          {
            recipient: recipient,
            sender: currentUserId,
            type: "new_message",
            title: "New Message",
            message: chat.revealed
              ? `${message.sender.name} sent you a message`
              : `${message.sender.username} sent you a message`,
            relatedChat: chatId,
            relatedMessage: message._id,
            actionUrl: `/chat/${chatId}`,
          },
          io
        );
      } catch (notifError) {
        console.error(
          `❌ Error creating message notification: ${notifError.message}`
        );
        // Don't fail the request if notification creation fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: {
        message,
      },
    });
  } catch (error) {
    console.error(`Send Message Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

export const submitGuess = async (req, res) => {
  try {
    const { chatId, guess } = req.body;
    const currentUserId = req.user._id;

    if (!chatId || !guess) {
      return res.status(400).json({
        success: false,
        message: "Please provide chatId and guess",
      });
    }

    // Verify chat exists
    const chat = await Chat.findById(chatId).populate("users");
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Check if chat is already revealed
    if (chat.revealed) {
      return res.status(400).json({
        success: false,
        message: "Identities already revealed in this chat",
      });
    }

    // Save guess to user's guesses array
    const user = await User.findById(currentUserId);

    // Check if user already guessed for this chat
    const existingGuessIndex = user.guesses.findIndex(
      (g) => g.chatId.toString() === chatId
    );

    if (existingGuessIndex !== -1) {
      // Update existing guess
      user.guesses[existingGuessIndex].guess = guess;
    } else {
      // Add new guess
      user.guesses.push({ chatId, guess });
    }

    await user.save();

    // Check if both users have submitted guesses
    const otherUser = chat.users.find(
      (u) => u._id.toString() !== currentUserId.toString()
    );

    const currentUserGuess = user.guesses.find(
      (g) => g.chatId.toString() === chatId
    );

    const otherUserGuess = otherUser.guesses.find(
      (g) => g.chatId.toString() === chatId
    );

    // If both users have guessed, check if they're correct
    if (currentUserGuess && otherUserGuess) {
      const currentUserCorrect =
        otherUserGuess.guess.toLowerCase().trim() ===
        user.name.toLowerCase().trim();
      const otherUserCorrect =
        currentUserGuess.guess.toLowerCase().trim() ===
        otherUser.name.toLowerCase().trim();

      // Both guesses must be correct to reveal
      if (currentUserCorrect && otherUserCorrect) {
        chat.revealed = true;
        await chat.save();

        // Create identity revealed notifications for both users
        try {
          const io = req.app.get("io");
          await createAndEmitNotification(
            {
              recipient: currentUserId,
              sender: otherUser._id,
              type: "identity_revealed",
              title: "Identities Revealed! 🎉",
              message: `You and ${otherUser.name} guessed correctly!`,
              relatedChat: chatId,
              actionUrl: `/chat/${chatId}`,
            },
            io
          );

          await createAndEmitNotification(
            {
              recipient: otherUser._id,
              sender: currentUserId,
              type: "identity_revealed",
              title: "Identities Revealed! 🎉",
              message: `You and ${user.name} guessed correctly!`,
              relatedChat: chatId,
              actionUrl: `/chat/${chatId}`,
            },
            io
          );
        } catch (notifError) {
          console.error(
            `Error creating reveal notifications: ${notifError.message}`
          );
        }

        return res.status(200).json({
          success: true,
          message: "Both guesses correct! Identities revealed! 🎉",
          data: {
            guessSubmitted: true,
            bothGuessed: true,
            revealed: true,
            chat,
          },
        });
      } else {
        // At least one guess is wrong
        return res.status(200).json({
          success: true,
          message: "Both guessed, but at least one guess is incorrect",
          data: {
            guessSubmitted: true,
            bothGuessed: true,
            revealed: false,
          },
        });
      }
    }

    // Only current user has guessed so far
    res.status(200).json({
      success: true,
      message: "Guess submitted successfully",
      data: {
        guessSubmitted: true,
        bothGuessed: false,
        revealed: false,
      },
    });
  } catch (error) {
    console.error(`Submit Guess Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error submitting guess",
      error: error.message,
    });
  }
};

/**
 * Get reveal status of a chat
 * GET /api/chat/:chatId/reveal-status
 * Protected route
 */
export const getRevealStatus = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId).populate("users", "name image");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        revealed: chat.revealed,
        users: chat.revealed ? chat.users : null, // Only send user data if revealed
      },
    });
  } catch (error) {
    console.error(`Get Reveal Status Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error getting reveal status",
      error: error.message,
    });
  }
};

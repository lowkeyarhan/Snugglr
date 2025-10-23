import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { createNotification } from "../controllers/notificationController.js";
import { emitNotification } from "./notificationSocket.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_chat", (chatId) => {
      socket.join(chatId); // Join the room
      console.log(`📩 User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId); // Leave the room
      console.log(`📤 User ${socket.id} left chat ${chatId}`);
    });

    socket.on("new_message", async (data) => {
      try {
        const { chatId, text, senderId } = data;

        // Validate input
        if (!chatId || !text || !senderId) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        // Save message to database
        const message = await Message.create({
          chatId,
          sender: senderId,
          text: text.trim(),
        });

        // Populate sender information
        await message.populate("sender", "name username image");

        // Get the chat to find the recipient
        const chat = await Chat.findById(chatId);

        // Create notification for the other user
        const recipient = chat.users.find(
          (userId) => userId.toString() !== senderId.toString()
        );

        if (recipient) {
          try {
            const notification = await createNotification({
              recipient: recipient,
              sender: senderId,
              type: "new_message",
              title: "New Message",
              message: chat.revealed
                ? `${message.sender.name} sent you a message`
                : `${message.sender.username} sent you a message`,
              relatedChat: chatId,
              relatedMessage: message._id,
              actionUrl: `/chat/${chatId}`,
            });

            // Emit notification via socket
            emitNotification(io, recipient.toString(), notification);
          } catch (notifError) {
            console.error(
              `Error creating message notification: ${notifError.message}`
            );
          }
        }

        // Broadcast message to all users in this chat room
        io.to(chatId).emit("message_received", {
          message,
          chatId,
        });

        console.log(`💬 Message sent in chat ${chatId} by user ${senderId}`);
      } catch (error) {
        console.error(`Error sending message: ${error.message}`);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("guess_submit", async (data) => {
      try {
        const { chatId, guess, userId } = data;

        if (!chatId || !guess || !userId) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        // Get chat and populate users
        const chat = await Chat.findById(chatId).populate("users");

        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        // Check if already revealed
        if (chat.revealed) {
          socket.emit("error", { message: "Chat already revealed" });
          return;
        }

        // Save guess to user
        const user = await User.findById(userId);

        // Check if user already guessed for this chat
        const existingGuessIndex = user.guesses.findIndex(
          (g) => g.chatId.toString() === chatId
        );

        if (existingGuessIndex !== -1) {
          user.guesses[existingGuessIndex].guess = guess;
        } else {
          user.guesses.push({ chatId, guess });
        }

        await user.save();

        // Notify the room that a guess was submitted
        io.to(chatId).emit("guess_submitted", {
          userId,
          chatId,
        });

        // Check if both users have guessed
        const otherUser = chat.users.find(
          (u) => u._id.toString() !== userId.toString()
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
            // Update chat to revealed
            chat.revealed = true;
            await chat.save();

            // Create identity revealed notifications for both users
            try {
              const notification1 = await createNotification({
                recipient: userId,
                sender: otherUser._id,
                type: "identity_revealed",
                title: "Identities Revealed! 🎉",
                message: `You and ${otherUser.name} guessed correctly!`,
                relatedChat: chatId,
                actionUrl: `/chat/${chatId}`,
              });

              const notification2 = await createNotification({
                recipient: otherUser._id,
                sender: userId,
                type: "identity_revealed",
                title: "Identities Revealed! 🎉",
                message: `You and ${user.name} guessed correctly!`,
                relatedChat: chatId,
                actionUrl: `/chat/${chatId}`,
              });

              // Emit notifications via socket
              emitNotification(io, userId.toString(), notification1);
              emitNotification(io, otherUser._id.toString(), notification2);
            } catch (notifError) {
              console.error(
                `Error creating reveal notifications: ${notifError.message}`
              );
            }

            // Broadcast identity reveal to both users
            io.to(chatId).emit("reveal_identity", {
              chatId,
              revealed: true,
              users: chat.users,
              message: "Both guesses correct! Identities revealed! 🎉",
            });

            console.log(`🎉 Identities revealed in chat ${chatId}`);
          } else {
            // At least one guess is incorrect
            io.to(chatId).emit("guess_incorrect", {
              chatId,
              message: "At least one guess is incorrect. Try again!",
            });

            console.log(`Incorrect guesses in chat ${chatId}`);
          }
        }
      } catch (error) {
        console.error(`Error submitting guess: ${error.message}`);
        socket.emit("error", { message: "Failed to submit guess" });
      }
    });

    /**
     * Event: typing
     * User is typing a message
     * Data: { chatId, userId }
     */
    socket.on("typing", (data) => {
      const { chatId, userId } = data;

      // Broadcast to other users in the chat (not the sender)
      socket.to(chatId).emit("user_typing", {
        chatId,
        userId,
      });
    });

    /**
     * Event: stop_typing
     * User stopped typing
     * Data: { chatId, userId }
     */
    socket.on("stop_typing", (data) => {
      const { chatId, userId } = data;

      // Broadcast to other users in the chat
      socket.to(chatId).emit("user_stop_typing", {
        chatId,
        userId,
      });
    });

    /**
     * Event: disconnect
     * User disconnects from socket
     */
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default chatSocket;

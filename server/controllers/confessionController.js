import Confession from "../models/Confession.js";
import User from "../models/User.js";
import AllowedDomain from "../models/AllowedDomain.js";
import { createAndEmitNotification } from "../utils/notificationHelper.js";

export const createConfession = async (req, res) => {
  try {
    const { text } = req.body;
    const username = req.user.username;
    const userEmail = req.user.email;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Confession text is required",
      });
    }

    // Get the user's domain from their email
    const emailDomain = userEmail.split("@")[1]?.toLowerCase();
    if (!emailDomain) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Find the allowed domain
    const allowedDomain = await AllowedDomain.findOne({
      domain: emailDomain,
      isActive: true,
    });

    if (!allowedDomain) {
      return res.status(403).json({
        success: false,
        message: "Domain not authorized for confessions",
      });
    }

    const newConfession = await Confession.create({
      username: username,
      confession: text.trim(),
      allowedDomain: allowedDomain._id,
    });

    res.status(201).json({
      success: true,
      message: "Confession posted successfully",
      data: {
        confession: newConfession,
      },
    });
  } catch (error) {
    console.error(`Error creating confession: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error creating confession",
      error: error.message,
    });
  }
};

export const getConfessions = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { page = 1, limit = 20 } = req.query;

    // Get the user's domain from their email
    const emailDomain = userEmail.split("@")[1]?.toLowerCase();
    if (!emailDomain) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Find the allowed domain
    const allowedDomain = await AllowedDomain.findOne({
      domain: emailDomain,
      isActive: true,
    });

    if (!allowedDomain) {
      return res.status(403).json({
        success: false,
        message: "Domain not authorized for confessions",
      });
    }

    const confessions = await Confession.find({
      allowedDomain: allowedDomain._id,
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("comments.user", "username name image")
      .populate("allowedDomain", "domain institutionName")
      .lean();

    const total = await Confession.countDocuments({
      allowedDomain: allowedDomain._id,
    });

    const confessionsWithCounts = confessions.map((confession) => ({
      ...confession,
      commentsCount: confession.comments.length,
      hasLiked: confession.likedBy
        ? confession.likedBy.some(
            (id) => id.toString() === req.user._id.toString()
          )
        : false,
    }));

    res.status(200).json({
      success: true,
      data: {
        confessions: confessionsWithCounts,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalConfessions: total,
      },
    });
  } catch (error) {
    console.error(`Error fetching confessions: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching confessions",
      error: error.message,
    });
  }
};

export const likeConfession = async (req, res) => {
  try {
    const { confessionId } = req.params;
    const userId = req.user._id;

    const confession = await Confession.findById(confessionId);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: "Confession not found",
      });
    }

    // Check if user's domain matches confession's domain
    const userEmail = req.user.email;
    const emailDomain = userEmail.split("@")[1]?.toLowerCase();

    const userAllowedDomain = await AllowedDomain.findOne({
      domain: emailDomain,
      isActive: true,
    });

    if (
      !userAllowedDomain ||
      confession.allowedDomain.toString() !== userAllowedDomain._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Cannot like confessions from other domains",
      });
    }

    // Check if user has already liked this confession
    const hasLiked = confession.likedBy
      ? confession.likedBy.some((id) => id.toString() === userId.toString())
      : false;
    let action = "";

    // Initialize likedBy array if it doesn't exist
    if (!confession.likedBy) {
      confession.likedBy = [];
    }

    if (hasLiked) {
      // Unlike: remove user from likedBy array and decrement count
      confession.likedBy = confession.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      confession.likesCount = Math.max(0, confession.likesCount - 1);
      action = "unliked";
    } else {
      // Like: add user to likedBy array and increment count
      confession.likedBy.push(userId);
      confession.likesCount += 1;
      action = "liked";

      // Create notification for the confession author (only when liking)
      try {
        const confessionAuthor = await User.findOne({
          username: confession.username,
        });

        if (
          confessionAuthor &&
          confessionAuthor._id.toString() !== req.user._id.toString()
        ) {
          const io = req.app.get("io");
          await createAndEmitNotification(
            {
              recipient: confessionAuthor._id,
              sender: req.user._id,
              type: "confession_like",
              title: "New Like on Confession",
              message: `Someone liked your confession`,
              relatedConfession: confession._id,
              actionUrl: `/confessions/${confession._id}`,
            },
            io
          );
        }
      } catch (notifError) {
        console.error(
          `Error creating like notification: ${notifError.message}`
        );
        // Don't fail the request if notification creation fails
      }
    }

    await confession.save();

    return res.status(200).json({
      success: true,
      message: `Confession ${action}`,
      data: {
        likesCount: confession.likesCount,
        hasLiked: !hasLiked, // Return the new state
      },
    });
  } catch (error) {
    console.error(`Error liking confession: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error liking confession",
      error: error.message,
    });
  }
};

export const commentOnConfession = async (req, res) => {
  try {
    const { confessionId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const confession = await Confession.findById(confessionId);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: "Confession not found",
      });
    }

    // Check if user's domain matches confession's domain
    const userEmail = req.user.email;
    const emailDomain = userEmail.split("@")[1]?.toLowerCase();

    const userAllowedDomain = await AllowedDomain.findOne({
      domain: emailDomain,
      isActive: true,
    });

    if (
      !userAllowedDomain ||
      confession.allowedDomain.toString() !== userAllowedDomain._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Cannot comment on confessions from other domains",
      });
    }

    confession.comments.push({
      user: userId,
      text: text.trim(),
    });

    await confession.save();

    const populatedConfession = await Confession.findById(confessionId)
      .populate("comments.user", "username name image")
      .lean();

    // Create notification for the confession author
    try {
      const confessionAuthor = await User.findOne({
        username: confession.username,
      });

      if (
        confessionAuthor &&
        confessionAuthor._id.toString() !== userId.toString()
      ) {
        const io = req.app.get("io");
        await createAndEmitNotification(
          {
            recipient: confessionAuthor._id,
            sender: userId,
            type: "confession_comment",
            title: "New Comment on Confession",
            message: `${req.user.username} commented on your confession`,
            relatedConfession: confession._id,
            actionUrl: `/confessions/${confession._id}`,
          },
          io
        );
      }
    } catch (notifError) {
      console.error(
        `Error creating comment notification: ${notifError.message}`
      );
      // Don't fail the request if notification creation fails
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comments: populatedConfession.comments,
        commentsCount: populatedConfession.comments.length,
      },
    });
  } catch (error) {
    console.error(`Error adding comment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

// Automatic cleanup function to delete confessions older than 10 days
export const cleanupOldConfessions = async () => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const result = await Confession.deleteMany({
      createdAt: { $lt: tenDaysAgo },
    });
    console.log(
      `Cleaned up ${result.deletedCount} confessions older than 10 days`
    );
    return result.deletedCount;
  } catch (error) {
    console.error(`Error cleaning up old confessions: ${error.message}`);
    throw error;
  }
};

// Manual cleanup endpoint (for testing or manual triggers)
export const manualCleanup = async (req, res) => {
  try {
    const deletedCount = await cleanupOldConfessions();

    res.status(200).json({
      success: true,
      message: `Successfully cleaned up ${deletedCount} old confessions`,
      deletedCount,
    });
  } catch (error) {
    console.error(`Error in manual cleanup: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error during cleanup",
      error: error.message,
    });
  }
};

import Confession from "../models/Confession.js";
import User from "../models/user.js";
import { createAndEmitNotification } from "../utils/notificationHelper.js";

export const createConfession = async (req, res) => {
  try {
    const { text } = req.body;
    const username = req.user.username;
    const userCommunity = req.user.community;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Confession text is required",
      });
    }

    const newConfession = await Confession.create({
      username: username,
      confession: text.trim(),
      community: userCommunity,
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
    const userCommunity = req.user.community;
    const { page = 1, limit = 20 } = req.query;

    const confessions = await Confession.find({ community: userCommunity })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("comments.user", "username name image")
      .lean();

    const total = await Confession.countDocuments({ community: userCommunity });

    const confessionsWithCounts = confessions.map((confession) => ({
      ...confession,
      commentsCount: confession.comments.length,
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

    const confession = await Confession.findById(confessionId);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: "Confession not found",
      });
    }

    if (confession.community !== req.user.community) {
      return res.status(403).json({
        success: false,
        message: "Cannot like confessions from other communities",
      });
    }

    // Increment the likes count
    confession.likesCount += 1;
    await confession.save();

    // Create notification for the confession author
    try {
      const confessionAuthor = await User.findOne({
        username: confession.username,
        community: confession.community,
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

    return res.status(200).json({
      success: true,
      message: "Confession liked",
      data: {
        likesCount: confession.likesCount,
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

    if (confession.community !== req.user.community) {
      return res.status(403).json({
        success: false,
        message: "Cannot comment on confessions from other communities",
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
        community: confession.community,
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

export const deleteConfession = async (req, res) => {
  try {
    const { confessionId } = req.params;
    const username = req.user.username;

    const confession = await Confession.findById(confessionId);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: "Confession not found",
      });
    }

    if (confession.username !== username) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own confessions",
      });
    }

    await Confession.findByIdAndDelete(confessionId);

    res.status(200).json({
      success: true,
      message: "Confession deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting confession: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error deleting confession",
      error: error.message,
    });
  }
};

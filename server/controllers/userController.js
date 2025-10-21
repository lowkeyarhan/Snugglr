import User from "../models/user.js";
import Match from "../models/Match.js";

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      birthday,
      gender,
      pronouns,
      funBio,
      interests,
      musicPreferences,
      favoriteShows,
      memeVibe,
      community,
    } = req.body;

    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (birthday) {
      updateData.birthday = birthday;
      // Calculate age from birthday
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      updateData.age = age;
    }
    if (gender) updateData.gender = gender;
    if (pronouns) updateData.pronouns = pronouns;
    if (funBio) updateData.funBio = funBio;
    if (interests) updateData.interests = interests;
    if (musicPreferences) updateData.musicPreferences = musicPreferences;
    if (favoriteShows) updateData.favoriteShows = favoriteShows;
    if (memeVibe) updateData.memeVibe = memeVibe;
    if (community) updateData.community = community;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error(`❌ Update Profile Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const getPotentialMatches = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const userCommunity = req.user.community;

    const existingMatches = await Match.find({
      $or: [{ user1: currentUserId }, { user2: currentUserId }],
    });

    const swipedUserIds = existingMatches.map((match) =>
      match.user1.toString() === currentUserId.toString()
        ? match.user2
        : match.user1
    );

    const potentialMatches = await User.find({
      _id: {
        $nin: [...swipedUserIds, currentUserId],
      },
      community: userCommunity,
    })
      .select("-password -guesses")
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        users: potentialMatches,
      },
    });
  } catch (error) {
    console.error(`❌ Get Potential Matches Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching potential matches",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -guesses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(`❌ Get User Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

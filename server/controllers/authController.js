import bcrypt from "bcryptjs";
import User from "../models/user.js";
import AllowedDomain from "../models/AllowedDomain.js";
import generateToken from "../config/token.js";
import { generateUniqueUsername } from "../utils/usernameGenerator.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      community,
      birthday,
      gender,
      pronouns,
      interests,
      musicPreferences,
      favoriteShows,
      memeVibe,
      funBio,
    } = req.body;

    if (!name || !email || !password || !community) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, and community",
      });
    }

    // Verify email domain is allowed
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (!emailDomain) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const allowedDomain = await AllowedDomain.findOne({
      domain: emailDomain,
      isActive: true,
    });

    if (!allowedDomain) {
      return res.status(403).json({
        success: false,
        message:
          "Email domain is not authorized. Please use a valid college/institution email.",
        emailDomain,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique catchy username for anonymity
    const username = await generateUniqueUsername(User);

    // Calculate age from birthday if birthday is provided
    let age = null;
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    }

    // Create new user
    const user = await User.create({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      community,
      birthday,
      gender,
      pronouns,
      age,
      interests,
      musicPreferences,
      favoriteShows,
      memeVibe,
      funBio,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response (exclude password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
        },
        token,
      },
    });
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response (exclude password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          gender: user.gender,
          age: user.age,
          bio: user.bio,
          interests: user.interests,
          image: user.image,
        },
        token,
      },
    });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          gender: user.gender,
          age: user.age,
          bio: user.bio,
          interests: user.interests,
          image: user.image,
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching user profile: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

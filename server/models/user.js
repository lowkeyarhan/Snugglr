import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    birthday: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    pronouns: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: [18, "Must be at least 18 years old"],
      max: [100, "Age must be less than 100"],
    },
    // funBio removed in favor of hint
    interests: {
      type: [String],
      default: [],
    },
    musicPreferences: {
      type: String,
      maxlength: [200, "Music preferences cannot exceed 200 characters"],
    },
    favoriteShows: {
      type: String,
      maxlength: [200, "Favorite shows cannot exceed 200 characters"],
    },
    memeVibe: {
      type: String,
      maxlength: [300, "Meme vibe cannot exceed 300 characters"],
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },

    community: {
      type: String,
      required: [true, "Community/University is required"],
      trim: true,
    },

    // Campus Life
    favoriteSpot: {
      type: String,
      maxlength: [200, "Favorite spot cannot exceed 200 characters"],
      trim: true,
    },
    loveLanguage: {
      type: String,
      maxlength: [100, "Love language cannot exceed 100 characters"],
      trim: true,
    },
    quirkyFact: {
      type: String,
      maxlength: [300, "Quirky fact cannot exceed 300 characters"],
      trim: true,
    },

    // Dreams & Desires
    fantasies: {
      type: String,
      maxlength: [500, "Fantasies cannot exceed 500 characters"],
      trim: true,
    },
    idealDate: {
      type: String,
      maxlength: [500, "Ideal date cannot exceed 500 characters"],
      trim: true,
    },

    // The Mystery
    hint: {
      type: String,
      maxlength: [300, "Hint cannot exceed 300 characters"],
      trim: true,
    },

    // App Preferences
    settings: {
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: false,
      },
    },

    // Privacy & Safety
    privacy: {
      showActiveStatus: {
        type: Boolean,
        default: true,
      },
      hideDisplayPicture: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

// Prevent model overwrite error during development
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

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
    funBio: {
      type: String,
      maxlength: [300, "Quirky fact cannot exceed 300 characters"],
    },
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
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;

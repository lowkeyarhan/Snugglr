import mongoose from "mongoose";

const allowedDomainSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: [true, "Domain is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    institutionName: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AllowedDomain = mongoose.model("AllowedDomain", allowedDomainSchema);

export default AllowedDomain;

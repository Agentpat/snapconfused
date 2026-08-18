import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Confession content is required"],
      trim: true,
      minlength: [5, "Confession must be at least 5 characters"],
      maxlength: [500, "Confession cannot exceed 500 characters"],
    },

    author: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      default: "Anonymous",
    },

    isAnonymous: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Confession = mongoose.model("Confession", confessionSchema);

export default Confession;

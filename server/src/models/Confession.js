import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema(
  {
    // =====================================================
    // CONTENT
    // =====================================================

    content: {
      type: String,
      required: [true, "Confession content is required"],
      trim: true,
      minlength: [5, "Confession must be at least 5 characters"],
      maxlength: [500, "Confession cannot exceed 500 characters"],
    },

    // =====================================================
    // AUTHOR
    // =====================================================

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

    // =====================================================
    // AUTOMATED MODERATION STATUS
    //
    // approved = passed automated moderation
    // flagged  = requires admin review
    // rejected = blocked from publication
    //
    // Manual approval is no longer part of the workflow.
    // =====================================================

    status: {
      type: String,
      enum: ["approved", "flagged", "rejected"],
      default: "approved",
    },

    // =====================================================
    // MODERATION DETAILS
    // =====================================================

    moderationReason: {
      type: String,
      trim: true,
      maxlength: [500, "Moderation reason cannot exceed 500 characters"],
      default: null,
    },

    moderatedAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // FEATURED / HALL OF SHAME
    // =====================================================

    featured: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // CONTENT SOURCE
    //
    // user  = submitted through public website
    // admin = created/imported through admin system
    // =====================================================

    source: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =====================================================
    // PUBLICATION STATE
    //
    // unpublished = approved but not currently public
    // scheduled   = waiting for scheduled publication time
    // published   = currently published
    //
    // Moderation and publication are intentionally separate.
    // =====================================================

    publicationStatus: {
      type: String,
      enum: ["unpublished", "scheduled", "published"],
      default: "unpublished",
    },

    // =====================================================
    // SCHEDULING
    // =====================================================

    scheduledFor: {
      type: Date,
      default: null,
    },

    // =====================================================
    // PUBLICATION TIMESTAMP
    // =====================================================

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// =========================================================
// INDEXES
// =========================================================

confessionSchema.index({
  status: 1,
  createdAt: -1,
});

confessionSchema.index({
  publicationStatus: 1,
  scheduledFor: 1,
});

confessionSchema.index({
  featured: 1,
  createdAt: -1,
});

confessionSchema.index({
  source: 1,
  createdAt: -1,
});

// =========================================================
// MODEL
// =========================================================

const Confession = mongoose.model("Confession", confessionSchema);

export default Confession;

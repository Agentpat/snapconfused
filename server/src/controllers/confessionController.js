import Confession from "../models/Confession.js";

// =========================================================
// CREATE CONFESSION
// POST /api/confessions
//
// New submissions are automatically approved.
// They remain unpublished until the content system
// publishes them.
// =========================================================

export const createConfession = async (req, res, next) => {
  try {
    const { content, author, isAnonymous } = req.body;

    // -----------------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------------

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please tell us your Snapchat struggle.",
      });
    }

    // -----------------------------------------------------
    // DETERMINE AUTHOR
    // -----------------------------------------------------

    const anonymous = isAnonymous === undefined ? true : Boolean(isAnonymous);

    const confessionAuthor = anonymous
      ? "Anonymous"
      : author?.trim() || "Anonymous";

    // -----------------------------------------------------
    // CREATE CONFESSION
    //
    // No manual approval.
    //
    // status:
    // approved
    //
    // publicationStatus:
    // unpublished
    // -----------------------------------------------------

    const confession = await Confession.create({
      content: content.trim(),

      author: confessionAuthor,

      isAnonymous: anonymous,

      status: "approved",

      source: "user",

      publicationStatus: "unpublished",

      scheduledFor: null,

      publishedAt: null,

      moderatedAt: new Date(),
    });

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return res.status(201).json({
      success: true,

      message: "Your confession has been safely documented.",

      confession,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// GET ALL CONFESSIONS
// GET /api/confessions?page=1&limit=12
//
// IMPORTANT:
// This remains a general listing endpoint.
//
// The ADMIN confession system now uses:
// /api/admin/confessions
//
// The public UI should normally use:
// /approved
// or
// /featured
//
// This endpoint is kept for compatibility.
// =========================================================

export const getConfessions = async (req, res, next) => {
  try {
    // -----------------------------------------------------
    // PAGE
    // -----------------------------------------------------

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

    // -----------------------------------------------------
    // LIMIT
    //
    // Default: 12
    // Maximum: 24
    // -----------------------------------------------------

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 12, 1),
      24,
    );

    // -----------------------------------------------------
    // SKIP
    // -----------------------------------------------------

    const skip = (page - 1) * limit;

    // -----------------------------------------------------
    // PUBLIC CONTENT ONLY
    //
    // Only published confessions should be exposed
    // through this public endpoint.
    // -----------------------------------------------------

    const filter = {
      status: "approved",
      publicationStatus: "published",
    };

    // -----------------------------------------------------
    // TOTAL COUNT
    // -----------------------------------------------------

    const total = await Confession.countDocuments(filter);

    // -----------------------------------------------------
    // TOTAL PAGES
    // -----------------------------------------------------

    const totalPages = Math.ceil(total / limit);

    // -----------------------------------------------------
    // CONFESSIONS
    // -----------------------------------------------------

    const confessions = await Confession.find(filter)
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return res.status(200).json({
      success: true,

      count: confessions.length,

      total,

      page,

      limit,

      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,

      confessions,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// GET PUBLISHED CONFESSIONS
// GET /api/confessions/approved
//
// Kept under the existing /approved route so the frontend
// does not need to be changed immediately.
//
// "Approved" now means the confession passed the automatic
// workflow, while publicationStatus determines visibility.
//
// Only published content is returned publicly.
// =========================================================

export const getApprovedConfessions = async (req, res, next) => {
  try {
    const confessions = await Confession.find({
      status: "approved",

      publicationStatus: "published",
    })
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .limit(12)
      .lean();

    return res.status(200).json({
      success: true,

      count: confessions.length,

      confessions,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// GET FEATURED / HALL OF SHAME
// GET /api/confessions/featured
//
// Only published + approved + featured confessions
// appear publicly.
// =========================================================

export const getFeaturedConfessions = async (req, res, next) => {
  try {
    const confessions = await Confession.find({
      status: "approved",

      publicationStatus: "published",

      featured: true,
    })
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,

      count: confessions.length,

      confessions,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// FEATURE CONFESSION
//
// NOTE:
// This function is retained for backwards compatibility.
// Actual admin feature management now belongs to:
//
// /api/admin/confessions/:id/feature
// =========================================================

export const featureConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,

        message: "Confession not found.",
      });
    }

    if (confession.status !== "approved") {
      return res.status(400).json({
        success: false,

        message: "Only approved confessions can be featured.",
      });
    }

    confession.featured = true;

    await confession.save();

    return res.status(200).json({
      success: true,

      message: "Confession added to the Hall of Shame.",

      confession,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// UNFEATURE CONFESSION
//
// NOTE:
// Actual admin feature management now belongs to:
//
// /api/admin/confessions/:id/unfeature
// =========================================================

export const unfeatureConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,

        message: "Confession not found.",
      });
    }

    confession.featured = false;

    await confession.save();

    return res.status(200).json({
      success: true,

      message: "Confession removed from the Hall of Shame.",

      confession,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// DELETE CONFESSION
//
// NOTE:
// Actual deletion is now handled by:
//
// /api/admin/confessions/:id
//
// This export is retained temporarily so existing imports
// do not break.
// =========================================================

export const deleteConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,

        message: "Confession not found.",
      });
    }

    await Confession.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,

      message: "Confession deleted successfully.",

      confessionId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

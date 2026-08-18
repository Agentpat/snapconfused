import Confession from "../models/Confession.js";

// =========================================================
// CREATE CONFESSION
// POST /api/confessions
// =========================================================

export const createConfession = async (req, res, next) => {
  try {
    const { content, author, isAnonymous } = req.body;

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please tell us your Snapchat struggle.",
      });
    }

    // -------------------------------------------------------
    // DETERMINE AUTHOR
    // -------------------------------------------------------

    const anonymous = isAnonymous === undefined ? true : Boolean(isAnonymous);

    const confessionAuthor = anonymous
      ? "Anonymous"
      : author?.trim() || "Anonymous";

    // -------------------------------------------------------
    // CREATE CONFESSION
    // -------------------------------------------------------

    const confession = await Confession.create({
      content: content.trim(),

      author: confessionAuthor,

      isAnonymous: anonymous,
    });

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

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
// GET /api/confessions
//
// Used by the admin side.
// Returns pending, approved and featured records.
// =========================================================

export const getConfessions = async (req, res, next) => {
  try {
    const confessions = await Confession.find().sort({
      createdAt: -1,
    });

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
// GET APPROVED CONFESSIONS
// GET /api/confessions/approved
//
// Public endpoint.
// Returns approved confessions whether or not
// they have been featured.
// =========================================================

export const getApprovedConfessions = async (req, res, next) => {
  try {
    const confessions = await Confession.find({
      status: "approved",
    })
      .sort({
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
// GET FEATURED CONFESSIONS
// GET /api/confessions/featured
//
// Public endpoint.
// Only approved + featured confessions appear here.
// Used by:
// - Homepage confession carousel
// - Hall of Shame
// =========================================================

export const getFeaturedConfessions = async (req, res, next) => {
  try {
    const confessions = await Confession.find({
      status: "approved",

      featured: true,
    })
      .sort({
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
// APPROVE CONFESSION
// PATCH /api/confessions/:id/approve
// =========================================================

export const approveConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findByIdAndUpdate(
      req.params.id,

      {
        status: "approved",
      },

      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!confession) {
      return res.status(404).json({
        success: false,

        message: "Confession not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Confession approved.",

      confession,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// FEATURE CONFESSION
// PATCH /api/confessions/:id/feature
//
// A confession MUST be approved before it can
// become featured.
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

    // -------------------------------------------------------
    // ONLY APPROVED CONFESSIONS CAN BE FEATURED
    // -------------------------------------------------------

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
// PATCH /api/confessions/:id/unfeature
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
// DELETE /api/confessions/:id
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

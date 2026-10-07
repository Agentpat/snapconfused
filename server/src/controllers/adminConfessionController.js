import Confession from "../models/Confession.js";

// =========================================================
// HELPERS
// =========================================================

const VALID_PUBLICATION_STATUSES = ["unpublished", "scheduled", "published"];

const normalizeAuthor = (author, isAnonymous) => {
  if (isAnonymous) {
    return "Anonymous";
  }

  return author?.trim() || "Anonymous";
};

const parseScheduledDate = (scheduledFor) => {
  if (!scheduledFor) {
    return null;
  }

  const date = new Date(scheduledFor);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const validatePublicationData = (publicationStatus, scheduledFor) => {
  if (!VALID_PUBLICATION_STATUSES.includes(publicationStatus)) {
    return {
      valid: false,
      message: "Invalid publication status.",
    };
  }

  if (publicationStatus === "scheduled") {
    if (!scheduledFor) {
      return {
        valid: false,
        message: "A scheduled confession requires a publication date.",
      };
    }

    const scheduledDate = parseScheduledDate(scheduledFor);

    if (!scheduledDate) {
      return {
        valid: false,
        message: "Invalid scheduled date.",
      };
    }

    return {
      valid: true,
      scheduledDate,
    };
  }

  return {
    valid: true,
    scheduledDate: null,
  };
};

// =========================================================
// GET ALL ADMIN CONFESSIONS
// GET /api/admin/confessions
//
// Returns the complete confession collection for the
// admin content workspace.
// =========================================================

export const getAdminConfessions = async (req, res, next) => {
  try {
    const confessions = await Confession.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    // -------------------------------------------------------
    // CONTENT TOTALS
    // -------------------------------------------------------

    const totals = {
      all: confessions.length,

      published: confessions.filter(
        (confession) => confession.publicationStatus === "published",
      ).length,

      scheduled: confessions.filter(
        (confession) => confession.publicationStatus === "scheduled",
      ).length,

      unpublished: confessions.filter(
        (confession) => confession.publicationStatus === "unpublished",
      ).length,

      featured: confessions.filter((confession) => confession.featured === true)
        .length,

      // -----------------------------------------------------
      // LEGACY COUNTS
      //
      // Kept temporarily so older admin clients do not
      // break while the moderation system is being removed.
      // -----------------------------------------------------

      pending: confessions.filter(
        (confession) => confession.status === "pending",
      ).length,

      approved: confessions.filter(
        (confession) => confession.status === "approved",
      ).length,

      rejected: confessions.filter(
        (confession) => confession.status === "rejected",
      ).length,
    };

    return res.status(200).json({
      success: true,

      count: confessions.length,

      totals,

      confessions,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// GET SINGLE ADMIN CONFESSION
// GET /api/admin/confessions/:id
// =========================================================

export const getAdminConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: "Confession not found.",
      });
    }

    return res.status(200).json({
      success: true,
      confession,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// CREATE ADMIN CONFESSION
// POST /api/admin/confessions
//
// Creates one piece of admin content.
//
// Moderation is no longer part of the workflow.
// Every admin-created confession is automatically approved.
// Publication is controlled separately.
// =========================================================

export const createAdminConfession = async (req, res, next) => {
  try {
    const {
      content,
      author,
      isAnonymous,
      featured,
      publicationStatus,
      scheduledFor,
    } = req.body;

    // -------------------------------------------------------
    // VALIDATE CONTENT
    // -------------------------------------------------------

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Confession content is required.",
      });
    }

    // -------------------------------------------------------
    // NORMALIZE AUTHOR
    // -------------------------------------------------------

    const anonymous = isAnonymous === undefined ? true : Boolean(isAnonymous);

    const confessionAuthor = normalizeAuthor(author, anonymous);

    // -------------------------------------------------------
    // PUBLICATION STATUS
    // -------------------------------------------------------

    const confessionPublicationStatus = publicationStatus || "unpublished";

    const publicationValidation = validatePublicationData(
      confessionPublicationStatus,
      scheduledFor,
    );

    if (!publicationValidation.valid) {
      return res.status(400).json({
        success: false,
        message: publicationValidation.message,
      });
    }

    // -------------------------------------------------------
    // PUBLICATION DATE
    // -------------------------------------------------------

    let publishedAt = null;

    if (confessionPublicationStatus === "published") {
      publishedAt = new Date();
    }

    // -------------------------------------------------------
    // CREATE
    // -------------------------------------------------------

    const confession = await Confession.create({
      content: content.trim(),

      author: confessionAuthor,

      isAnonymous: anonymous,

      // No moderation anymore.
      status: "approved",

      featured: Boolean(featured),

      source: "admin",

      publicationStatus: confessionPublicationStatus,

      scheduledFor: publicationValidation.scheduledDate,

      publishedAt,
    });

    return res.status(201).json({
      success: true,

      message:
        confessionPublicationStatus === "published"
          ? "Confession published successfully."
          : confessionPublicationStatus === "scheduled"
            ? "Confession scheduled successfully."
            : "Confession saved as unpublished.",

      confession,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// BULK IMPORT CONFESSIONS
// POST /api/admin/confessions/import
//
// Accepts a JSON array of confession objects.
//
// Example:
//
// {
//   "confessions": [
//     {
//       "content": "My confession...",
//       "author": "Anonymous",
//       "isAnonymous": true
//     }
//   ],
//   "publicationStatus": "scheduled",
//   "scheduledFor": "2026-09-25T18:00:00.000Z"
// }
//
// The JSON file itself is NOT stored.
// Each confession becomes a real MongoDB document.
// =========================================================

export const importAdminConfessions = async (req, res, next) => {
  try {
    const { confessions, publicationStatus, scheduledFor } = req.body;

    // -------------------------------------------------------
    // VALIDATE ARRAY
    // -------------------------------------------------------

    if (!Array.isArray(confessions)) {
      return res.status(400).json({
        success: false,
        message: "Confessions must be provided as an array.",
      });
    }

    if (confessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No confessions were provided for import.",
      });
    }

    // -------------------------------------------------------
    // PROTECT AGAINST HUGE IMPORTS
    // -------------------------------------------------------

    if (confessions.length > 500) {
      return res.status(400).json({
        success: false,
        message: "You can import a maximum of 500 confessions at once.",
      });
    }

    // -------------------------------------------------------
    // PUBLICATION STATUS
    // -------------------------------------------------------

    const confessionPublicationStatus = publicationStatus || "unpublished";

    const publicationValidation = validatePublicationData(
      confessionPublicationStatus,
      scheduledFor,
    );

    if (!publicationValidation.valid) {
      return res.status(400).json({
        success: false,
        message: publicationValidation.message,
      });
    }

    // -------------------------------------------------------
    // VALIDATE EVERY ITEM BEFORE WRITING ANYTHING
    // -------------------------------------------------------

    const normalizedConfessions = [];

    for (let index = 0; index < confessions.length; index += 1) {
      const item = confessions[index];

      if (!item || typeof item !== "object") {
        return res.status(400).json({
          success: false,
          message: `Confession ${index + 1} is invalid.`,
        });
      }

      if (
        !item.content ||
        typeof item.content !== "string" ||
        !item.content.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `Confession ${index + 1} is missing content.`,
        });
      }

      const content = item.content.trim();

      if (content.length < 5) {
        return res.status(400).json({
          success: false,
          message: `Confession ${index + 1} must contain at least 5 characters.`,
        });
      }

      if (content.length > 500) {
        return res.status(400).json({
          success: false,
          message: `Confession ${index + 1} exceeds the 500 character limit.`,
        });
      }

      const anonymous =
        item.isAnonymous === undefined ? true : Boolean(item.isAnonymous);

      const confessionAuthor = normalizeAuthor(item.author, anonymous);

      normalizedConfessions.push({
        content,

        author: confessionAuthor,

        isAnonymous: anonymous,

        // Automatically accepted.
        status: "approved",

        featured: false,

        source: "admin",

        publicationStatus: confessionPublicationStatus,

        scheduledFor: publicationValidation.scheduledDate,

        publishedAt:
          confessionPublicationStatus === "published" ? new Date() : null,
      });
    }

    // -------------------------------------------------------
    // INSERT BATCH
    // -------------------------------------------------------

    const createdConfessions = await Confession.insertMany(
      normalizedConfessions,
    );

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.status(201).json({
      success: true,

      message: `${createdConfessions.length} confessions imported successfully.`,

      count: createdConfessions.length,

      publicationStatus: confessionPublicationStatus,

      scheduledFor: publicationValidation.scheduledDate,

      confessions: createdConfessions,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// FEATURE CONFESSION
// PATCH /api/admin/confessions/:id/feature
//
// Publication and moderation are separate.
// A confession can be featured once it exists in the
// content system.
// =========================================================

export const featureAdminConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: "Confession not found.",
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
// PATCH /api/admin/confessions/:id/unfeature
// =========================================================

export const unfeatureAdminConfession = async (req, res, next) => {
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
// SCHEDULE CONFESSION
// PATCH /api/admin/confessions/:id/schedule
// =========================================================

export const scheduleAdminConfession = async (req, res, next) => {
  try {
    const { scheduledFor } = req.body;

    if (!scheduledFor) {
      return res.status(400).json({
        success: false,
        message: "A publication date is required.",
      });
    }

    const scheduledDate = parseScheduledDate(scheduledFor);

    if (!scheduledDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date.",
      });
    }

    // -------------------------------------------------------
    // PREVENT SCHEDULING IN THE PAST
    // -------------------------------------------------------

    if (scheduledDate.getTime() <= Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled publication must be in the future.",
      });
    }

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: "Confession not found.",
      });
    }

    confession.publicationStatus = "scheduled";

    confession.scheduledFor = scheduledDate;

    confession.publishedAt = null;

    // No approval check.
    confession.status = "approved";

    await confession.save();

    return res.status(200).json({
      success: true,

      message: "Confession scheduled successfully.",

      confession,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// PUBLISH CONFESSION
// PATCH /api/admin/confessions/:id/publish
// =========================================================

export const publishAdminConfession = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({
        success: false,
        message: "Confession not found.",
      });
    }

    confession.status = "approved";

    confession.publicationStatus = "published";

    confession.publishedAt = new Date();

    confession.scheduledFor = null;

    await confession.save();

    return res.status(200).json({
      success: true,

      message: "Confession published successfully.",

      confession,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// DELETE ADMIN CONFESSION
// DELETE /api/admin/confessions/:id
// =========================================================

export const deleteAdminConfession = async (req, res, next) => {
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

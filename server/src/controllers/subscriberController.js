import Subscriber from "../models/Subscriber.js";

// =========================================================
// JOIN CONFIDENTIAL CLUB
// POST /api/subscribers
// =========================================================

export const createSubscriber = async (req, res, next) => {
  try {
    const { email } = req.body;

    // -------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // -------------------------------------------------
    // EMAIL FORMAT
    // -------------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // -------------------------------------------------
    // CHECK EXISTING SUBSCRIBER
    // -------------------------------------------------

    const existingSubscriber = await Subscriber.findOne({
      email: normalizedEmail,
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === "unsubscribed") {
        existingSubscriber.status = "active";

        await existingSubscriber.save();

        return res.status(200).json({
          success: true,
          message: "Welcome back to the Confidential Club.",
          subscriber: existingSubscriber,
        });
      }

      return res.status(409).json({
        success: false,
        message: "You're already in the Confidential Club. 👀",
      });
    }

    // -------------------------------------------------
    // CREATE SUBSCRIBER
    // -------------------------------------------------

    const subscriber = await Subscriber.create({
      email: normalizedEmail,
    });

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(201).json({
      success: true,

      message: "Welcome to the Confidential Club. 🤫",

      subscriber,
    });
  } catch (error) {
    next(error);
  }
};

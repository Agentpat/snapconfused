import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";

// =========================================================
// CREATE ADMIN
// POST /api/admin/setup
//
// DEVELOPMENT / INITIAL SETUP ONLY
// The route itself is disabled in production.
// =========================================================

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,

        message: "Name, email and password are required.",
      });
    }

    const normalizedName = name.trim();

    const normalizedEmail = email.trim().toLowerCase();

    // -------------------------------------------------------
    // NAME VALIDATION
    // -------------------------------------------------------

    if (!normalizedName) {
      return res.status(400).json({
        success: false,

        message: "Name cannot be empty.",
      });
    }

    // -------------------------------------------------------
    // EMAIL VALIDATION
    // -------------------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,

        message: "Please enter a valid email address.",
      });
    }

    // -------------------------------------------------------
    // PASSWORD VALIDATION
    // -------------------------------------------------------

    if (password.length < 8) {
      return res.status(400).json({
        success: false,

        message: "Password must be at least 8 characters long.",
      });
    }

    // -------------------------------------------------------
    // CHECK EXISTING ADMIN
    // -------------------------------------------------------

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,

        message: "Admin already exists.",
      });
    }

    // -------------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 12);

    // -------------------------------------------------------
    // CREATE ADMIN
    // -------------------------------------------------------

    const admin = await Admin.create({
      name: normalizedName,

      email: normalizedEmail,

      password: hashedPassword,
    });

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.status(201).json({
      success: true,

      message: "Admin created successfully.",

      admin: {
        id: admin._id,

        name: admin.name,

        email: admin.email,

        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// ADMIN LOGIN
// POST /api/admin/login
// =========================================================

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // -------------------------------------------------------
    // FIND ADMIN
    // -------------------------------------------------------

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    // -------------------------------------------------------
    // INVALID CREDENTIALS
    // -------------------------------------------------------

    if (!admin) {
      return res.status(401).json({
        success: false,

        message: "Invalid credentials.",
      });
    }

    // -------------------------------------------------------
    // CHECK PASSWORD
    // -------------------------------------------------------

    const passwordMatches = await bcrypt.compare(password, admin.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,

        message: "Invalid credentials.",
      });
    }

    // -------------------------------------------------------
    // JWT SECRET CHECK
    // -------------------------------------------------------

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    // -------------------------------------------------------
    // CREATE JWT
    // -------------------------------------------------------

    const token = jwt.sign(
      {
        id: admin._id.toString(),

        role: admin.role,

        email: admin.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.status(200).json({
      success: true,

      message: "Admin login successful.",

      token,

      admin: {
        id: admin._id,

        name: admin.name,

        email: admin.email,

        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

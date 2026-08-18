import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminAuth = async (req, res, next) => {
  try {
    // =====================================================
    // JWT SECRET CHECK
    // =====================================================

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    // =====================================================
    // AUTHORIZATION HEADER
    // =====================================================

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,

        message: "Authentication required.",
      });
    }

    // =====================================================
    // EXTRACT TOKEN
    // =====================================================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,

        message: "Authentication token missing.",
      });
    }

    // =====================================================
    // VERIFY TOKEN
    // =====================================================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // =====================================================
    // VERIFY ADMIN ACCOUNT
    // =====================================================

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,

        message: "Admin account not found.",
      });
    }

    // =====================================================
    // ATTACH ADMIN TO REQUEST
    // =====================================================

    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(401).json({
      success: false,

      message: "Invalid or expired authentication token.",
    });
  }
};

export default adminAuth;

import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

import {
  protect,
  allowRoles,
} from "../middleware/auth.js";

import {
  createToken,
} from "../utils/token.js";

const router = express.Router();

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};

const safeUser = (user) => {
  return {
    id: user._id,
    _id: user._id,

    name: user.name,
    email: user.email,
    role: user.role,

    designation:
      user.designation || "",

    phone:
      user.phone || "",

    active:
      user.active !== false,
  };
};

/* =========================================================
   LOGIN
   POST /api/auth/login
========================================================= */

router.post(
  "/login",
  async (req, res) => {
    try {
      const email =
        normalizeEmail(
          req.body.email
        );

      const password =
        String(
          req.body.password || ""
        );

      if (!email) {
        return res
          .status(400)
          .json({
            message:
              "Email is required",
          });
      }

      if (!password) {
        return res
          .status(400)
          .json({
            message:
              "Password is required",
          });
      }

      /*
        +password important hai agar
        User model me password select:false hai.
      */

      const user =
        await User.findOne({
          email,
        }).select("+password");

      if (!user) {
        console.log(
          "LOGIN FAILED - USER NOT FOUND:",
          email
        );

        return res
          .status(401)
          .json({
            message:
              "Invalid credentials",
          });
      }

      if (
        user.active === false
      ) {
        return res
          .status(403)
          .json({
            message:
              "Account is inactive",
          });
      }

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatches) {
        console.log(
          "LOGIN FAILED - PASSWORD MISMATCH:",
          email
        );

        return res
          .status(401)
          .json({
            message:
              "Invalid credentials",
          });
      }

      const token =
        createToken(user);

      return res.json({
        token,
        user: safeUser(user),
      });
    } catch (error) {
      console.error(
        "LOGIN SERVER ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Unable to login",
        });
    }
  }
);

/* =========================================================
   EMPLOYEE SIGN UP
   POST /api/auth/register
========================================================= */

router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        designation,
        phone,
        officeCode,
      } = req.body;

      const email =
        normalizeEmail(
          req.body.email
        );

      const password =
        String(
          req.body.password || ""
        );

      if (!name?.trim()) {
        return res
          .status(400)
          .json({
            message:
              "Full name is required",
          });
      }

      if (!email) {
        return res
          .status(400)
          .json({
            message:
              "Email is required",
          });
      }

      if (
        password.length < 6
      ) {
        return res
          .status(400)
          .json({
            message:
              "Password must be at least 6 characters",
          });
      }

      if (
        !process.env
          .OFFICE_SIGNUP_CODE
      ) {
        return res
          .status(500)
          .json({
            message:
              "Office signup code is not configured",
          });
      }

      if (
        String(
          officeCode || ""
        ) !==
        String(
          process.env
            .OFFICE_SIGNUP_CODE
        )
      ) {
        return res
          .status(403)
          .json({
            message:
              "Invalid office access code",
          });
      }

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res
          .status(409)
          .json({
            message:
              "An account with this email already exists",
          });
      }

      /*
        User model ke password pre-save hook
        ko plain password diya ja raha hai.
      */

      const user =
        await User.create({
          name:
            name.trim(),

          email,

          password,

          phone:
            phone?.trim() || "",

          designation:
            designation?.trim() ||
            "Employee",

          role: "employee",

          active: true,
        });

      const token =
        createToken(user);

      return res
        .status(201)
        .json({
          token,
          user: safeUser(user),
        });
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            error.message ||
            "Unable to create account",
        });
    }
  }
);

/* =========================================================
   GET EMPLOYEES
   ADMIN ONLY
========================================================= */

router.get(
  "/employees",

  protect,
  allowRoles("admin"),

  async (req, res) => {
    try {
      const employees =
        await User.find({
          role: "employee",
        })
          .select("-password")
          .sort({
            name: 1,
          });

      return res.json(
        employees
      );
    } catch (error) {
      console.error(
        "EMPLOYEE LOAD ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Unable to load employees",
        });
    }
  }
);

/* =========================================================
   CREATE EMPLOYEE
   ADMIN ONLY
========================================================= */

router.post(
  "/employees",

  protect,
  allowRoles("admin"),

  async (req, res) => {
    try {
      const {
        name,
        phone,
        designation,
      } = req.body;

      const email =
        normalizeEmail(
          req.body.email
        );

      const password =
        String(
          req.body.password || ""
        );

      if (!name?.trim()) {
        return res
          .status(400)
          .json({
            message:
              "Employee name is required",
          });
      }

      if (!email) {
        return res
          .status(400)
          .json({
            message:
              "Employee email is required",
          });
      }

      if (
        password.length < 6
      ) {
        return res
          .status(400)
          .json({
            message:
              "Password must be at least 6 characters",
          });
      }

      const existing =
        await User.findOne({
          email,
        });

      if (existing) {
        return res
          .status(409)
          .json({
            message:
              "An account with this email already exists",
          });
      }

      const employee =
        await User.create({
          name:
            name.trim(),

          email,

          password,

          phone:
            phone?.trim() || "",

          designation:
            designation?.trim() ||
            "Employee",

          role:
            "employee",

          active: true,
        });

      return res
        .status(201)
        .json(
          safeUser(employee)
        );
    } catch (error) {
      console.error(
        "CREATE EMPLOYEE ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            error.message ||
            "Unable to create employee",
        });
    }
  }
);

/* =========================================================
   CURRENT USER
========================================================= */

router.get(
  "/me",

  protect,

  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        ).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      return res.json(
        safeUser(user)
      );
    } catch (error) {
      console.error(
        "CURRENT USER ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Unable to load user",
        });
    }
  }
);

/* =========================================================
   VERY IMPORTANT
   DEFAULT EXPORT
========================================================= */

export default router;
import express from "express";

import FollowUp from "../models/FollowUp.js";
import Client from "../models/Client.js";

import {
  protect,
} from "../middleware/auth.js";

const router =
  express.Router();

router.use(protect);

/* ==============================
   GET FOLLOW UPS
============================== */

router.get(
  "/",
  async (req, res) => {
    try {
      const filter =
        req.user.role === "admin"
          ? {}
          : {
              employee:
                req.user._id,
            };

      const items =
        await FollowUp.find(
          filter
        )
          .populate(
            "client",
            "name phone status clientCode"
          )
          .populate(
            "employee",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json(items);
    } catch (error) {
      res.status(500).json({
        message:
          "Unable to load follow-ups",
      });
    }
  }
);

/* ==============================
   CREATE FOLLOW UP
============================== */

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        client,
        mode,
        summary,
        outcome,
        nextFollowUp,
      } = req.body;

      if (
        !client ||
        !summary?.trim()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Client and summary are required",
          });
      }

      const clientRecord =
        await Client.findById(
          client
        );

      if (!clientRecord) {
        return res
          .status(404)
          .json({
            message:
              "Client not found",
          });
      }

      /* EMPLOYEE SECURITY */

      if (
        req.user.role !==
        "admin"
      ) {
        if (
          !clientRecord.assignedTo ||
          String(
            clientRecord.assignedTo
          ) !==
            String(
              req.user._id
            )
        ) {
          return res
            .status(403)
            .json({
              message:
                "You can add follow-ups only for clients assigned to you",
            });
        }
      }

      const employee =
        req.user.role ===
          "admin" &&
        req.body.employee
          ? req.body.employee
          : req.user._id;

      const item =
        await FollowUp.create({
          client,

          employee,

          mode:
            mode || "Call",

          summary:
            summary.trim(),

          outcome:
            outcome || "",

          nextFollowUp:
            nextFollowUp ||
            null,
        });

      if (nextFollowUp) {
        await Client.findByIdAndUpdate(
          client,
          {
            nextFollowUp,
          }
        );
      }

      const result =
        await FollowUp.findById(
          item._id
        )
          .populate(
            "client",
            "name phone status clientCode"
          )
          .populate(
            "employee",
            "name email"
          );

      res
        .status(201)
        .json(result);
    } catch (error) {
      res.status(400).json({
        message:
          error.message ||
          "Unable to save follow-up",
      });
    }
  }
);

export default router;
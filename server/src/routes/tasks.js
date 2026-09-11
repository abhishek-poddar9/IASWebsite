import express from "express";

import Task from "../models/Task.js";

import {
  protect,
  allowRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

/* ===============================
   GET TASKS
================================ */

router.get(
  "/",
  async (req, res) => {
    try {
      const filter =
        req.user.role === "admin"
          ? {}
          : {
              assignedTo:
                req.user._id,
            };

      const tasks =
        await Task.find(filter)
          .populate(
            "assignedTo",
            "name email designation"
          )
          .populate(
            "client",
            "name clientCode"
          )
          .sort({
            dueDate: 1,
            createdAt: -1,
          });

      res.json(tasks);
    } catch (error) {
      console.error(
        "Task load error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load tasks",
      });
    }
  }
);

/* ===============================
   CREATE TASK
   ADMIN ONLY
================================ */

router.post(
  "/",

  allowRoles("admin"),

  async (req, res) => {
    try {
      const {
        title,
        description,
        assignedTo,
        client,
        priority,
        dueDate,
      } = req.body;

      /* REQUIRED VALIDATION */

      if (!title?.trim()) {
        return res
          .status(400)
          .json({
            message:
              "Task title is required",
          });
      }

      if (!assignedTo) {
        return res
          .status(400)
          .json({
            message:
              "Employee is required",
          });
      }

      /* BUILD SAFE TASK */

      const taskData = {
        title:
          title.trim(),

        description:
          description?.trim() ||
          "",

        assignedTo,

        createdBy:
          req.user._id,

        priority:
          priority ||
          "Medium",
      };

      /*
        Client optional hai.

        Empty string MongoDB ObjectId
        field me nahi bhejna.
      */

      if (client) {
        taskData.client =
          client;
      }

      /*
        Due date optional hai.
      */

      if (dueDate) {
        taskData.dueDate =
          dueDate;
      }

      /* CREATE */

      const createdTask =
        await Task.create(
          taskData
        );

      /* POPULATE */

      const task =
        await Task.findById(
          createdTask._id
        )
          .populate(
            "assignedTo",
            "name email designation"
          )
          .populate(
            "client",
            "name clientCode"
          );

      res
        .status(201)
        .json(task);
    } catch (error) {
      console.error(
        "Create task error:",
        error
      );

      res.status(400).json({
        message:
          error.message ||
          "Unable to create task",
      });
    }
  }
);

/* ===============================
   UPDATE TASK STATUS
================================ */

router.patch(
  "/:id/status",

  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "To Do",
        "In Progress",
        "Blocked",
        "Done",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid task status",
          });
      }

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      /*
        Employee sirf apna
        assigned task update kare.
      */

      if (
        req.user.role !==
          "admin" &&
        String(
          task.assignedTo
        ) !==
          String(
            req.user._id
          )
      ) {
        return res
          .status(403)
          .json({
            message:
              "You can update only your assigned tasks",
          });
      }

      task.status =
        status;

      await task.save();

      const updatedTask =
        await Task.findById(
          task._id
        )
          .populate(
            "assignedTo",
            "name email designation"
          )
          .populate(
            "client",
            "name clientCode"
          );

      res.json(
        updatedTask
      );
    } catch (error) {
      console.error(
        "Task status error:",
        error
      );

      res.status(400).json({
        message:
          error.message ||
          "Unable to update task",
      });
    }
  }
);

export default router;
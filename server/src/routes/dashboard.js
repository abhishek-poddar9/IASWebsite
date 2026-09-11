import express from "express";
import Client from "../models/Client.js";
import Compliance from "../models/Compliance.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.get("/", async (req, res) => {
  const assigned =
    req.user.role === "admin" ? {} : { assignedTo: req.user._id };
  const [clients, activeClients, pendingCompliances, tasks, employees] =
    await Promise.all([
      Client.countDocuments(assigned),
      Client.countDocuments({ ...assigned, status: "Active" }),
      Compliance.countDocuments({
        ...assigned,
        status: { $in: ["Pending", "In Progress", "Waiting for Client"] },
      }),
      Task.countDocuments({ ...assigned, status: { $ne: "Done" } }),
      req.user.role === "admin"
        ? User.countDocuments({ role: "employee", active: true })
        : Promise.resolve(null),
    ]);
  res.json({ clients, activeClients, pendingCompliances, tasks, employees });
});
export default router;

import express from "express";
import Attendance from "../models/Attendance.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
const today = () => new Date().toISOString().slice(0, 10);
router.post("/check-in", async (req, res) => {
  const record = await Attendance.findOneAndUpdate(
    { employee: req.user._id, date: today() },
    {
      $setOnInsert: {
        employee: req.user._id,
        date: today(),
        status: "Present",
      },
      $set: { checkIn: new Date() },
    },
    { new: true, upsert: true },
  );
  res.json(record);
});
router.post("/check-out", async (req, res) => {
  const record = await Attendance.findOneAndUpdate(
    { employee: req.user._id, date: today() },
    { $set: { checkOut: new Date() } },
    { new: true },
  );
  res.json(record);
});
router.get("/my", async (req, res) =>
  res.json(
    await Attendance.find({ employee: req.user._id })
      .sort({ date: -1 })
      .limit(31),
  ),
);
router.get("/", allowRoles("admin"), async (_req, res) =>
  res.json(
    await Attendance.find()
      .populate("employee", "name")
      .sort({ date: -1 })
      .limit(300),
  ),
);
export default router;

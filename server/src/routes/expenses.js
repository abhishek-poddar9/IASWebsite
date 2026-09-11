import express from "express";
import Expense from "../models/Expense.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = express.Router();
router.use(protect, allowRoles("admin"));
router.get("/", async (_req, res) =>
  res.json(await Expense.find().sort({ date: -1 })),
);
router.post("/", async (req, res) => {
  try {
    res
      .status(201)
      .json(await Expense.create({ ...req.body, createdBy: req.user._id }));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
export default router;

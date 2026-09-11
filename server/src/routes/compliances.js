import express from "express";
import Compliance from "../models/Compliance.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.get("/", async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
  const items = await Compliance.find(filter)
    .populate("client", "name clientCode")
    .populate("assignedTo", "name")
    .sort({ dueDate: 1 });
  const today = new Date();
  res.json(
    items.map((i) => {
      const x = i.toObject();
      if (
        ["Pending", "In Progress", "Waiting for Client"].includes(x.status) &&
        new Date(x.dueDate) < today
      )
        x.computedStatus = "Overdue";
      return x;
    }),
  );
});
router.post("/", allowRoles("admin"), async (req, res) => {
  try {
    res.status(201).json(await Compliance.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
router.put("/:id", async (req, res) => {
  const item = await Compliance.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  if (
    req.user.role !== "admin" &&
    String(item.assignedTo) !== String(req.user._id)
  )
    return res.status(403).json({ message: "Access denied" });
  const allowed =
    req.user.role === "admin"
      ? req.body
      : {
          status: req.body.status,
          remarks: req.body.remarks,
          acknowledgementNo: req.body.acknowledgementNo,
          filedOn: req.body.filedOn,
          documentChecklist: req.body.documentChecklist,
        };
  res.json(
    await Compliance.findByIdAndUpdate(req.params.id, allowed, {
      new: true,
      runValidators: true,
    }),
  );
});
export default router;

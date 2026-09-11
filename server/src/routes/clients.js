import express from "express";
import Client from "../models/Client.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
  const clients = await Client.find(filter)
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });
  res.json(clients);
});
router.post("/", allowRoles("admin"), async (req, res) => {
  try {
    res.status(201).json(await Client.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
router.put("/:id", async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ message: "Client not found" });
  if (
    req.user.role !== "admin" &&
    String(client.assignedTo) !== String(req.user._id)
  )
    return res.status(403).json({ message: "Access denied" });
  const safeBody =
    req.user.role === "admin"
      ? req.body
      : {
          status: req.body.status,
          notes: req.body.notes,
          nextFollowUp: req.body.nextFollowUp,
        };
  res.json(
    await Client.findByIdAndUpdate(req.params.id, safeBody, {
      new: true,
      runValidators: true,
    }),
  );
});
router.delete("/:id", allowRoles("admin"), async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
export default router;

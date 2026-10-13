import { Router } from "express";
const router = Router();
import { Notification } from "../models/index.js";
import { auth, loadUser } from "../middleware/auth.js";
import { wrap, isOwnerOrAdmin } from "../utils/helpers.js";

router.get("/:email", auth, loadUser, wrap(async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.email)) return res.status(403).json({ message: "Not allowed" });
  const list = await Notification.find({ email: req.params.email.toLowerCase() }).sort({ time: -1 }).limit(30);
  res.json(list.map((n) => ({ _id: n._id, message: n.message, actionRoute: n.actionRoute, time: n.time, read: !!n.read })));
}));

// mark everything as read (called when the bell is opened)
router.patch("/read/:email", auth, loadUser, wrap(async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.email)) return res.status(403).json({ message: "Not allowed" });
  await Notification.updateMany({ email: req.params.email.toLowerCase(), read: { $ne: true } }, { read: true });
  res.json({ ok: true });
}));

export default router;

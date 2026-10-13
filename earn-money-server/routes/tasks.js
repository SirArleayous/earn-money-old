import { Router } from "express";
const router = Router();
import mongoose from "mongoose";
import { User, Task, Submission } from "../models/index.js";
import { auth, loadUser, requireRole } from "../middleware/auth.js";
import { wrap, notify, notifyRoles, log, today, isOwnerOrAdmin, removeTask } from "../utils/helpers.js";
import { BUYER_FEE } from "../config/rules.js";

const text = (v, max) => typeof v === "string" && v.trim().length > 0 && v.length <= max;

router.param("id", (req, res, next, id) =>
  mongoose.isValidObjectId(id) ? next() : res.status(404).json({ message: "Task not found" }));

// Buyer creates a task: reward + 5% fee is deducted, reward is held in escrow
router.post("/", auth, loadUser, requireRole("Buyer"), wrap(async (req, res) => {
  const b = req.body || {};
  const workers = Number(b.required_workers), pay = Number(b.payable_amount);
  if (!text(b.task_title, 150) || !text(b.task_detail, 5000)) return res.status(400).json({ message: "Title and detail are required" });
  if (!Number.isInteger(workers) || workers < 1 || workers > 10000) return res.status(400).json({ message: "Workers must be 1-10000" });
  if (!Number.isInteger(pay) || pay < 1) return res.status(400).json({ message: "Reward per worker must be a whole number of coins" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.completion_date || "") || b.completion_date < today()) return res.status(400).json({ message: "Completion date must be today or later" });

  const reward = workers * pay, fee = Math.ceil(reward * BUYER_FEE), cost = reward + fee;
  const buyer = await User.findOneAndUpdate({ _id: req.user._id, coin: { $gte: cost } }, { $inc: { coin: -cost } }, { new: true });
  if (!buyer) return res.status(400).json({ message: `Not enough coins. This task needs ${cost} (incl. ${fee} fee).` });
  let task;
  try {
    task = await Task.create({
      task_title: b.task_title.trim(), task_detail: b.task_detail.trim(),
      submission_info: String(b.submission_info || "").slice(0, 500), task_image: String(b.task_image || ""),
      required_workers: workers, payable_amount: pay, completion_date: b.completion_date,
      buyer_email: req.user.email, buyer_name: req.user.name, escrow: reward, fee,
    });
  } catch (e) {
    await User.updateOne({ _id: req.user._id }, { $inc: { coin: cost } });
    throw e;
  }
  await log(req.user.email, "task.create", String(task._id), `${workers} x ${pay} coins, fee ${fee}`);
  // fire and forget: workers and admins are told straight away
  notifyRoles(["Worker"], `New task: "${task.task_title}" pays ${pay} coins.`, `/dashboard/taskDetails/${task._id}`, req.user.email).catch(() => {});
  notifyRoles(["Admin"], `${req.user.name} posted "${task.task_title}" (${workers} workers x ${pay} coins).`, "/dashboard/manageTasks", req.user.email).catch(() => {});
  res.status(201).json({ task, coin: buyer.coin, cost });
}));

// Worker directory: open tasks with free slots
router.get("/", auth, loadUser, wrap(async (req, res) => {
  const tasks = await Task.find({
    status: "Active", completion_date: { $gte: today() }, $expr: { $lt: ["$filled", "$required_workers"] },
  }).sort({ createdAt: -1 }).limit(200);
  const mine = new Set((await Submission.find({ worker_email: req.user.email }, "task_id")).map((s) => String(s.task_id)));
  res.json(tasks.map((t) => ({ ...t.toJSON(), submitted: mine.has(String(t._id)) })));
}));

const myTasks = wrap(async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.email)) return res.status(403).json({ message: "Not allowed" });
  res.json(await Task.find({ buyer_email: req.params.email.toLowerCase() }).sort({ createdAt: -1 }));
});
router.get("/buyer/:email", auth, loadUser, myTasks);
router.get("/my/:email", auth, loadUser, myTasks); // legacy path used by BuyerHome/MyTasks

router.get("/:id", auth, loadUser, wrap(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
}));

const owned = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404).json({ message: "Task not found" }); return null; }
  if (!isOwnerOrAdmin(req, task.buyer_email)) { res.status(403).json({ message: "Not allowed" }); return null; }
  return task;
};

router.patch("/:id", auth, loadUser, wrap(async (req, res) => {
  const task = await owned(req, res);
  if (!task) return;
  const b = req.body || {};
  const title = b.task_title ?? b.title, detail = b.task_detail ?? b.detail, info = b.submission_info ?? b.submissionInfo;
  if (title !== undefined) { if (!text(title, 150)) return res.status(400).json({ message: "Invalid title" }); task.task_title = title.trim(); }
  if (detail !== undefined) { if (!text(detail, 5000)) return res.status(400).json({ message: "Invalid detail" }); task.task_detail = detail.trim(); }
  if (info !== undefined) task.submission_info = String(info).slice(0, 500);
  const img = b.task_image ?? b.taskImage;
  if (img !== undefined) task.task_image = String(img).slice(0, 500);
  await task.save();
  res.json(task);
}));

router.delete("/:id", auth, loadUser, wrap(async (req, res) => {
  const task = await owned(req, res);
  if (!task) return;
  const r = await removeTask(task, false);
  if (r.error) return res.status(409).json({ message: r.error });
  await log(req.user.email, "task.delete", String(task._id), `refunded ${r.refunded}`);
  res.json(r);
}));

export default router;

import { Router } from "express";
const router = Router();
import mongoose from "mongoose";
import { User, Task, Submission } from "../models/index.js";
import { auth, loadUser, requireRole } from "../middleware/auth.js";
import { wrap, notify, log, today, isOwnerOrAdmin, withWorkerInfo } from "../utils/helpers.js";

// Worker submits proof (task data comes from the DB, not from the client)
router.post("/", auth, loadUser, requireRole("Worker"), wrap(async (req, res) => {
  const { task_id, submission_detail } = req.body || {};
  if (!mongoose.isValidObjectId(task_id)) return res.status(400).json({ message: "Invalid task" });
  if (typeof submission_detail !== "string" || !submission_detail.trim() || submission_detail.length > 3000)
    return res.status(400).json({ message: "Provide submission evidence (max 3000 characters)" });
  const task = await Task.findById(task_id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.completion_date < today()) return res.status(400).json({ message: "The deadline has passed" });

  const slot = await Task.findOneAndUpdate(
    { _id: task._id, status: "Active", $expr: { $lt: ["$filled", "$required_workers"] } },
    { $inc: { filled: 1 } });
  if (!slot) return res.status(409).json({ message: "No slots left for this task" });
  let sub;
  try {
    sub = await Submission.create({
      task_id: task._id, task_title: task.task_title, payable_amount: task.payable_amount,
      worker_id: req.user._id, worker_photo: req.user.photo,
      worker_email: req.user.email, worker_name: req.user.name,
      buyer_email: task.buyer_email, buyer_name: task.buyer_name, submission_detail: submission_detail.trim(),
    });
  } catch (e) {
    await Task.updateOne({ _id: task._id }, { $inc: { filled: -1 } });
    if (e.code === 11000) return res.status(409).json({ message: "You already submitted this task" });
    throw e;
  }
  const code = `WK-${String(req.user._id).slice(-6).toUpperCase()}`;
  await notify(task.buyer_email, `${req.user.name} (ID ${code}) submitted "${task.task_title}" for review.`, "/dashboard/tasksToReview");
  res.status(201).json((await withWorkerInfo([sub]))[0]);
}));

const byField = (field) => wrap(async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.email)) return res.status(403).json({ message: "Not allowed" });
  const q = { [field]: req.params.email.toLowerCase() };
  if (["Pending", "Approved", "Rejected"].includes(req.query.status)) q.status = req.query.status;
  res.json(await withWorkerInfo(await Submission.find(q).sort({ createdAt: -1 }).limit(500)));
});
router.get("/worker/:email", auth, loadUser, byField("worker_email"));
router.get("/buyer/:email", auth, loadUser, byField("buyer_email"));

// All submissions of one task (task owner or admin), with worker IDs
router.get("/task/:id", auth, loadUser, requireRole("Buyer", "Admin"), wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Task not found" });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (req.user.role !== "Admin" && task.buyer_email !== req.user.email) return res.status(403).json({ message: "Not allowed" });
  res.json(await withWorkerInfo(await Submission.find({ task_id: task._id }).sort({ createdAt: -1 }).limit(500)));
}));

// Buyer (or Admin) approves / rejects
router.patch("/status/:id", auth, loadUser, requireRole("Buyer", "Admin"), wrap(async (req, res) => {
  const { status } = req.body || {};
  if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Submission not found" });
  const sub = await Submission.findById(req.params.id);
  if (!sub) return res.status(404).json({ message: "Submission not found" });
  if (req.user.role !== "Admin" && sub.buyer_email !== req.user.email) return res.status(403).json({ message: "Not allowed" });
  if (sub.status !== "Pending") return res.status(409).json({ message: "Already reviewed" });

  if (status === "Rejected") {
    const done = await Submission.findOneAndUpdate({ _id: sub._id, status: "Pending" }, { status: "Rejected" }, { returnDocument: 'after' });
    if (!done) return res.status(409).json({ message: "Already reviewed" });
    await Task.updateOne({ _id: sub.task_id }, { $inc: { filled: -1 } }); // slot opens again
    await notify(sub.worker_email, `Your submission for "${sub.task_title}" was rejected.`, "/dashboard/mySubmission");
    await log(req.user.email, "submission.reject", String(sub._id), sub.worker_email);
    return res.json(done);
  }

  // Approve: 1) take coins out of task escrow  2) claim submission  3) pay worker
  const pay = sub.payable_amount;
  const task = await Task.findOneAndUpdate({ _id: sub.task_id, escrow: { $gte: pay } }, { $inc: { escrow: -pay, approved: 1 } }, { returnDocument: 'after' });
  if (!task) return res.status(409).json({ message: "Task funds unavailable (task removed?)" });
  const done = await Submission.findOneAndUpdate({ _id: sub._id, status: "Pending" }, { status: "Approved" }, { returnDocument: 'after' });
  if (!done) {
    await Task.updateOne({ _id: task._id }, { $inc: { escrow: pay, approved: -1 } });
    return res.status(409).json({ message: "Already reviewed" });
  }
  await User.updateOne({ email: sub.worker_email }, { $inc: { coin: pay } });
  if (task.approved >= task.required_workers) await Task.updateOne({ _id: task._id }, { status: "Completed" });
  await notify(sub.worker_email, `Your submission for "${sub.task_title}" was approved. +${pay} coins.`, "/dashboard/approvedSubmissions");
  await log(req.user.email, "submission.approve", String(sub._id), `${sub.worker_email} +${pay}`);
  res.json(done);
}));

export default router;

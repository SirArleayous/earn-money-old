import { Router } from "express";
const router = Router();
import mongoose from "mongoose";
import { User, Task, Submission, Withdrawal, Payment, Notification, ActivityLog } from "../models/index.js";
import { deleteAuthUser } from "../config/firebase.js";
import { wrap, log, removeTask, withWorkerInfo } from "../utils/helpers.js";
import { ADMIN_EMAIL } from "../config/rules.js";

// (auth + loadUser + requireRole("Admin") are applied in index.js)
const paging = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
};
const rx = (s) => new RegExp(String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
const list = async (Model, filter, req) => {
  const { page, limit, skip } = paging(req);
  const [items, total] = await Promise.all([
    Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Model.countDocuments(filter),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / limit)) };
};

// ---- live statistics ----
router.get("/stats", wrap(async (req, res) => {
  const since = new Date(Date.now() - 6 * 864e5);
  since.setUTCHours(0, 0, 0, 0);
  const series = async (Model, match = {}) => {
    const rows = await Model.aggregate([
      { $match: { createdAt: {$gte: since }, ...match } },
      { $group: { _id: {$dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, n: { $sum: 1 } } },
    ]);
    const m = Object.fromEntries(rows.map((r) => [r._id, r.n]));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(since.getTime() + i * 864e5).toISOString().slice(0, 10);
      return { date: d.slice(5), count: m[d] || 0 };
    });
  };
  const sum = async (Model, field, match = {}) => {
    const r = await Model.aggregate([{ $match: match }, { $group: { _id: null, t: {$sum: `$${field}` } } }]);
    return r[0]?.t || 0;
  };
  const [workers, buyers, admins, suspended, activeTasks, totalTasks, pending, approved, rejected,
    pendingWd, pendingWdCoins, paidUsd, topUps, topUpCount, circulating, escrow, cUsers, cSubs, cPay] = await Promise.all([
    User.countDocuments({ role: "Worker" }), User.countDocuments({ role: "Buyer" }), User.countDocuments({ role: "Admin" }),
    User.countDocuments({ suspended: true }),
    Task.countDocuments({ status: "Active" }), Task.countDocuments(),
    Submission.countDocuments({ status: "Pending" }), Submission.countDocuments({ status: "Approved" }), Submission.countDocuments({ status: "Rejected" }),
    Withdrawal.countDocuments({ status: "Pending" }), sum(Withdrawal, "withdrawal_coin", { status: "Pending" }),
    sum(Withdrawal, "withdrawal_amount", { status: "Approved" }),
    sum(Payment, "amount"), Payment.countDocuments(),
    sum(User, "coin"), sum(Task, "escrow"),
    series(User), series(Submission), series(Payment),
  ]);
  res.json({
    users: { total: workers + buyers + admins, workers, buyers, admins, suspended },
    tasks: { active: activeTasks, total: totalTasks },
    submissions: { pending, approved, rejected },
    withdrawals: { pending: pendingWd, pendingCoins: pendingWdCoins, paidUsd },
    payments: { totalUsd: topUps / 100, count: topUpCount },
    coins: { circulating, escrow },
    charts: { users: cUsers, submissions: cSubs, payments: cPay },
  });
}));

// ---- users ----
const listUsersFn = async (req, res) => {
  const f = {};
  if (req.query.search) f.$or = [{ name: rx(req.query.search) }, { email: rx(req.query.search) }];
  if (["Worker", "Buyer", "Admin"].includes(req.query.role)) f.role = req.query.role;
  res.json(await list(User, f, req));
};

// body: { role?, coinDelta? (or coin = new absolute balance), suspended? }
const updateUserFn = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "User not found" });
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: "User not found" });
  const { role, suspended, coinDelta, coin } = req.body || {};
  const protectedUser = target.email === ADMIN_EMAIL || target._id.equals(req.user._id);
  const set = {}, notes = [];
  if (role !== undefined) {
    if (!["Worker", "Buyer", "Admin"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    if (protectedUser && role !== "Admin") return res.status(400).json({ message: "You can't demote this admin" });
    set.role = role; notes.push(`role ${target.role} -> ${role}`);
  }
  if (suspended !== undefined) {
    if (protectedUser && suspended) return res.status(400).json({ message: "You can't suspend this admin" });
    set.suspended = !!suspended; notes.push(suspended ? "suspended" : "reactivated");
  }
  const delta = coinDelta !== undefined ? Number(coinDelta) : coin !== undefined ? Number(coin) - target.coin : 0;
  if (!Number.isInteger(delta) || Math.abs(delta) > 1e6) return res.status(400).json({ message: "Coins must be a whole number" });
  const update = {};
  if (Object.keys(set).length) update.$set = set;
  if (delta) { update.$inc = { coin: delta }; notes.push(`coins ${delta > 0 ? "+" : ""}${delta}`); }
  if (!Object.keys(update).length) return res.status(400).json({ message: "Nothing to update" });
  const filter = { _id: target._id };
  if (delta < 0) filter.coin = { $gte: -delta };
  const updated = await User.findOneAndUpdate(filter, update, { returnDocument: 'after' });
  if (!updated) return res.status(400).json({ message: "Balance can't go below 0" });

  // Broadcast user update via Socket.io to trigger instant frontend re-renders
  req.io?.emit("user:updated", updated);

  await log(req.user.email, "user.update", target.email, notes.join(", "));
  res.json(updated);
};
export const listUsers = wrap(listUsersFn);
export const updateUser = wrap(updateUserFn);
router.get("/users", listUsers);
router.patch("/users/:id", updateUser);

// Delete a user (profile + Firebase login). Blocked while money is still tied to them: suspend instead.
router.delete("/users/:id", wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "User not found" });
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: "User not found" });
  if (target.email === ADMIN_EMAIL || target._id.equals(req.user._id)) return res.status(400).json({ message: "You can't delete this admin" });
  const [fundedTasks, pendingWd, pendingSubs] = await Promise.all([
    Task.countDocuments({ buyer_email: target.email, escrow: { $gt: 0 } }),
    Withdrawal.countDocuments({ worker_email: target.email, status: "Pending" }),
    Submission.countDocuments({ worker_email: target.email, status: "Pending" }),
  ]);
  if (fundedTasks || pendingWd || pendingSubs)
    return res.status(409).json({ message: "User still has funded tasks, pending withdrawals or pending submissions. Resolve them first, or suspend the user instead." });
  await User.deleteOne({ _id: target._id });
  await Notification.deleteMany({ email: target.email });
  const authDeleted = await deleteAuthUser(target.email);
  await log(req.user.email, "user.delete", target.email, `${target.coin} coins discarded, login ${authDeleted ? "deleted" : "kept"}`);
  res.json({ deleted: true, authDeleted });
}));

// ---- tasks / submissions ----
router.get("/tasks", wrap(async (req, res) => {
  const f = {};
  if (req.query.search) f.$or = [{ task_title: rx(req.query.search) }, { buyer_email: rx(req.query.search) }];
  if (["Active", "Completed"].includes(req.query.status)) f.status = req.query.status;
  res.json(await list(Task, f, req));
}));

router.delete("/tasks/:id", wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Task not found" });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  const r = await removeTask(task, true);
  if (r.error) return res.status(409).json({ message: r.error });
  await log(req.user.email, "task.remove", `${task.task_title} (${task.buyer_email})`, `refunded ${r.refunded}`);
  res.json(r);
}));

router.get("/submissions", wrap(async (req, res) => {
  const f = {};
  if (["Pending", "Approved", "Rejected"].includes(req.query.status)) f.status = req.query.status;
  if (req.query.search) f.$or = [{ worker_email: rx(req.query.search) }, { buyer_email: rx(req.query.search) }, { task_title: rx(req.query.search) }];
  const r = await list(Submission, f, req);
  res.json({ ...r, items: await withWorkerInfo(r.items) });
}));

// ---- money & audit ----
router.get("/payments", wrap(async (req, res) => res.json(await list(Payment, {}, req))));
router.get("/activity", wrap(async (req, res) => res.json(await list(ActivityLog, {}, req))));

export default router;
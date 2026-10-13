import { User, Task, Submission, Notification, ActivityLog } from "../models/index.js";
import { ADMIN_EMAIL, BONUS } from "../config/rules.js";

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const pickRole = (r) => (["Buyer", "Client"].includes(r) ? "Buyer" : "Worker");
const notify = (email, message, actionRoute = "/dashboard") =>
  Notification.create({ email, message, actionRoute }).catch(() => {});
// Notify many people at once (one insert)
const notifyMany = async (emails, message, actionRoute = "/dashboard") => {
  const list = [...new Set(emails)].slice(0, 5000);
  if (!list.length) return;
  await Notification.insertMany(list.map((email) => ({ email, message, actionRoute })));
};
// Notify everyone with one of these roles (optionally skipping one email)
const notifyRoles = async (roles, message, actionRoute = "/dashboard", exceptEmail = "") => {
  const users = await User.find({ role: { $in: roles }, suspended: false }, "email").lean();
  await notifyMany(users.map((u) => u.email).filter((e) => e !== exceptEmail), message, actionRoute);
};
// Adds the worker's ID and photo to submissions (also works for older ones saved without them)
const withWorkerInfo = async (subs) => {
  const plain = subs.map((s) => (s.toJSON ? s.toJSON() : s));
  const missing = [...new Set(plain.filter((s) => !s.worker_id || !s.worker_photo).map((s) => s.worker_email))];
  const users = missing.length ? await User.find({ email: { $in: missing } }, "email photo").lean() : [];
  const byEmail = Object.fromEntries(users.map((u) => [u.email, u]));
  return plain.map((s) => {
    const u = byEmail[s.worker_email];
    const id = String(s.worker_id || u?._id || "");
    return { ...s, worker_id: id, worker_photo: s.worker_photo || u?.photo || "", worker_code: id ? `WK-${id.slice(-6).toUpperCase()}` : "" };
  });
};
const log = (actor, action, target = "", details = "") =>
  ActivityLog.create({ actor, action, target, details }).catch(() => {});
const today = () => new Date().toISOString().slice(0, 10);
const isOwnerOrAdmin = (req, email) =>
  req.user.role === "Admin" || req.user.email === String(email).toLowerCase();

async function createUser({ email, name, photo, role, autoCreated = false }) {
  const r = email === ADMIN_EMAIL ? "Admin" : pickRole(role);
  try {
    return await User.create({ email, name: name || email.split("@")[0], photo, role: r, coin: BONUS[r], autoCreated });
  } catch (e) {
    if (e.code === 11000) return User.findOne({ email });
    throw e;
  }
}

// Deletes a task and refunds unused escrow. force=true (admin) rejects pending submissions first.
async function removeTask(task, force = false) {
  const pending = await Submission.find({ task_id: task._id, status: "Pending" });
  if (pending.length && !force) return { error: `Review ${pending.length} pending submission(s) first.` };
  if (pending.length) {
    await Submission.updateMany({ task_id: task._id, status: "Pending" }, { status: "Rejected" });
    await Promise.all(pending.map((s) => notify(s.worker_email, `Your submission for "${task.task_title}" was rejected (task removed).`)));
  }
  const del = await Task.findOneAndDelete({ _id: task._id });
  if (!del) return { error: "Task already removed." };
  if (del.escrow > 0) await User.updateOne({ email: del.buyer_email }, { $inc: { coin: del.escrow } });
  await notify(del.buyer_email, `Task "${del.task_title}" was removed. ${del.escrow} unused coins refunded.`);
  return { refunded: del.escrow };
}

export { wrap, pickRole, notify, notifyMany, notifyRoles, withWorkerInfo, log, today, isOwnerOrAdmin, createUser, removeTask };

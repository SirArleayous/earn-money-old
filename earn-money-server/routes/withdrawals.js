import { Router } from "express";
const router = Router();
import mongoose from "mongoose";
import { User, Withdrawal } from "../models/index.js";
import { auth, loadUser, requireRole } from "../middleware/auth.js";
import { wrap, notify, log, isOwnerOrAdmin } from "../utils/helpers.js";
import { COIN_USD, MIN_WITHDRAW } from "../config/rules.js";

// Worker requests a withdrawal: coins are held immediately
router.post("/", auth, loadUser, requireRole("Worker"), wrap(async (req, res) => {
  const b = req.body || {};
  const coins = Number(b.withdrawal_coin);
  if (!Number.isInteger(coins) || coins < MIN_WITHDRAW) return res.status(400).json({ message: `Minimum withdrawal is ${MIN_WITHDRAW} coins` });
  if (typeof b.payment_system !== "string" || !b.payment_system.trim() || typeof b.account_number !== "string" || !b.account_number.trim())
    return res.status(400).json({ message: "Payment method and account number are required" });
  const user = await User.findOneAndUpdate({ _id: req.user._id, coin: { $gte: coins } }, { $inc: { coin: -coins } }, { returnDocument: 'after' });
  if (!user) return res.status(400).json({ message: "Insufficient coin balance" });
  let w;
  try {
    w = await Withdrawal.create({
      worker_email: req.user.email, worker_name: req.user.name, withdrawal_coin: coins,
      withdrawal_amount: +(coins * COIN_USD).toFixed(2),
      payment_system: b.payment_system.trim().slice(0, 50), account_number: b.account_number.trim().slice(0, 100),
    });
  } catch (e) {
    await User.updateOne({ _id: req.user._id }, { $inc: { coin: coins } });
    throw e;
  }
  await log(req.user.email, "withdrawal.request", String(w._id), `${coins} coins`);
  res.status(201).json({ withdrawal: w, coin: user.coin });
}));

router.get("/my/:email", auth, loadUser, wrap(async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.email)) return res.status(403).json({ message: "Not allowed" });
  res.json(await Withdrawal.find({ worker_email: req.params.email.toLowerCase() }).sort({ createdAt: -1 }).limit(100));
}));

// Admin: list + process
router.get("/", auth, loadUser, requireRole("Admin"), wrap(async (req, res) => {
  const q = ["Pending", "Approved", "Rejected"].includes(req.query.status) ? { status: req.query.status } : {};
  res.json(await Withdrawal.find(q).sort({ createdAt: -1 }).limit(200));
}));

router.patch("/:id", auth, loadUser, requireRole("Admin"), wrap(async (req, res) => {
  const { status } = req.body || {};
  if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Not found" });
  const w = await Withdrawal.findOneAndUpdate({ _id: req.params.id, status: "Pending" }, { status, processed_by: req.user.email }, { returnDocument: 'after' });
  if (!w) return res.status(409).json({ message: "Request not found or already processed" });
  if (status === "Rejected") await User.updateOne({ email: w.worker_email }, { $inc: { coin: w.withdrawal_coin } }); // refund
  await notify(w.worker_email, status === "Approved"
    ? `Your withdrawal of $${w.withdrawal_amount} was approved and paid.`
    : `Your withdrawal was rejected. ${w.withdrawal_coin} coins were returned.`);
  await log(req.user.email, `withdrawal.${status.toLowerCase()}`, String(w._id), `${w.worker_email} ${w.withdrawal_coin} coins`);
  res.json(w);
}));

export default router;

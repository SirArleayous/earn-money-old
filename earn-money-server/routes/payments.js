import "dotenv/config";
import StripeLib from "stripe";
import { Router } from "express";
const router = Router();
import crypto from "crypto";
import { User, Payment } from "../models/index.js";
import { auth, loadUser, requireRole } from "../middleware/auth.js";
import { wrap, notify, log, isOwnerOrAdmin } from "../utils/helpers.js";
import { PACKAGES } from "../config/rules.js";

const Stripe = process.env.STRIPE_SECRET_KEY ? new StripeLib(process.env.STRIPE_SECRET_KEY) : null;
const dummyOk = process.env.ALLOW_DUMMY_PAYMENTS === "true";

// price always comes from the server-side package list
const coinsFor = (b) => {
  const c = Number(b.coins);
  if (PACKAGES[c]) return c;
  const hit = Object.keys(PACKAGES).find((k) => PACKAGES[k] === Number(b.price));
  return hit ? Number(hit) : null;
};

export const intent = wrap(async (req, res) => {
  const coins = coinsFor(req.body || {});
  if (!coins) return res.status(400).json({ message: "Invalid package" });
  if (!Stripe) return res.json({ dummy: true, coins, price: PACKAGES[coins] });
  const pi = await Stripe.paymentIntents.create({
    amount: PACKAGES[coins] * 100, currency: "usd", automatic_payment_methods: { enabled: true },
    metadata: { email: req.user.email, coins: String(coins) },
  });
  res.json({ clientSecret: pi.client_secret, id: pi.id, coins, price: PACKAGES[coins] });
});

router.get("/history/:email", auth, loadUser, wrap(async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.email)) return res.status(403).json({ message: "Not allowed" });
  res.json(await Payment.find({ email: req.params.email.toLowerCase() }).sort({ createdAt: -1 }).limit(100));
}));

// Credit coins after a verified Stripe payment (or a dummy one when allowed)
router.post("/purchase", auth, loadUser, requireRole("Buyer"), wrap(async (req, res) => {
  const b = req.body || {};
  const coins = coinsFor(b);
  if (!coins) return res.status(400).json({ message: "Invalid package" });
  const price = PACKAGES[coins];
  let transactionId, dummy = false;
  if (Stripe) {
    const pi = await Stripe.paymentIntents.retrieve(String(b.paymentIntentId || ""));
    if (pi.status !== "succeeded" || pi.amount !== price * 100 || pi.metadata.email !== req.user.email)
      return res.status(400).json({ message: "Payment not verified" });
    transactionId = pi.id;
  } else if (dummyOk) {
    dummy = true;
    transactionId = "DUMMY_" + crypto.randomBytes(6).toString("hex").toUpperCase();
  } else {
    return res.status(503).json({ message: "Payments are not configured" });
  }
  let payment;
  try {
    payment = await Payment.create({
      email: req.user.email, name: req.user.name, coins, amount: price * 100,
      method: String(b.method || "card").slice(0, 30), transactionId, dummy,
    });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Payment already processed" });
    throw e;
  }
  const user = await User.findByIdAndUpdate(req.user._id, { $inc: { coin: coins } }, { returnDocument: 'after' });
  await notify(req.user.email, `${coins} coins added to your balance.`);
  await log(req.user.email, "payment.purchase", transactionId, `${coins} coins, $${price}${dummy ? " (dummy)" : ""}`);
  res.status(201).json({ payment, coin: user.coin });
}));

export default router;

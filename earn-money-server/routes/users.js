import { Router } from "express";
const router = Router();
import { User } from "../models/index.js";
import { auth, loadUser } from "../middleware/auth.js";
import { wrap, pickRole, createUser, isOwnerOrAdmin } from "../utils/helpers.js";
import { ADMIN_EMAIL, BONUS } from "../config/rules.js";

// Register / sync after Firebase sign-up
router.post(
  "/",
  auth,
  wrap(async (req, res) => {
    const b = req.body || {};
    if (b.email && String(b.email).toLowerCase() !== req.email) {
      return res.status(403).json({ message: "Email mismatch" });
    }

    // Explicitly validate chosen role ("Buyer" or "Worker")
    const requestedRole = pickRole(b.role);

    let user = await User.findOne({ email: req.email });
    console.log(`[users] sync ${req.email} | role sent: ${b.role} | ${user ? `existing profile (${user.role}, autoCreated: ${user.autoCreated})` : "new profile"}`);

    if (!user) {
      // Create new user with chosen role
      user = await createUser({
        email: req.email,
        name: b.name || req.token.name,
        photo: b.photo || req.token.picture,
        role: requestedRole,
      });

      // Broadcast user created event to all connected dashboard tabs
      req.io?.emit("user:created", user);
      return res.status(201).json(user);
    }

    if (user.suspended) {
      return res.status(403).json({ message: "Account suspended" });
    }

    if (user.autoCreated) {
      // Profile was auto-created by an earlier request; apply the role chosen at sign-up
      const role = user.email === ADMIN_EMAIL ? "Admin" : requestedRole;
      if (role !== user.role && user.coin === BONUS[user.role]) {
        user.coin = BONUS[role];
      }
      Object.assign(user, {
        role,
        name: b.name || user.name,
        photo: b.photo || user.photo,
        autoCreated: false,
      });
      await user.save();

      // Broadcast user update event to all connected dashboard tabs
      req.io?.emit("user:updated", user);
    }

    res.json(user);
  })
);

const self = (pick) => [
  auth,
  loadUser,
  wrap(async (req, res) => {
    if (!isOwnerOrAdmin(req, req.params.email)) {
      return res.status(403).json({ message: "Not allowed" });
    }
    const user =
      req.user.email === req.params.email.toLowerCase()
        ? req.user
        : await User.findOne({ email: req.params.email.toLowerCase() });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(pick(user));
  }),
];

router.get("/role/:email", ...self((u) => ({ role: u.role })));
router.get("/me/:email", ...self((u) => u));

export default router;

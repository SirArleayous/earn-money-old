import { verifyToken } from "../config/firebase.js";
import { User } from "../models/index.js";
import { ADMIN_EMAIL } from "../config/rules.js";
import { createUser } from "../utils/helpers.js";

// 1) verify Firebase ID token
const auth = async (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.token = await verifyToken(token);
    req.email = (req.token.email || "").toLowerCase();
    if (!req.email) return res.status(401).json({ message: "Token has no email" });
    next();
  } catch (e) {
    console.error("verifyIdToken failed:", e.code || e.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// 2) load (or auto-create) the DB user, block suspended accounts
const loadUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.email });
    if (!user) {
      user = await createUser({ email: req.email, name: req.token.name, photo: req.token.picture, role: "Worker", autoCreated: true });
    }
    if (user.email === ADMIN_EMAIL && user.role !== "Admin") {
      user.role = "Admin";
      await user.save();
    }
    if (user.suspended) return res.status(403).json({ message: "Account suspended" });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: "Not allowed" });

export { auth, loadUser, requireRole };

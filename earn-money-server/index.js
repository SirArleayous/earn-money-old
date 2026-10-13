import "dotenv/config"; // must be first so env vars exist before other modules load
import dns from "node:dns";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { auth, loadUser, requireRole } from "./middleware/auth.js";
import admin, { listUsers, updateUser } from "./routes/admin.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import submissionRoutes from "./routes/submissions.js";
import withdrawalRoutes from "./routes/withdrawals.js";
import paymentRoutes, { intent as createPaymentIntent } from "./routes/payments.js";
import notificationRoutes from "./routes/notifications.js";

// Some ISPs/routers/VPNs refuse the DNS SRV lookup that mongodb+srv:// needs
// ("querySrv ECONNREFUSED"). Use public DNS for Node's own lookups instead.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const origins = (process.env.CLIENT_ORIGINS || "http://localhost:5173").split(",").map((s) => s.trim());
// While developing, also accept localhost and private-network addresses
// (for example http://192.168.56.1:5173, the "Network" link Vite prints).
const devOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/;
const isProd = process.env.NODE_ENV === "production";
app.use(cors({ origin: (o, cb) => cb(null, !o || origins.includes(o) || (!isProd && devOrigin.test(o))) }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.send("SINEX-earn API running"));

const adminOnly = [auth, loadUser, requireRole("Admin")];
app.use("/api/admin", ...adminOnly, admin);
app.get("/api/users", ...adminOnly, listUsers);
app.patch("/api/users/role/:id", ...adminOnly, updateUser);

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/tasks", taskRoutes); // legacy paths still used by MyTasks.jsx
app.patch("/refillData/:email", (req, res) => res.json({ ok: true })); // refunds now happen server-side on delete
app.use("/api/submissions", submissionRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/payments", paymentRoutes);
app.post("/api/create-payment-intent", auth, loadUser, requireRole("Buyer"), createPaymentIntent);
app.use("/api/notifications", notificationRoutes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : "Server error" });
});

const { MONGO_URI, PORT = 5000 } = process.env;
if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 15000, family: 4 })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((e) => {
    console.error("MongoDB connection failed:", e.message);
    if (e.message.includes("querySrv")) console.error("DNS blocked: use the non-SRV (mongodb://) string from Atlas, or change your network/DNS.");
    if (/ServerSelection|timed out/i.test(e.message)) console.error("Check Atlas > Network Access: add your IP (or 0.0.0.0/0 for testing).");
    process.exit(1);
  });

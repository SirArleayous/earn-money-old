import axios from "axios";

// Flip to false to talk to the real backend again.
export const USE_MOCK = false;

const DB_KEY = "mockDb";
const readDb = () => {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || { users: {} }; }
  catch { return { users: {} }; }
};
const writeDb = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

// Offline avatar (no network needed)
const avatar = (name = "U") =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#00d7c0'/><text x='50%' y='56%' font-size='38' font-family='Arial' font-weight='bold' fill='#0f172a' text-anchor='middle'>${(name[0] || "U").toUpperCase()}</text></svg>`
  );

// localStorage.setItem("mockRole", "Admin" | "Buyer" | "Worker") then reload, to preview each dashboard.
const getUser = (email, db) => {
  const saved = db.users[email] || {};
  const name = saved.name || email.split("@")[0];
  return {
    _id: "mock-" + email,
    name,
    email,
    photo: saved.photo?.startsWith("data:") || saved.photo?.includes("ui-avatars") ? saved.photo : avatar(name),
    role: localStorage.getItem("mockRole") || saved.role || "Worker",
    coin: saved.coin ?? 150,
  };
};

const notifications = () => [
  { message: "Your submission was approved (+10 coins)", time: new Date().toISOString(), actionRoute: "/dashboard" },
  { message: "New task available: Subscribe to channel", time: new Date(Date.now() - 36e5).toISOString(), actionRoute: "/dashboard" },
  { message: "Withdrawal request received", time: new Date(Date.now() - 72e5).toISOString(), actionRoute: "/dashboard" },
];

// Unknown GETs return an array that also carries common stat fields,
// so both list pages (.map) and stat cards (.totalX) render something.
const sample = () =>
  Object.assign([], {
    totalUsers: 120, totalWorkers: 85, totalBuyers: 34, totalCoins: 5400, totalCoin: 5400,
    totalPayments: 860, totalPayment: 860, totalTask: 12, totalTasks: 12, totalSubmission: 24,
    totalSubmissions: 24, pendingTask: 6, pendingTasks: 6, pendingSubmission: 6, totalEarning: 340,
    totalEarnings: 340, totalPending: 6, totalPaymentAmount: 860,
  });

const handle = (method, path, body) => {
  const db = readDb();
  const email = decodeURIComponent(path.split("/").pop() || "");

  if (method === "post" && path === "/api/users") {
    db.users[body?.email] = body;
    writeDb(db);
    return { insertedId: "mock-id", acknowledged: true };
  }
  if (path.startsWith("/api/users/role/")) return { role: getUser(email, db).role };
  if (path.startsWith("/api/users/me/")) return getUser(email, db);
  if (path.startsWith("/api/notifications/")) return notifications();
  return method === "get" ? sample() : { success: true, acknowledged: true, modifiedCount: 1, insertedId: "mock-id" };
};

if (USE_MOCK) {
  const realAdapter = axios.getAdapter(axios.defaults.adapter);

  axios.defaults.adapter = async (config) => {
    const { pathname } = new URL(config.url || "", "http://mock.local/");
    if (!pathname.startsWith("/api/")) return realAdapter(config); // e.g. image upload

    let body = config.data;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { /* ignore */ } }

    const data = handle((config.method || "get").toLowerCase(), pathname, body);
    return { data, status: 200, statusText: "OK", headers: {}, config, request: {} };
  };
  console.info("[mock] Offline mock API is ON");
}
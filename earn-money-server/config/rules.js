import "dotenv/config";

// Business rules in one place. Change numbers here only.
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
export const BONUS = { Worker: 10, Buyer: 50, Admin: 0 }; // starting coins
export const COIN_USD = 0.05; // 1 coin = $0.05  ($1 = 20 coins)
export const MIN_WITHDRAW = 200; // coins
export const BUYER_FEE = 0.05; // 5% on top of task reward
export const PACKAGES = { 100: 10, 500: 45, 1000: 85, 2500: 200 }; // coins -> USD price

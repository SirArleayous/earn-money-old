import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCoins, FaCreditCard, FaHistory } from "react-icons/fa";

const PurchaseCoin = () => {
  const [selectedCoins, setSelectedCoins] = useState(100);
  const coinPackages = [
    { coins: 100, price: 10 },
    { coins: 500, price: 45 },
    { coins: 1000, price: 85 },
    { coins: 2500, price: 200 },
  ];

  // Mock payment history
  const paymentHistory = [
    { id: "TXN_99182", amount: "$10.00", coins: 100, status: "Completed", date: "2026-10-04" },
    { id: "TXN_88123", amount: "$45.00", coins: 500, status: "Completed", date: "2026-10-01" },
  ];

  const handlePurchase = (e) => {
    e.preventDefault();
    toast.success(`Successfully purchased ${selectedCoins} Coins!`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">
          Purchase <span className="text-[#00d7c0]">Task Coins</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Top up your client coin balance to create and fund worker task listings across the SINEX network.
        </p>
      </div>

      {/* Package Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coinPackages.map((pkg) => (
          <div
            key={pkg.coins}
            onClick={() => setSelectedCoins(pkg.coins)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer text-center space-y-2 ${
              selectedCoins === pkg.coins
                ? "bg-[#00d7c0]/10 border-[#00d7c0] shadow-xl shadow-[#00d7c0]/10"
                : "bg-[#111827]/80 border-slate-800 hover:border-slate-700"
            }`}
          >
            <FaCoins className="text-3xl text-[#00d7c0] mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{pkg.coins} Coins</h3>
            <p className="text-slate-400 text-xs font-semibold">${pkg.price} USD</p>
          </div>
        ))}
      </div>

      {/* Payment Form */}
      <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <FaCreditCard className="text-[#00d7c0]" />
          Checkout & Payment Details
        </h3>

        <form onSubmit={handlePurchase} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Selected Package</label>
              <input
                type="text"
                readOnly
                value={`${selectedCoins} Coins ($${coinPackages.find((p) => p.coins === selectedCoins)?.price || 10} USD)`}
                className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-3 text-[#00d7c0] font-bold outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
              <select className="w-full bg-[#0B0F19] border border-slate-800 text-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#00d7c0]">
                <option value="card">Credit / Debit Card</option>
                <option value="mobile_money">Mobile Money (MTN / Airtel)</option>
                <option value="crypto">Cryptocurrency (USDT)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#00d7c0]/20 cursor-pointer"
          >
            Complete Coin Top-Up
          </button>
        </form>
      </div>

      {/* Payment History Overview */}
      <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FaHistory className="text-[#00d7c0]" />
          Payment History Overview
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#0B0F19] text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Amount ($)</th>
                <th className="p-4">Coins Added</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paymentHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-400">{item.id}</td>
                  <td className="p-4 font-semibold text-white">{item.amount}</td>
                  <td className="p-4 font-bold text-[#00d7c0]">+{item.coins} Coins</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCoin;
import React, { useState } from "react";
import toast from "react-hot-toast";

const Withdrawals = () => {
  const [coins, setCoins] = useState("");
  const [account, setAccount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");

  const totalBalanceCoins = 250;
  const coinToUsdRate = 0.05; // Example conversion rate
  const usdAmount = (Number(coins) * coinToUsdRate).toFixed(2);

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (Number(coins) > totalBalanceCoins) {
      return toast.error("Insufficient coin balance!");
    }
    toast.success("Withdrawal request submitted successfully!");
    setCoins("");
    setAccount("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">
          SINEX Earnings <span className="text-[#00d7c0]">Withdrawal Hub</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Convert your earned reward coins into localized wallet balances fast and securely through our verified processing gateway.
        </p>
      </div>

      {/* Balance Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-[#111827] to-indigo-500/10 border border-[#00d7c0]/30 rounded-2xl p-6 text-center shadow-xl">
        <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold block">Available Reward Balance</span>
        <h3 className="text-4xl font-extrabold text-[#00d7c0] mt-1">
          UGX {totalBalanceCoins} <span className="text-xl text-slate-300 font-normal">({totalBalanceCoins} Coins)</span>
        </h3>
      </div>

      {/* Withdrawal Form */}
      <form onSubmit={handleWithdraw} className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">Coins To Withdraw</label>
            <input
              type="number"
              placeholder="Enter coin amount (e.g. 100)"
              value={coins}
              onChange={(e) => setCoins(e.target.value)}
              required
              className="w-full bg-[#0B0F19] border border-slate-800 focus:border-[#00d7c0] rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">Equivalent Amount ($ USD)</label>
            <input
              type="text"
              readOnly
              value={`$ ${usdAmount}`}
              className="w-full bg-[#0B0F19]/60 border border-slate-800 rounded-xl px-4 py-3 text-[#00d7c0] font-bold outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">Account / Wallet Number</label>
            <input
              type="text"
              placeholder="Enter phone or account number"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
              className="w-full bg-[#0B0F19] border border-slate-800 focus:border-[#00d7c0] rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">Payment Gateway Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#0B0F19] border border-slate-800 focus:border-[#00d7c0] rounded-xl px-4 py-3 text-slate-100 outline-none transition-all"
            >
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Crypto (USDT)">Crypto (USDT)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#00d7c0]/20 active:scale-[0.99]"
        >
          Request Withdrawal
        </button>
      </form>
    </div>
  );
};

export default Withdrawals;
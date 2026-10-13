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

  const input = "w-full bg-[#0B0F19] border border-slate-800 focus:border-[#00d7c0] rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all text-sm";
  const label = "text-xs font-semibold text-slate-300 block mb-1.5";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-white">My <span className="text-[#00d7c0]">Wallet</span></h2>
        <p className="text-slate-400 text-xs mt-1">Convert your reward coins into wallet balance fast and securely.</p>
      </div>

      {/* Summary card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#00d7c0] to-teal-700 text-slate-950 shadow-xl shadow-[#00d7c0]/10">
        <span className="text-sm font-semibold opacity-80 block">Available Reward Balance</span>
        <h3 className="text-4xl font-extrabold mt-1">
          UGX {totalBalanceCoins} <span className="text-base font-bold">({totalBalanceCoins} Coins)</span>
        </h3>
      </div>

      {/* Withdrawal form */}
      <form onSubmit={handleWithdraw} className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div>
          <label className={label}>Coins To Withdraw</label>
          <input type="number" placeholder="Enter coin amount (e.g. 100)" value={coins}
            onChange={(e) => setCoins(e.target.value)} required className={input} />
        </div>
        <div>
          <label className={label}>Equivalent Amount ($ USD)</label>
          <input type="text" readOnly value={`$ ${usdAmount}`}
            className="w-full bg-[#0B0F19]/60 border border-slate-800 rounded-xl px-4 py-3 text-[#00d7c0] font-bold outline-none cursor-not-allowed text-sm" />
        </div>
        <div>
          <label className={label}>Account / Wallet Number</label>
          <input type="text" placeholder="Enter phone or account number" value={account}
            onChange={(e) => setAccount(e.target.value)} required className={input} />
        </div>
        <div>
          <label className={label}>Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={input}>
            <option value="MTN Mobile Money">MTN Mobile Money</option>
            <option value="Airtel Money">Airtel Money</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Crypto (USDT)">Crypto (USDT)</option>
          </select>
        </div>
        <button type="submit"
          className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-[#00d7c0]/20 active:scale-[0.99]">
          Request Withdrawal
        </button>
      </form>
    </div>
  );
};

export default Withdrawals;
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { VscFileSubmodule } from "react-icons/vsc";
import { MdOutlinePendingActions, MdOutlineCheckCircle } from "react-icons/md";
import { RiCoinsLine } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaShieldAlt, FaGift, FaUserFriends, FaTelegramPlane } from "react-icons/fa";
import ApprovedSubmissions from "./ApprovedSubmissions";
import ApexCharts from "../../components/ApexCharts/ApexCharts";
import { ThemeContext } from "../../context/ThemeContext";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { myInfoContext } from "../../Layouts/DashBoardLayout";

const WorkerHome = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const ctx = useContext(myInfoContext);
  const [showBalance, setShowBalance] = useState(true);

  // Real submissions of this worker (same cache as the My Submissions page), refreshed every 8s
  const { data: myTotalSubmissions = [] } = useQuery({
    queryKey: ["my-submissions", user?.email],
    enabled: !!user?.email,
    refetchInterval: 8000,
    queryFn: async () => (await axiosSecure.get(`/api/submissions/worker/${user.email}`)).data,
  });

  const pendingSubmissions = myTotalSubmissions.filter((s) => s.status === "Pending");
  // PaymentCoin is kept so the Approved Submissions table can still read it
  const totalApprovedData = myTotalSubmissions
    .filter((s) => s.status === "Approved")
    .map((s) => ({ ...s, PaymentCoin: s.payable_amount }));

  const totalEarning = totalApprovedData.reduce((sum, s) => sum + (s.payable_amount || 0), 0);
  const balance = ctx?.myInfo?.coin ?? 0;
  const firstName = (ctx?.myInfo?.name || user?.displayName || "there").split(" ")[0];

  const tiles = [
    { label: "Submissions", value: myTotalSubmissions.length, icon: VscFileSubmodule, tone: "text-[#00d7c0] bg-[#00d7c0]/10 border-[#00d7c0]/20" },
    { label: "Pending", value: pendingSubmissions.length, icon: MdOutlinePendingActions, tone: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    { label: "Approved", value: totalApprovedData.length, icon: MdOutlineCheckCircle, tone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Earned (Coins)", value: totalEarning, icon: RiCoinsLine, tone: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  ];

  const soon = [
    { label: "Trust Score", icon: FaShieldAlt },
    { label: "Daily Spin", icon: FaGift },
    { label: "Referral", icon: FaUserFriends },
    { label: "Telegram", icon: FaTelegramPlane },
  ];

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <p className="text-slate-400 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-extrabold text-white">Hello, <span className="text-[#00d7c0]">{firstName}</span> 👋</h2>
      </div>

      {/* Balance card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#00d7c0] to-teal-700 text-slate-950 shadow-xl shadow-[#00d7c0]/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold opacity-80">Wallet balance</span>
          <button onClick={() => setShowBalance((v) => !v)} className="p-2 rounded-full bg-black/10" aria-label="Show or hide balance">
            {showBalance ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <p className="text-4xl font-extrabold mt-1">{showBalance ? balance : "••••"} <span className="text-lg font-bold">Coins</span></p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link to="/dashboard/withdrawals" className="text-center py-2.5 rounded-xl bg-slate-950 text-[#00d7c0] font-bold text-sm">Withdraw</Link>
          <Link to="/dashboard/taskLists" className="text-center py-2.5 rounded-xl bg-white/25 font-bold text-sm">Find Tasks</Link>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        {tiles.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl bg-[#111827]/90 border border-slate-800 p-4">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tone}`}>
              <Icon className="text-xl" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-3">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/dashboard/mySubmission" className="text-center py-3 rounded-2xl bg-[#111827] border border-slate-800 text-sm font-semibold text-slate-200">My Submissions</Link>
        <Link to="/dashboard/approvedSubmissions" className="text-center py-3 rounded-2xl bg-[#111827] border border-slate-800 text-sm font-semibold text-slate-200">Approved</Link>
      </div>

      {/* Placeholder cards (features not built yet) */}
      <div className="grid grid-cols-4 gap-2">
        {soon.map(({ label, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-[#111827]/70 border border-dashed border-slate-700 p-2.5 text-center opacity-80">
            <Icon className="mx-auto text-lg text-slate-400" />
            <p className="text-[10px] font-semibold text-slate-300 mt-1.5 leading-tight">{label}</p>
            <p className="text-[9px] text-slate-500">Soon</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-3xl bg-[#111827]/80 border border-slate-800 p-4">
        <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00d7c0]"></span>
          Performance Overview
        </h3>
        <ApexCharts theme="dark" />
      </div>

      {/* Latest approved */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">Latest Approved</h3>
          <Link to="/dashboard/approvedSubmissions" className="text-xs text-[#00d7c0] font-semibold">See all</Link>
        </div>
        <ApprovedSubmissions theme="dark" totalApprovedData={totalApprovedData.slice(0, 3)} />
      </div>
    </div>
  );
};

export default WorkerHome;
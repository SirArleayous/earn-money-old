import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { VscFileSubmodule } from "react-icons/vsc";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiCoinsLine } from "react-icons/ri";
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            SINEX Dashboard: <span className="text-[#00d7c0]">Earnings & Analytics</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Track your real-time task submissions, approval metrics, and coin balance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Analytics Chart & Submissions Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-200 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00d7c0]"></span>
              Performance Overview
            </h3>
            <ApexCharts theme="dark" />
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-xl text-center text-white mb-6">Approved Task Submissions</h3>
            <ApprovedSubmissions theme="dark" totalApprovedData={totalApprovedData} />
          </div>
        </div>

        {/* Right Column: Dark Modern Stat Cards */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Total Submissions */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a2336] border border-teal-500/30 shadow-xl shadow-teal-500/5 hover:border-[#00d7c0] transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300">Total Submissions</span>
              <div className="p-3 bg-[#00d7c0]/10 text-[#00d7c0] rounded-xl border border-[#00d7c0]/20">
                <VscFileSubmodule className="text-2xl" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-white tracking-tight">{myTotalSubmissions.length}</span>
              <span className="text-xs text-slate-400 block mt-1">All your task submissions</span>
            </div>
          </div>

          {/* Card 2: Pending Submissions */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a2336] border border-violet-500/30 shadow-xl shadow-violet-500/5 hover:border-violet-500 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300">Pending Submissions</span>
              <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
                <MdOutlinePendingActions className="text-2xl" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-white tracking-tight">{pendingSubmissions.length}</span>
              <span className="text-xs text-slate-400 block mt-1">Awaiting buyer verification</span>
            </div>
          </div>

          {/* Card 3: Total Earnings */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a2336] border border-emerald-500/30 shadow-xl shadow-emerald-500/5 hover:border-emerald-400 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300">Total Earnings (Coins)</span>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <RiCoinsLine className="text-2xl" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-[#00d7c0] tracking-tight">{totalEarning} Coins</span>
              <span className="text-xs text-slate-400 block mt-1">Wallet balance: {balance} coins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;
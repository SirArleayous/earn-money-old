import React, { useContext } from "react";
import { LuActivity } from "react-icons/lu";
import { MdOutlinePayment, MdOutlinePending } from "react-icons/md";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaPersonBreastfeeding } from "react-icons/fa6";
import { BsCashCoin, BsCoin } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import WithdrawRequests from "./WithdrawRequests";
import AdminRecharts from "../../components/Recharts/AdminRecharts";
import PieCircle from "../../components/ApexCharts/PieCircle";
import { ThemeContext } from "../../context/ThemeContext";
import { themed, Loader } from "./ui";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);

  // One live call replaces the old users/all + payments/all-history calls (refreshes every 15s)
  const { data: s, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await axiosSecure.get("/api/admin/stats")).data,
    refetchInterval: 15000,
  });

  if (isLoading) return <Loader />;
  if (isError || !s) return <p className="text-rose-400 text-center py-20">Could not load statistics. Is the backend running?</p>;

  const totalBuyers = s.users.buyers;
  const totalWorkers = s.users.workers;
  const totalCoins = s.coins.circulating;
  const totalUsdPayment = s.payments.totalUsd;

  const chart = s.charts.users.map((u, i) => ({
    date: u.date,
    "New users": u.count,
    Submissions: s.charts.submissions[i].count,
    "Top-ups": s.charts.payments[i].count,
  }));

  return (
    <div className={`p-8 ${theme === "light" ? "bg-[#f9fafc] text-black" : "dark:bg-black dark:text-white"}`}>
      <div className="lg:flex gap-4">
        <div className="lg:w-[70%]">
          <div className={`grid lg:grid-cols-2  p-8 shadow-xl rounded-xl gap-4 ${themed(theme)}`}>
            <div className="stats shadow text-white bg-gradient-to-r from-[#cf71f2] to-[#cf71f2]">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold text-2xl">Total Worker</div>
                <button className="font-bold text-2xl py-3 flex justify-center"><GrUserWorker></GrUserWorker></button>
                <div className="stat-value text-center">{totalWorkers}</div>
              </div>
            </div>
            <div className="stats shadow bg-gradient-to-r from-[#26dce3] text-white to-[#488bda]">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold text-2xl">Total Buyer</div>
                <button className="font-bold text-2xl py-3 flex justify-center"><FaPersonBreastfeeding></FaPersonBreastfeeding></button>
                <div className="stat-value text-center">{totalBuyers}</div>
              </div>
            </div>
            <div className="stats shadow bg-gradient-to-r from-[#fcc09e] text-white to-[#f99289]">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold text-2xl">Total Available Coin</div>
                <button className="font-bold text-2xl py-3 flex justify-center"><BsCoin></BsCoin></button>
                <div className="stat-value text-center ">{totalCoins}</div>
              </div>
            </div>
            <div className="stats shadow bg-gradient-to-r from-[#7464c9] text-white to-[#352d69]">
              <div className="stat">
                <div className="stat-title text-center font-bold text-white text-2xl">Total Payment</div>
                <button className="font-bold text-2xl py-3 flex justify-center"><BsCashCoin></BsCashCoin></button>
                <div className="stat-value text-center">{totalUsdPayment.toFixed(2)}$</div>
              </div>
            </div>

            {/* new live cards */}
            <div className="stats shadow bg-gradient-to-r from-[#193a98] to-[#070c2e] text-white">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold text-2xl">Active Tasks</div>
                <button className="font-bold text-2xl py-3 flex justify-center"><LuActivity></LuActivity></button>
                <div className="stat-value text-center">{s.tasks.active}</div>
                <div className="stat-desc text-center text-white/80">{s.tasks.total} in total</div>
              </div>
            </div>
            <div className="stats shadow bg-gradient-to-r from-[#20d6ef] to-[#0846da] text-white">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold text-2xl">Pending Submissions</div>
                <button className="font-bold text-2xl py-3 flex justify-center"><MdOutlinePending></MdOutlinePending></button>
                <div className="stat-value text-center">{s.submissions.pending}</div>
                <div className="stat-desc text-center text-white/80">{s.submissions.approved} approved · {s.submissions.rejected} rejected</div>
              </div>
            </div>
            <div className="stats shadow bg-gradient-to-r from-[#551f8b] to-[#1c172d] text-white">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold text-2xl">Pending Withdrawals</div>
                <button className="font-bold text-2xl py-3 flex justify-center"><MdOutlinePayment></MdOutlinePayment></button>
                <div className="stat-value text-center">{s.withdrawals.pending}</div>
                <div className="stat-desc text-center text-white/80">{s.withdrawals.pendingCoins} coins waiting</div>
              </div>
            </div>
            <div className="stats shadow bg-gradient-to-r from-[#f59e0b] to-[#b45309] text-white">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold text-2xl">Coins In Escrow</div>
                <button className="font-bold text-2xl py-3 flex justify-center"><BsCoin></BsCoin></button>
                <div className="stat-value text-center">{s.coins.escrow}</div>
                <div className="stat-desc text-center text-white/80">held for open tasks</div>
              </div>
            </div>
          </div>

          <div className={`mt-8 p-4 rounded-xl shadow-xl ${themed(theme)}`}>
            <AdminRecharts></AdminRecharts>
          </div>

          <div className={`mt-8 p-4 rounded-xl shadow-xl ${themed(theme)}`}>
            <h3 className="font-bold mb-3">Last 7 days</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <CartesianGrid stroke="#64748b33" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#0B0F19", border: "1px solid #1e293b", borderRadius: 12, color: "#e2e8f0" }} />
                  <Legend />
                  <Line type="monotone" dataKey="New users" stroke="#00d7c0" strokeWidth={2} />
                  <Line type="monotone" dataKey="Submissions" stroke="#818cf8" strokeWidth={2} />
                  <Line type="monotone" dataKey="Top-ups" stroke="#fbbf24" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-xl lg:w-[30%] ${themed(theme)}`}>
          <div className="py-6">
            <PieCircle></PieCircle>
          </div>
          <div className="p-4">
            <div className={`rounded-xl stat ${themed(theme)}`}>
              <div className="stat-title text-center">Referral Earnings</div>
              <div className="stat-value  text-center">$4.5K</div>
              <div className="stat-desc  text-center">↗︎ $500 (12%)</div>
            </div>

            <div className={`rounded-xl stat my-3 ${themed(theme)}`}>
              <div className="stat-title  text-center">Platform Revenue</div>
              <div className="stat-value  text-center">${totalUsdPayment.toFixed(2)}</div>
              <div className="stat-desc  text-center">All-time coin top-ups</div>
            </div>

            <div className={`rounded-xl stat ${themed(theme)}`}>
              <div className="stat-title text-center">Active Users</div>
              <div className="stat-value  text-center">{s.users.total - s.users.suspended}</div>
              <div className="stat-desc  text-center">{s.users.suspended} suspended</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-8 p-4 rounded-xl shadow-xl ${themed(theme)}`}>
        <WithdrawRequests theme={theme} onChanged={refetch}></WithdrawRequests>
      </div>
    </div>
  );
};

export default AdminHome;
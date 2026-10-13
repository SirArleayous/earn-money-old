import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { ThemeContext } from "../../context/ThemeContext";
import WithdrawRequests from "./WithdrawRequests";
import { themed, Loader, Pager, Tabs, fmtDate } from "./ui";

// Full page: the same withdrawal table as the dashboard, plus a coin top-up history tab
const ManageWithdrawals = () => {
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);
  const [tab, setTab] = useState("Withdrawals");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-topups", page],
    enabled: tab === "Top-ups",
    queryFn: async () => (await axiosSecure.get("/api/admin/payments", { params: { page } })).data,
    refetchInterval: 20000,
    placeholderData: (prev) => prev,
  });

  return (
    <div className={`min-h-screen p-6 ${themed(theme)}`}>
      <div className="w-[90%] mx-auto">
        <div className="py-10">
          <h2 className="font-bold text-center text-3xl">Withdrawals & Payments</h2>
          <p className="py-2 w-[50%] mx-auto text-center text-slate-400">
            Pay workers manually, then mark the request as paid. Rejecting returns the coins to the worker.
          </p>
        </div>
        <Tabs tabs={["Withdrawals", "Top-ups"]} value={tab} onChange={(t) => { setTab(t); setPage(1); }} />

        {tab === "Withdrawals" ? (
          <div className="pt-6"><WithdrawRequests theme={theme} /></div>
        ) : isLoading ? (
          <Loader />
        ) : (
          <div className="pt-6 overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl">
            <table className="table w-full text-left">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <tr className={` ${theme === "light" ? " text-black" : " text-white"}`}>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Coins</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data?.items.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4"><span className="font-bold block text-white">{p.name}</span><span className="text-xs text-slate-400">{p.email}</span></td>
                    <td className="px-6 py-4 font-semibold text-amber-400">+{p.coins}</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">${(p.amount / 100).toFixed(2)}</td>
                    <td className="px-6 py-4 text-cyan-400">{p.method}{p.dummy && <span className="ml-2 text-xs text-amber-500">(dummy)</span>}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">{p.transactionId}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{fmtDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data?.items.length && <p className="text-center opacity-60 py-8">No payments yet</p>}
            <Pager page={data?.page || 1} pages={data?.pages || 1} onChange={setPage} />
          </div>
        )}
        <div className="pb-10" />
      </div>
    </div>
  );
};

export default ManageWithdrawals;
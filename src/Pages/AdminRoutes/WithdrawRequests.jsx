import React, { useState } from "react";
import WithdrawalRequestTable from "./WithdrawalRequestTable";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { errMsg } from "./ui";

const WithdrawRequests = ({ theme, onChanged }) => {
  const axiosSecure = useAxiosSecure();
  const [status, setStatus] = useState("Pending");

  const { data: withdrawalRequests = [], refetch } = useQuery({
    queryKey: ["requests", status],
    queryFn: async () => (await axiosSecure.get("/api/withdrawals", { params: { status } })).data,
    refetchInterval: 20000,
  });

  // One call now: the server marks it paid and notifies the worker (coins were held at request time)
  const process = async (request, next) => {
    try {
      await axiosSecure.patch(`/api/withdrawals/${request._id}`, { status: next });
      toast.success(next === "Approved" ? "Withdraw payment is successful!!" : "Rejected, coins returned to the worker");
      refetch();
      onChanged?.();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  const handleApproval = (r) => {
    if (window.confirm(`Mark $${r.withdrawal_amount} to ${r.worker_email} as PAID? Send the money first (${r.payment_system}: ${r.account_number}).`))
      process(r, "Approved");
  };
  const handleReject = (r) => {
    if (window.confirm(`Reject and return ${r.withdrawal_coin} coins to ${r.worker_email}?`)) process(r, "Rejected");
  };

  return (
    <div className="w-full">
      <div className="w-11/12 mx-auto pb-10">
        <div className="flex justify-between items-center pb-6">
          <h3 className="font-bold text-xl text-white">Withdrawal Requests</h3>
          <select
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#00d7c0]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Paid</option>
            <option value="Rejected">Rejected</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
              <tr className={`${theme === "light" ? "text-black" : "text-white"}`}>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Withdraw Coin</th>
                <th className="px-6 py-4 font-semibold">Withdraw Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Account Number</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {withdrawalRequests.map((requests) => (
                <WithdrawalRequestTable
                  handleApproval={handleApproval}
                  handleReject={handleReject}
                  key={requests._id}
                  requests={requests}
                  theme={theme}
                ></WithdrawalRequestTable>
              ))}
            </tbody>
          </table>
          {!withdrawalRequests.length && (
            <p className="text-center text-slate-500 py-10 font-medium">Nothing here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawRequests;
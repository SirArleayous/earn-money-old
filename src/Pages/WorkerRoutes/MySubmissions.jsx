import React from "react";
import MySubmissionTable from "./MySubmissionTable";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

// Same row shape the old table component expects, filled with real data
const toRow = (s) => ({
  ...s,
  worker_detail: { name: s.worker_name, email: s.worker_email },
  buyer_detail: { name: s.buyer_name, email: s.buyer_email },
  current_date: s.createdAt,
  date: new Date(s.createdAt).toLocaleDateString(),
  PaymentCoin: s.payable_amount,
});

const MySubmissions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Real submissions from the server; refreshes every 8 seconds so approvals and rejections appear by themselves
  const { data: serverSubmissions = [] } = useQuery({
    queryKey: ["my-submissions", user?.email],
    enabled: !!user?.email,
    refetchInterval: 8000,
    queryFn: async () => (await axiosSecure.get(`/api/submissions/worker/${user.email}`)).data,
  });
  const allSubmissions = serverSubmissions.map(toRow);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">
          My Task <span className="text-[#00d7c0]">Submissions</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Track the review status of your task evidence submissions in real time across active SINEX campaigns.
        </p>
      </div>

      <div className="overflow-x-auto bg-[#111827]/90 border border-slate-800 rounded-2xl shadow-2xl p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0B0F19] border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
              <th className="p-4">Task Title</th>
              <th className="p-4">Submission Detail</th>
              <th className="p-4">Date</th>
              <th className="p-4">Reward</th>
              <th className="p-4">Status</th>
              <th className="p-4">Client Name</th>
              <th className="p-4">Client Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
            {allSubmissions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-500">
                  No submissions found. Complete a task from the Task Directory to view progress!
                </td>
              </tr>
            ) : (
              allSubmissions.map((mySubmit) => (
                <MySubmissionTable key={mySubmit._id} mySubmit={mySubmit} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MySubmissions;
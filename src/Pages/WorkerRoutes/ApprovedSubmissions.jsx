import React from "react";
import { useQuery } from "@tanstack/react-query";
import ApprovedSubmissionTable from "./ApprovedSubmissionTable";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

// Used in two places: inside WorkerHome (which passes totalApprovedData) and as its own page
// (/dashboard/approvedSubmissions), where it now loads the approved submissions by itself.
const ApprovedSubmissions = ({ totalApprovedData, theme }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const hasProp = totalApprovedData !== undefined;

  const { data: fetched = [] } = useQuery({
    queryKey: ["my-submissions", user?.email],
    enabled: !hasProp && !!user?.email,
    refetchInterval: 8000,
    queryFn: async () => (await axiosSecure.get(`/api/submissions/worker/${user.email}`)).data,
  });

  const rows = hasProp
    ? totalApprovedData
    : fetched.filter((s) => s.status === "Approved").map((s) => ({ ...s, PaymentCoin: s.payable_amount }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-extrabold text-3xl text-white">
          Approved <span className="text-[#00d7c0]">Submissions</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Review your verified task submissions that have passed buyer evaluation and received coin rewards.
        </p>
      </div>

      <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B0F19] border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <th className="p-4">Task Title</th>
                <th className="p-4">Payable Amount</th>
                <th className="p-4">Buyer Name</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500">
                    No approved submissions found yet.
                  </td>
                </tr>
              ) : (
                rows.map((approved, index) => (
                  <ApprovedSubmissionTable key={approved._id || index} approved={approved} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovedSubmissions;
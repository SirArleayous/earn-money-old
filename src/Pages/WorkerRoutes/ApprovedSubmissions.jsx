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
    <div className="space-y-4">
      {/* Page header only on the standalone page, not inside Home */}
      {!hasProp && (
        <div>
          <h2 className="text-2xl font-extrabold text-white">Approved <span className="text-[#00d7c0]">Submissions</span></h2>
          <p className="text-slate-400 text-xs mt-1">Verified work that passed buyer review and earned coins.</p>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="text-center py-8 text-slate-500 text-sm">No approved submissions found yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((approved, index) => (
            <ApprovedSubmissionTable key={approved._id || index} approved={approved} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedSubmissions;
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
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold text-white">My <span className="text-[#00d7c0]">Submissions</span></h2>
        <p className="text-slate-400 text-xs mt-1">Track the review status of your evidence in real time.</p>
      </div>

      {allSubmissions.length === 0 ? (
        <p className="text-center text-slate-500 py-12 text-sm">
          No submissions found. Complete a task from the Tasks tab to view progress!
        </p>
      ) : (
        <div className="space-y-3">
          {allSubmissions.map((mySubmit) => (
            <MySubmissionTable key={mySubmit._id} mySubmit={mySubmit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
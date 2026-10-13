import React from "react";

const MySubmissionTable = ({ mySubmit }) => {
  const {
    task_title,
    submission_detail,
    status = "Pending",
    current_date,
    date,
    payable_amount,
    buyer_name,
    buyer_email,
    buyer_detail,
  } = mySubmit || {};

  const clientName = buyer_detail?.name || buyer_name || "SINEX Client";
  const clientEmail = buyer_detail?.email || buyer_email || "client@sinex.com";

  let dateMDY = date || "N/A";
  if (current_date) {
    const d = new Date(current_date);
    if (!isNaN(d.getTime())) {
      dateMDY = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    }
  }

  const getStatusBadge = () => {
    if (status === "Approved") {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Approved
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
          Rejected
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
        Pending
      </span>
    );
  };

  return (
    <tr className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/60">
      <td className="p-4 font-semibold text-white">{task_title || "Untitled Task"}</td>
      <td className="p-4 max-w-xs truncate text-slate-400">
        {submission_detail ? String(submission_detail).slice(0, 30) + "..." : "N/A"}
      </td>
      <td className="p-4 text-xs text-slate-400">{dateMDY}</td>
      <td className="p-4 font-bold text-[#00d7c0]">{payable_amount || 0} Coins</td>
      <td className="p-4">{getStatusBadge()}</td>
      <td className="p-4 font-semibold text-slate-200">{clientName}</td>
      <td className="p-4 text-xs text-slate-500">{clientEmail}</td>
    </tr>
  );
};

export default MySubmissionTable;
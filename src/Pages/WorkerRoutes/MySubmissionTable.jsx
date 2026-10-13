import React from "react";

// Now renders one rounded card per submission (file name kept so imports don't change)
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

  const chip =
    status === "Approved"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : status === "Rejected"
      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
      : "bg-amber-500/10 text-amber-400 border-amber-500/30";

  return (
    <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-white text-sm leading-snug">{task_title || "Untitled Task"}</h3>
        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border shrink-0 ${chip}`}>{status}</span>
      </div>
      <p className="text-xs text-slate-400 break-words">
        {submission_detail ? String(submission_detail).slice(0, 60) + "..." : "N/A"}
      </p>
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        <span className="font-bold text-[#00d7c0]">{payable_amount || 0} Coins</span>
        <span className="text-slate-500">{dateMDY}</span>
      </div>
      <p className="text-[11px] text-slate-500">
        <span className="text-slate-300 font-semibold">{clientName}</span> · {clientEmail}
      </p>
    </div>
  );
};

export default MySubmissionTable;
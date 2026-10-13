import React from "react";

// Now renders one rounded card per approved submission (file name kept so imports don't change)
const ApprovedSubmissionTable = ({ approved }) => {
  const { task_title, buyer_detail, buyer_name, PaymentCoin, status } = approved || {};
  return (
    <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="font-semibold text-white text-sm truncate">{task_title}</h3>
        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{buyer_detail?.name || buyer_name}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-[#00d7c0] text-sm">+{PaymentCoin} coins</p>
        <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          {status}
        </span>
      </div>
    </div>
  );
};

export default ApprovedSubmissionTable;
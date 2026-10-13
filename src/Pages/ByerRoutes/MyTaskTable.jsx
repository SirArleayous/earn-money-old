import React from "react";

const MyTaskTable = ({ myTask, handleUpdate, handleDelete, theme }) => {
  const {
    _id,
    taskImage,
    task_image,
    title,
    task_title,
    detail,
    task_detail,
    worker,
    required_workers,
    totalPayment,
    payable_amount,
    PaymentCoin,
    submissionImage,
    completionDate,
    completion_date,
    filled,
    escrow,
  } = myTask || {};

  // Support both camelCase and snake_case field keys gracefully
  const displayTitle = title || task_title || "Untitled Task";
  const displayDetail = detail || task_detail || "";
  const displayWorker = Number(worker || required_workers) || 0;
  const displayPayable = Number(payable_amount) || 0;
  // all amounts are coins now
  const displayTotalPayment = totalPayment || displayPayable * displayWorker;
  const displayCoin = escrow ?? PaymentCoin ?? displayTotalPayment; // coins still held for this task
  const rawDate = completionDate || completion_date;
  const img = taskImage || task_image;

  // Safe date parsing (YYYY-MM-DD, no timezone shift)
  let dateMDY = "N/A";
  if (rawDate) {
    const [y, m, d] = String(rawDate).split("-");
    if (y && m && d) dateMDY = `${Number(d)}-${Number(m)}-${y}`;
  }

  return (
    <tr
      className={`border-b border-slate-800/60 ${
        theme === "light" ? "text-black" : "text-slate-200"
      }`}
    >
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12 bg-slate-800">
              <img
                src={img || "https://api.dicebear.com/7.x/identicon/svg?seed=Sinex"}
                alt="Task Thumbnail"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <div className="font-bold text-white">{displayTitle}</div>
          </div>
        </div>
      </td>
      {/* Safe slice operation using optional chaining */}
      <td className="max-w-xs truncate text-slate-400">
        {displayDetail ? String(displayDetail).slice(0, 20) + "..." : "No details"}
      </td>
      <td className="text-xs text-slate-400">{dateMDY}</td>
      <td>{displayWorker}</td>
      <td className="font-semibold text-[#00d7c0]">{displayPayable} coins</td>
      <td>{displayCoin}</td>
      <td>
        {submissionImage ? (
          <div className="avatar">
            <img className="h-10 w-10 rounded-full object-cover bg-slate-800" src={submissionImage} alt="Submission Proof" />
          </div>
        ) : (
          <span className="text-sm font-semibold">{filled ?? 0}/{displayWorker}</span>
        )}
      </td>
      <td className="font-bold text-white">{displayTotalPayment} coins</td>
      <th>
        <button
          onClick={() => handleUpdate?.(_id)}
          className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-[#00d7c0] text-slate-200 hover:text-slate-950 transition-all text-xs font-semibold cursor-pointer"
        >
          Update
        </button>
      </th>
      <th>
        <button
          onClick={() => handleDelete?.(_id, displayCoin)}
          className="py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
        >
          Delete
        </button>
      </th>
    </tr>
  );
};

export default MyTaskTable;
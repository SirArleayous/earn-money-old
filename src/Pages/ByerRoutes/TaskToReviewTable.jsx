import React from "react";

const badge = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Rejected: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

// The server does the approval and payment now, so this row only shows data and calls handleReview
const TaskToReviewTable = ({ taskReview, handleTaskReviewModal, handleReview, busy }) => {
  const { task_title, status, payable_amount, worker_name, worker_photo, worker_code, worker_id } = taskReview || {};
  const pending = status === "Pending";

  return (
    <tr className="">
      <td>
        <div className="flex items-center gap-3 py-2">
          {worker_photo ? (
            <img src={worker_photo} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
              {(worker_name || "?")[0]}
            </div>
          )}
          <div>
            <div className="font-bold">{worker_name}</div>
            <div className="text-xs opacity-60" title={worker_id}>ID: {worker_code || worker_id}</div>
          </div>
        </div>
      </td>

      <td>{task_title}</td>
      <td>{payable_amount} coins</td>
      <td>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${badge[status]}`}>{status}</span>
      </td>
      <th>
        <button onClick={() => handleTaskReviewModal(taskReview)} className="py-2 px-4 rounded-xl">
          Detail
        </button>
      </th>
      <th>
        {pending ? (
          <button
            disabled={busy}
            onClick={() => handleReview(taskReview, "Approved")}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            Approve
          </button>
        ) : (
          <span className="text-xs opacity-50">-</span>
        )}
      </th>
      <th>
        {pending ? (
          <button
            disabled={busy}
            onClick={() => handleReview(taskReview, "Rejected")}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            Reject
          </button>
        ) : (
          <span className="text-xs opacity-50">-</span>
        )}
      </th>
    </tr>
  );
};

export default TaskToReviewTable;
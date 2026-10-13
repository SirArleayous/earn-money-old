import React from "react";
import { Badge } from "./ui";

const ManageTaskTable = ({ manageTask, ManageTaskRemove }) => {
  const {
    _id, taskImage, task_image, title, detail, worker, totalPayment, coin,
    submissionImage, submission_info, completionDate, completion_date,
    buyer_email, filled, escrow, status,
  } = manageTask || {};

  // YYYY-MM-DD -> D-M-YYYY (same format as before, no timezone shift)
  const raw = completionDate || completion_date || "";
  const [y, m, d] = raw.split("-");
  const dateMDY = y ? `${Number(d)}-${Number(m)}-${y}` : "";
  const img = taskImage || task_image;

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              {img ? <img src={img} alt="Task" /> : <div className="h-12 w-12 bg-slate-500/30" />}
            </div>
          </div>
          <div>
            <div className="font-bold">{title}</div>
            <div className="text-sm opacity-50">{buyer_email}</div>
          </div>
        </div>
      </td>
      <td>{(detail || "").slice(0, 20)}..</td>
      <td>{dateMDY}</td>
      <td>{worker}</td>
      <td>
        {submissionImage ? (
          <img className="h-14 w-14 rounded-full object-cover" src={submissionImage} alt="Submission" />
        ) : (
          <span className="text-sm">{(submission_info || "").slice(0, 25)}</span>
        )}
      </td>
      <td>{totalPayment ?? coin}</td>
      <td>{filled}/{worker}</td>
      <td>{escrow}</td>
      <td><Badge status={status} /></td>
      <th>
        <button onClick={() => ManageTaskRemove(manageTask)} className="py-2 px-4 rounded-xl">delete</button>
      </th>
    </tr>
  );
};

export default ManageTaskTable;
import React from "react";

const badgeClass = { Pending: "badge-warning", Approved: "badge-accent text-white", Rejected: "badge-error text-white" };

const WithdrawalRequestTable = ({ requests, handleApproval, handleReject, theme }) => {
  const {
    account_number: accountNumber,
    worker_name: name,
    worker_email: email,
    payment_system: paymentMethod,
    withdrawal_amount: convertedUsd,
    withdrawal_coin: withdrawCoin,
    createdAt: withdrawalDate,
    status,
  } = requests || {};

  const date = new Date(withdrawalDate);
  const dateMDY = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

  return (
    <tr className={` ${theme === "light" ? " text-black" : " dark:text-white"}`}>
      <td>
        <div className="flex items-center gap-3">
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-sm opacity-50"></div>
          </div>
        </div>
      </td>
      <td>{email}</td>
      <td>{withdrawCoin}</td>
      <td>{convertedUsd}$</td>
      <td>
        {" "}
        <div className={`badge ${badgeClass[status] || "badge-accent text-white"}`}>{status === "Approved" ? "Paid" : status}</div>
      </td>

      <td>{accountNumber}</td>
      <td>{paymentMethod}</td>
      <td>{dateMDY}</td>
      <td>
        {status === "Pending" && (
          <div className="flex gap-2">
            <button onClick={() => handleApproval(requests)} className="bg-slate-700 rounded-full text-white px-4 py-2">
              Payment
            </button>
            <button onClick={() => handleReject(requests)} className="bg-rose-600 rounded-full text-white px-4 py-2">
              Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default WithdrawalRequestTable;
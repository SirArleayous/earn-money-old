import React from "react";
import { Badge } from "./ui";

const ManageUsersTable = ({ singleUser, handleUserDelete, handleManageRole, handleCoins, handleSuspend }) => {
  const { name, photo, email, role, coin, suspended } = singleUser || {};
  return (
    <tr className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/60">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-bold text-white">{name}</div>
            <div className="text-sm opacity-50">{suspended && <Badge status="Suspended" />}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {photo ? (
          <img className="w-10 h-10 rounded-full object-cover border border-slate-700" src={photo} alt={name || "Avatar"} />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
            {name ? name[0].toUpperCase() : "U"}
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-slate-400">{email}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            role === "Admin"
              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
              : role === "Buyer"
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          }`}
        >
          {role || "Worker"}
        </span>
      </td>

      <td className="px-6 py-4 font-semibold text-amber-400">{coin || 0}</td>
      <td className="px-6 py-4">
        {/* controlled to "" so it always shows the placeholder again */}
        <select
          value=""
          onChange={(e) => handleManageRole(e.target.value, singleUser)}
          className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00d7c0] w-full max-w-xs"
        >
          <option disabled value="">Update Role</option>
          <option value="Admin" className="bg-slate-900 text-white">Admin</option>
          <option value="Buyer" className="bg-slate-900 text-white">Buyer</option>
          <option value="Worker" className="bg-slate-900 text-white">Worker</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCoins(singleUser)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all"
          >
            ± Coins
          </button>
          <button
            onClick={() => handleSuspend(singleUser)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              suspended
                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20"
            }`}
          >
            {suspended ? "Reactivate" : "Suspend"}
          </button>
          <button
            onClick={() => handleUserDelete(singleUser)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ManageUsersTable;
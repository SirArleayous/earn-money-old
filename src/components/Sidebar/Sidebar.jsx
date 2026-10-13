import React from "react";
import { NavLink } from "react-router-dom";
import useRole from "../../Hooks/useRole";
import {
  FaHome,
  FaTasks,
  FaPlusCircle,
  FaHistory,
  FaUsers,
  FaWallet,
  FaCheckCircle,
  FaClipboardList,
  FaReceipt,
  FaShieldAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [role, isLoading] = useRole();

  // Role comes from the backend (the admin email is set on the server), so no email hack here
  const isAdmin = role === "Admin";
  const isBuyer = role === "Buyer" || role === "Client";
  const isWorker = !isAdmin && !isBuyer;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
      isActive
        ? "bg-[#00d7c0] text-slate-950 font-bold shadow-lg shadow-[#00d7c0]/20"
        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <div className="space-y-2 py-4">
      <NavLink to="/dashboard" end className={linkClass}>
        <FaHome className="text-lg" />
        <span>Dashboard</span>
      </NavLink>

      {isLoading && <p className="px-4 py-3 text-xs text-slate-500">Loading menu...</p>}

      {/* WORKER LINKS */}
      {!isLoading && isWorker && (
        <>
          <NavLink to="/dashboard/taskLists" className={linkClass}>
            <FaTasks className="text-lg" />
            <span>Task Directory</span>
          </NavLink>
          <NavLink to="/dashboard/mySubmission" className={linkClass}>
            <FaHistory className="text-lg" />
            <span>My Submissions</span>
          </NavLink>
          <NavLink to="/dashboard/approvedSubmissions" className={linkClass}>
            <FaCheckCircle className="text-lg" />
            <span>Approved Submissions</span>
          </NavLink>
          <NavLink to="/dashboard/withdrawals" className={linkClass}>
            <FaWallet className="text-lg" />
            <span>Withdrawals</span>
          </NavLink>
        </>
      )}

      {/* BUYER / CLIENT LINKS */}
      {!isLoading && isBuyer && (
        <>
          <NavLink to="/dashboard/addNewTasks" className={linkClass}>
            <FaPlusCircle className="text-lg" />
            <span>Add New Task</span>
          </NavLink>
          <NavLink to="/dashboard/myTasks" className={linkClass}>
            <FaTasks className="text-lg" />
            <span>My Tasks</span>
          </NavLink>
          <NavLink to="/dashboard/tasksToReview" className={linkClass}>
            <FaClipboardList className="text-lg" />
            <span>Tasks To Review</span>
          </NavLink>
          <NavLink to="/dashboard/purchaseCoin" className={linkClass}>
            <FaWallet className="text-lg" />
            <span>Purchase Coins</span>
          </NavLink>
          <NavLink to="/dashboard/paymentHistory" className={linkClass}>
            <FaReceipt className="text-lg" />
            <span>Payment History</span>
          </NavLink>
        </>
      )}

      {/* ADMIN LINKS */}
      {!isLoading && isAdmin && (
        <>
          <NavLink to="/dashboard/manageUsers" className={linkClass}>
            <FaUsers className="text-lg" />
            <span>Manage Users</span>
          </NavLink>
          <NavLink to="/dashboard/manageTasks" className={linkClass}>
            <FaTasks className="text-lg" />
            <span>Manage Tasks</span>
          </NavLink>
          <NavLink to="/dashboard/withdrawRequests" className={linkClass}>
            <FaShieldAlt className="text-lg" />
            <span>Withdrawal Requests</span>
          </NavLink>
          <NavLink to="/dashboard/activityLog" className={linkClass}>
            <FaHistory className="text-lg" />
            <span>Activity Log</span>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;
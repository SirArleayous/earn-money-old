import React from "react";
import { NavLink } from "react-router-dom";
import useRole from "../../Hooks/useRole";
import {
  FaHome, FaTasks, FaWallet, FaUser, FaHeadset, FaPlusCircle,
  FaClipboardList, FaCoins, FaUsers, FaMoneyCheckAlt, FaHistory,
} from "react-icons/fa";

// Bottom tab bar (replaces the old sidebar; the file name is kept so imports don't change)
const TABS = {
  worker: [
    { to: "/dashboard", label: "Home", icon: FaHome, end: true },
    { to: "/dashboard/taskLists", label: "Tasks", icon: FaTasks },
    { to: "/dashboard/withdrawals", label: "Wallet", icon: FaWallet },
    { to: "/dashboard/profile", label: "Profile", icon: FaUser },
    { to: "/contact", label: "Contact", icon: FaHeadset },
  ],
  client: [
    { to: "/dashboard", label: "Home", icon: FaHome, end: true },
    { to: "/dashboard/addNewTasks", label: "Post Task", icon: FaPlusCircle },
    { to: "/dashboard/myTasks", label: "My Tasks", icon: FaTasks },
    { to: "/dashboard/tasksToReview", label: "Review", icon: FaClipboardList },
    { to: "/dashboard/purchaseCoin", label: "Coins", icon: FaCoins },
  ],
  admin: [
    { to: "/dashboard", label: "Home", icon: FaHome, end: true },
    { to: "/dashboard/manageUsers", label: "Users", icon: FaUsers },
    { to: "/dashboard/manageTasks", label: "Tasks", icon: FaTasks },
    { to: "/dashboard/withdrawRequests", label: "Payouts", icon: FaMoneyCheckAlt },
    { to: "/dashboard/activityLog", label: "Log", icon: FaHistory },
  ],
};

const Sidebar = () => {
  const [role, isLoading] = useRole();

  // Role comes from the backend (the admin email is set on the server), so no email hack here
  const isAdmin = role === "Admin";
  const isBuyer = role === "Buyer" || role === "Client";
  const tabs = isAdmin ? TABS.admin : isBuyer ? TABS.client : TABS.worker;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/95 to-transparent">
      <div className="flex items-center justify-between bg-[#111827]/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-1.5 shadow-2xl">
        {isLoading ? (
          <p className="w-full text-center text-xs text-slate-500 py-3">Loading menu...</p>
        ) : (
          tabs.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-semibold transition-all ${
                  isActive
                    ? "bg-[#00d7c0] text-slate-950 shadow-lg shadow-[#00d7c0]/20"
                    : "text-slate-400 hover:text-white"
                }`
              }
            >
              <Icon className="text-lg" />
              <span>{label}</span>
            </NavLink>
          ))
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
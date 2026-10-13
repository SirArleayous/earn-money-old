import React, { useContext } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { MdOutlineNotificationsActive, MdOutlineLogout } from "react-icons/md";
import { FaMoon, FaSun } from "react-icons/fa";
import useRole from "../../Hooks/useRole";
import { BsCoin } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { ThemeContext } from "../../context/ThemeContext";

const DashboardNavbar = ({ myInfo }) => {
  const auth = useAuth();
  const { user } = auth;
  const axiosSecure = useAxiosSecure();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [role] = useRole();

  // Real notifications from the backend (no extra /api prefix)
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.email],
    enabled: !!user?.email,
    retry: 1,
    refetchInterval: 30000,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/notifications/${user.email}`);
      return Array.isArray(data) ? data : [];
    },
  });

  const handleProfileLogout = async () => {
    await (auth.userSignOut || auth.logOut)?.();
  };

  const updatedNotifications = notifications.map((notification) => {
    const date = new Date(notification.time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return { ...notification, time: `${hours}:${minutes}:${seconds}` };
  });

  const name = myInfo?.name || user?.displayName || "";
  const avatar = myInfo?.photo || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "user")}`;

  return (
    <header className="bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3 shadow-xl sticky top-0 z-30 flex justify-between items-center w-full">
      {/* Left Section: Status Badge */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#00d7c0] animate-pulse"></span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">SINEX Network Online</span>
      </div>

      {/* Right Section: Controls & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Real-time Coin Balance for Non-Admin */}
        {role !== "Admin" && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00d7c0]/10 border border-[#00d7c0]/30 rounded-xl">
            <BsCoin className="text-[#00d7c0] text-lg" />
            <span className="text-sm font-bold text-[#00d7c0] tracking-wide">
              {Number(myInfo?.coin ?? 0)} <span className="text-xs font-medium text-slate-300">Coins</span>
            </span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-slate-300 hover:text-white hover:bg-slate-800">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="badge badge-xs bg-[#00d7c0] text-slate-950 font-bold border-none indicator-item">
                {notifications.length}
              </span>
            </div>
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-[#111827] text-slate-200 border border-slate-800 rounded-2xl z-50 w-[280px] sm:w-[350px] mt-2 p-3 shadow-2xl space-y-1 max-h-80 overflow-y-auto">
            <div className="text-xs font-bold uppercase text-slate-400 px-3 py-2 border-b border-slate-800">Notifications</div>
            {!updatedNotifications.length && <p className="text-xs text-slate-500 px-3 py-4">No notifications yet</p>}
            {updatedNotifications.map((notification, index) => (
              <NavLink
                to={notification?.actionRoute || "/dashboard"}
                className="hover:bg-slate-800/80 rounded-xl px-3 py-2 flex gap-3 items-start transition-colors"
                key={index}
              >
                <div className="p-1.5 bg-[#00d7c0]/10 text-[#00d7c0] rounded-lg mt-0.5">
                  <MdOutlineNotificationsActive className="text-base" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">{notification?.message}</p>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{notification?.time}</span>
                </div>
              </NavLink>
            ))}
          </ul>
        </div>

        {/* Theme Switcher */}
        <button onClick={toggleTheme} className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          {theme === "dark" ? <FaSun size={18} className="text-amber-400" /> : <FaMoon size={18} />}
        </button>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="flex items-center gap-3 cursor-pointer p-1 rounded-xl hover:bg-slate-800/60 transition-all">
            <div className="w-9 h-9 rounded-full ring-2 ring-[#00d7c0]/40 overflow-hidden bg-slate-800 flex items-center justify-center">
              <img className="w-full h-full object-cover" src={avatar} alt="User Profile" />
            </div>
            <div className="hidden sm:block text-left pr-2">
              <span className="block text-sm font-semibold text-slate-200 leading-none">{name}</span>
              <span className="text-[11px] text-[#00d7c0] font-medium mt-1 block leading-none">{myInfo?.role || role}</span>
            </div>
          </div>

          <ul tabIndex={0} className="dropdown-content menu bg-[#111827] text-slate-200 border border-slate-800 rounded-2xl z-[50] w-60 p-2 shadow-2xl mt-2 space-y-1">
            <li className="px-3 py-2 border-b border-slate-800">
              <p className="font-bold text-slate-100">{name}</p>
              <span className="text-xs text-slate-400">{myInfo?.email || user?.email}</span>
            </li>

            <li>
              <NavLink to="/dashboard/profile" className="flex items-center gap-3 py-2 text-slate-300 hover:text-[#00d7c0] hover:bg-slate-800/80 rounded-xl">
                <CgProfile className="text-lg" />
                <span className="text-sm font-medium">Your Profile</span>
              </NavLink>
            </li>

            {role !== "Admin" && (
              <li className="px-3 py-2 flex justify-between items-center text-slate-300 bg-slate-900/60 rounded-xl my-1">
                <div className="flex items-center gap-2">
                  <BsCoin className="text-[#00d7c0]" />
                  <span className="text-xs font-semibold text-slate-400">Balance</span>
                </div>
                <span className="text-sm font-bold text-[#00d7c0]">{Number(myInfo?.coin ?? 0)} Coins</span>
              </li>
            )}

            <li onClick={handleProfileLogout}>
              <button className="flex items-center gap-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl w-full">
                <MdOutlineLogout className="text-lg" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
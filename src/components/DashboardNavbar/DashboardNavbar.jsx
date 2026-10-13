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
import logo from "../../assets/logo.png";

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
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2 min-w-0">
        <img src={logo} className="w-8 h-8 rounded-full border border-[#00d7c0]/50" alt="SINEX Logo" />
        <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white to-[#00d7c0] bg-clip-text text-transparent truncate">
          SINEX-earn
        </span>
      </NavLink>

      <div className="flex items-center gap-1.5">
        {role !== "Admin" && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00d7c0]/10 border border-[#00d7c0]/30 rounded-full">
            <BsCoin className="text-[#00d7c0] text-sm" />
            <span className="text-xs font-bold text-[#00d7c0]">{Number(myInfo?.coin ?? 0)}</span>
          </div>
        )}

        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm text-slate-300">
            <div className="indicator">
              <MdOutlineNotificationsActive className="text-xl" />
              <span className="badge badge-xs bg-[#00d7c0] text-slate-950 font-bold border-none indicator-item">
                {notifications.length}
              </span>
            </div>
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-[#111827] text-slate-200 border border-slate-800 rounded-2xl z-50 w-72 mt-2 p-3 shadow-2xl max-h-80 overflow-y-auto">
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

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="p-2 text-slate-300 hover:text-white rounded-full transition-all">
          {theme === "dark" ? <FaSun size={16} className="text-amber-400" /> : <FaMoon size={16} />}
        </button>

        {/* Profile */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="w-8 h-8 rounded-full ring-2 ring-[#00d7c0]/40 overflow-hidden bg-slate-800 cursor-pointer">
            <img className="w-full h-full object-cover" src={avatar} alt="User Profile" />
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-[#111827] text-slate-200 border border-slate-800 rounded-2xl z-[50] w-60 p-2 shadow-2xl mt-2 space-y-1">
            <li className="px-3 py-2 border-b border-slate-800">
              <p className="font-bold text-slate-100">{name}</p>
              <span className="text-xs text-slate-400">{myInfo?.email || user?.email}</span>
              <span className="text-[11px] text-[#00d7c0] font-medium">{myInfo?.role || role}</span>
            </li>
            <li>
              <NavLink to="/dashboard/profile" className="flex items-center gap-3 py-2 text-slate-300 hover:text-[#00d7c0] hover:bg-slate-800/80 rounded-xl">
                <CgProfile className="text-lg" />
                <span className="text-sm font-medium">Your Profile</span>
              </NavLink>
            </li>
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
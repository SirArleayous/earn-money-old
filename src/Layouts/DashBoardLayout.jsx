import { NavLink, Outlet } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import logo from "../assets/logo.png";

import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const myInfoContext = createContext();

const DashBoardLayout = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Socket.io real-time event sync across Client, Worker, and Admin tabs
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");

    const refreshAll = () => {
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries(["manageTasks"]);
      queryClient.invalidateQueries(["admin-stats"]);
      queryClient.invalidateQueries(["myInfo"]);
      queryClient.invalidateQueries(["user-role"]);
      queryClient.invalidateQueries(["requests"]);
      queryClient.invalidateQueries(["users"]);
    };

    socket.on("user:updated", refreshAll);
    socket.on("task:created", refreshAll);
    socket.on("task:deleted", refreshAll);
    socket.on("submission:created", refreshAll);
    socket.on("withdrawal:updated", refreshAll);

    return () => {
      socket.off("user:updated", refreshAll);
      socket.off("task:created", refreshAll);
      socket.off("task:deleted", refreshAll);
      socket.off("submission:created", refreshAll);
      socket.off("withdrawal:updated", refreshAll);
      socket.disconnect();
    };
  }, [queryClient]);

  // Real profile (role, coins) from the backend
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/users/me/${user.email}`)).data,
    refetchInterval: 3000,
  });

  const myInfo = {
    ...data,
    name: data?.name || user?.displayName,
    email: data?.email || user?.email,
    photo: data?.photo || user?.photoURL,
    coin: data?.coin ?? 0,
  };

  const InfoNav = { myInfo, isLoading, refetch };

  return (
    <myInfoContext.Provider value={InfoNav}>
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col lg:flex-row">
        {/* Fixed Width Sidebar for Large Screens */}
        <div className="lg:w-64 lg:min-h-screen bg-[#111827]/80 backdrop-blur-xl border-r border-slate-800/80 shadow-2xl flex-shrink-0 z-20">
          <div className="py-6 px-6 border-b border-slate-800/80 flex justify-between items-center">
            <NavLink to="/" className="flex gap-3 items-center group">
              <img src={logo} className="w-10 h-10 rounded-full border border-[#00d7c0]/50 group-hover:scale-105 transition-transform" alt="SINEX Logo" />
              <h2 className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white via-slate-200 to-[#00d7c0] bg-clip-text text-transparent">
                SINEX-earn
              </h2>
            </NavLink>

            {/* Mobile Drawer Button */}
            <div className="lg:hidden">
              <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="my-drawer" className="btn btn-ghost btn-square text-slate-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </label>
                </div>

                {/* Mobile Sidebar */}
                <div className="drawer-side fixed top-0 left-0 h-full w-full z-[60]">
                  <label htmlFor="my-drawer" className="drawer-overlay bg-black/70 backdrop-blur-sm"></label>
                  <div className="min-h-screen bg-[#0d131f] text-white w-[260px] p-4 border-r border-slate-800">
                    <Sidebar />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large Screen Sidebar */}
          <div className="lg:block hidden p-4">
            <Sidebar />
          </div>
        </div>

        {/* Main Dashboard Workspace */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-[#0B0F19]">
          <DashboardNavbar myInfo={myInfo} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0B0F19] via-[#0d1322] to-[#0B0F19]">
            <Outlet />
          </div>
        </div>
      </div>
    </myInfoContext.Provider>
  );
};

export default DashBoardLayout;
import { Outlet } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../components/Sidebar/Sidebar";

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
      {/* Phone shell: full width on phones, centered column on larger screens */}
      <div className="min-h-screen bg-[#05080f] flex justify-center">
        <div className="relative w-full max-w-lg min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col sm:border-x sm:border-slate-800/80">
          <DashboardNavbar myInfo={myInfo} />
          <main className="flex-1 px-4 pt-4 pb-28 overflow-x-hidden bg-gradient-to-b from-[#0B0F19] via-[#0d1322] to-[#0B0F19]">
            <Outlet />
          </main>
          <Sidebar />
        </div>
      </div>
    </myInfoContext.Provider>
  );
};

export default DashBoardLayout;
import React from "react";
import useRole from "../Hooks/useRole";
import useAuth from "../Hooks/useAuth";

import WorkerHome from "./WorkerRoutes/WorkerHome";
import BuyerHome from "./ByerRoutes/BuyerHome"; // Updated 'ByerRoutes' path
import AdminHome from "./AdminRoutes/AdminHome";

const DashboardHome = () => {
  const [role, isLoading] = useRole();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#00d7c0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAdmin = role === "Admin" || user?.email === "admin@sinex.com";

  if (isAdmin) {
    return <AdminHome />;
  }

  if (role === "Buyer") {
    return <BuyerHome />;
  }

  return <WorkerHome />;
};

export default DashboardHome;
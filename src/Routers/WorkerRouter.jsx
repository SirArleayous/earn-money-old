import React from "react";
import { Navigate } from "react-router-dom";
import useRole from "../Hooks/useRole";

const WorkerRouter = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg text-[#00d7c0]"></span>
      </div>
    );
  }

  if (role === "Worker") {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
};

export default WorkerRouter;
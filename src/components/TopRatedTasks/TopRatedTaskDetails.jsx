import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { ThemeContext } from "../../context/ThemeContext";

const TopRatedTaskDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [role, isRoleLoading] = useRole();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://earn-money-server-5.onrender.com";

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
      document.getElementById("login_required_modal")?.showModal();
    } else if (role && role !== "Worker" && role !== "User") {
      setShowLoginModal(true);
      document.getElementById("worker_required_modal")?.showModal();
    }
  }, [user, role]);

  const {
    data: taskDetail = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["topRatedTaskDetail", id],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/homePostedTasks`);
        const task = Array.isArray(data) ? data.find((t) => t._id === id) : {};
        return task || {};
      } catch (error) {
        console.error("Error fetching task details:", error);
        return {};
      }
    },
  });

  if (isLoading || isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  const {
    title,
    _id,
    detail,
    payment,
    worker,
    totalPayment,
    completionDate,
    taskImage,
    buyerInfo,
  } = taskDetail || {};

  let dateFormatted = "N/A";
  if (completionDate) {
    let date = new Date(completionDate);
    dateFormatted = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleDashboardRedirect = () => {
    navigate("/dashboard/taskLists");
  };

  return (
    <div
      className={`min-h-screen pt-20 ${
        theme === "light"
          ? "bg-[#f9fafc] text-black"
          : "dark:bg-black dark:text-white"
      }`}
    >
      <div className="w-[90%] mx-auto">
        <div className="py-8">
          <h2 className="font-bold text-center text-3xl">
            SINEX Task Details
          </h2>
          <p className="py-3 text-center md:w-[60%] mx-auto">
            Discover complete specifications for this campaign task, including worker requirements, reward payouts, and completion dates.
          </p>
        </div>
        <div className="lg:flex gap-4">
          <div className="card mb-10 shadow-xl duration-500 lg:w-[60%] mx-auto">
            <figure>
              <img
                className="w-full h-[350px] object-cover"
                src={taskImage}
                alt={title || "Task"}
              />
            </figure>
            <div className="card-body">
              <div className="">
                <h2 className="font-bold text-xl">{title}</h2>
                <p className="py-2">{detail}</p>
                <p className="py-2">
                  <span className="font-bold text-xl mr-2">
                    Completion Date:
                  </span>
                  {dateFormatted}
                </p>
                <p className="py-2">
                  <span className="font-bold text-xl">
                    Required Workers:
                  </span>
                  <span className="btn ml-2">{worker}</span>
                </p>
                <p className="py-2 border-b pb-6">
                  <span className="font-bold text-xl">Reward Payment:</span>
                  <span className="btn ml-2">{payment}.00$</span>
                </p>
              </div>

              {user && (role === "Worker" || role === "User") ? (
                <div className="mt-4">
                  <button
                    onClick={handleDashboardRedirect}
                    className="btn bg-[#00d7c0] hover:bg-[#00bfa8] text-slate-950 font-bold border-none"
                  >
                    Go to Task Directory
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={() =>
                      document
                        .getElementById(user ? "worker_required_modal" : "login_required_modal")
                        ?.showModal()
                    }
                    className="btn bg-[#00d7c0] hover:bg-[#00bfa8] text-slate-950 font-bold border-none"
                  >
                    Apply for Task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <dialog id="login_required_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg text-black">Login Required!</h3>
          <p className="py-4 text-black">
            You need to log in as a user to view and execute this task.
          </p>
          <div className="modal-action">
            <button className="btn">Close</button>
            <button
              onClick={handleLoginRedirect}
              className="btn bg-[#00d7c0] hover:bg-[#00bfa8] text-slate-950 font-bold border-none"
            >
              Login Now
            </button>
          </div>
        </form>
      </dialog>

      {/* Role Required Modal */}
      <dialog id="worker_required_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg text-black">User Account Required!</h3>
          <p className="py-4 text-black">
            You are logged in with a client profile. Please switch or access your worker account to apply for tasks.
          </p>
          <div className="modal-action">
            <button className="btn">Close</button>
            <button
              onClick={handleDashboardRedirect}
              className="btn bg-[#00d7c0] hover:bg-[#00bfa8] text-slate-950 font-bold border-none"
            >
              Go to Dashboard
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default TopRatedTaskDetails;
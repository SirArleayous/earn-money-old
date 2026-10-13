import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { myInfoContext } from "../../Layouts/DashBoardLayout";
import TaskToReviewTable from "./TaskToReviewTable";
import TaskReviewDetailsModal from "./TaskReviewDetailsModal";

const TABS = ["Pending", "Approved", "Rejected", "All"];

const TaskToReview = ({ workerRefetch }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const ctx = useContext(myInfoContext);
  const [tab, setTab] = useState("Pending");
  const [viewId, setViewId] = useState(null);
  const [busyId, setBusyId] = useState("");

  // Real submissions from the server (the old page read copies saved in the browser). Refreshes every 8 seconds.
  const { data: tasksReview = [], isLoading } = useQuery({
    queryKey: ["buyer-submissions", user?.email],
    enabled: !!user?.email,
    refetchInterval: 8000,
    queryFn: async () => (await axiosSecure.get(`/api/submissions/buyer/${user.email}`)).data,
  });

  const counts = {
    Pending: tasksReview.filter((s) => s.status === "Pending").length,
    Approved: tasksReview.filter((s) => s.status === "Approved").length,
    Rejected: tasksReview.filter((s) => s.status === "Rejected").length,
    All: tasksReview.length,
  };
  const displayReviews = tab === "All" ? tasksReview : tasksReview.filter((s) => s.status === tab);
  const reviewDetail = tasksReview.find((s) => s._id === viewId) || null;

  const handleTaskReviewModal = (item) => {
    setViewId(item._id);
    document.getElementById("review_modal")?.showModal();
  };

  // One call: the server pays the worker (or reopens the slot) and sends the notification.
  // Returns true when it worked.
  const handleReview = async (sub, status) => {
    const ask =
      status === "Approved"
        ? `Approve ${sub.worker_name}'s work? ${sub.payable_amount} coins will be paid to them.`
        : `Reject this submission from ${sub.worker_name}? The slot opens again for other workers.`;
    if (!window.confirm(ask)) return false;
    setBusyId(sub._id);
    try {
      await axiosSecure.patch(`/api/submissions/status/${sub._id}`, { status });
      toast.success(status === "Approved" ? "Approved. The worker has been paid." : "Submission rejected.");
      ["buyer-submissions", "my-submissions", "myTasks", "addedTasks", "totalWorkers", "open-tasks", "admin-stats"].forEach((k) =>
        queryClient.invalidateQueries({ queryKey: [k] })
      );
      workerRefetch?.();
      ctx?.refetch?.();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update this submission");
      return false;
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 mb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">
          Tasks <span className="text-[#00d7c0]">To Review</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Evaluate submitted evidence proof from workers and approve coin payouts.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${tab === t ? "bg-[#00d7c0] text-slate-950" : "bg-slate-800 text-slate-300"}`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-[#111827]/90 border border-slate-800 rounded-2xl shadow-2xl p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0B0F19] border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
              <th className="p-4">Worker Name</th>
              <th className="p-4">Task Title</th>
              <th className="p-4">Payable Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Submission Detail</th>
              <th className="p-4">Approval</th>
              <th className="p-4">Rejection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-500">Loading...</td>
              </tr>
            ) : displayReviews.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-500">
                  {tab === "Pending" ? "No worker submissions pending review." : "Nothing here."}
                </td>
              </tr>
            ) : (
              displayReviews.map((taskReview) => (
                <TaskToReviewTable
                  key={taskReview._id}
                  busy={busyId === taskReview._id}
                  handleTaskReviewModal={handleTaskReviewModal}
                  handleReview={handleReview}
                  taskReview={taskReview}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <TaskReviewDetailsModal reviewDetail={reviewDetail} handleReview={handleReview} />
    </div>
  );
};

export default TaskToReview;
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const TaskDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submissionDetail, setSubmissionDetail] = useState("");
  const [busy, setBusy] = useState(false);

  // The real task from the server (the old page showed a fake task whatever you clicked)
  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => (await axiosSecure.get(`/api/tasks/${id}`)).data,
    refetchInterval: 15000,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionDetail.trim()) return toast.error("Please provide submission evidence.");
    setBusy(true);
    try {
      // the server fills in the task, buyer and worker details itself
      await axiosSecure.post("/api/submissions", { task_id: id, submission_detail: submissionDetail });
      toast.success("Task submission recorded successfully!");
      setSubmissionDetail("");
      ["my-submissions", "open-tasks", "task"].forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
      navigate("/dashboard/mySubmission");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg"></span></div>;
  if (isError || !task) return <p className="text-center text-rose-400 py-20">Task not found. It may have been removed.</p>;

  const slotsLeft = Math.max(0, task.required_workers - task.filled);
  const closed = slotsLeft === 0 || task.completion_date < new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <Link to="/dashboard/taskLists" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#00d7c0]">
        <FaArrowLeft /><span>Back to Tasks</span>
      </Link>

      <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${closed ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-[#00d7c0] bg-[#00d7c0]/10 border-[#00d7c0]/20"}`}>
              {closed ? "Closed" : "Active"}
            </span>
            <h2 className="text-xl font-extrabold text-white mt-3 leading-snug">{task.task_title}</h2>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-extrabold text-[#00d7c0]">{task.payable_amount}</span>
            <span className="block text-[10px] text-slate-400">coins / approval</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-[11px]">
          <div><span className="text-slate-500 block">Created by</span><strong className="text-slate-200">{task.buyer_name}</strong></div>
          <div><span className="text-slate-500 block">Slots</span><strong className="text-slate-200">{slotsLeft}/{task.required_workers} open</strong></div>
          <div><span className="text-slate-500 block">Deadline</span><strong className="text-slate-200">{task.completion_date}</strong></div>
        </div>
      </div>

      <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-3">
        <h3 className="text-base font-bold text-white">Instructions</h3>
        {task.task_image && <img src={task.task_image} alt="" className="rounded-2xl max-h-60 w-full object-cover" />}
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{task.task_detail}</p>
        <div className="p-3 bg-[#0B0F19] border border-slate-800 rounded-xl text-xs text-slate-400">
          <strong className="text-[#00d7c0] block mb-1">Required Proof:</strong>
          {task.submission_info}
        </div>
      </div>

      {closed ? (
        <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 text-center text-slate-400 text-sm">
          This task is closed (no slots left or the deadline has passed).
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Submit Evidence</h3>
          <textarea
            rows="5"
            placeholder="Paste your proof URL or detail explanation here..."
            value={submissionDetail}
            onChange={(e) => setSubmissionDetail(e.target.value)}
            required
            className="w-full bg-[#0B0F19] border border-slate-800 focus:border-[#00d7c0] rounded-2xl p-4 text-slate-100 placeholder-slate-600 outline-none text-sm resize-none"
          ></textarea>
          <button type="submit" disabled={busy}
            className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-[#00d7c0]/20 active:scale-[0.99] disabled:opacity-50">
            {busy ? "Submitting..." : "Submit Evidence"}
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskDetails;
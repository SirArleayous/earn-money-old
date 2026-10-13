import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaCoins, FaUsers, FaArrowRight, FaFilter } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const TaskList = () => {
  const axiosSecure = useAxiosSecure();
  const [sortOrder, setSortOrder] = useState("");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["open-tasks"],
    queryFn: async () => (await axiosSecure.get("/api/tasks")).data,
    refetchInterval: 8000, // new tasks from clients appear within a few seconds
  });

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOrder === "high") return b.payable_amount - a.payable_amount;
    if (sortOrder === "low") return a.payable_amount - b.payable_amount;
    return 0;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Earn <span className="text-[#00d7c0]">Tasks</span></h2>
          <p className="text-slate-400 text-xs mt-1">Complete tasks accurately to grow your coin balance.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] border border-slate-800 rounded-xl px-3 py-2 shrink-0">
          <FaFilter className="text-[#00d7c0] text-xs" />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-medium outline-none cursor-pointer">
            <option value="" className="bg-[#111827]">Sort</option>
            <option value="high" className="bg-[#111827]">Highest reward</option>
            <option value="low" className="bg-[#111827]">Lowest reward</option>
          </select>
        </div>
      </div>

      {isLoading && <div className="flex justify-center py-16"><span className="loading loading-ring loading-lg"></span></div>}
      {!isLoading && !tasks.length && <p className="text-center text-slate-500 py-16">No open tasks right now. Check back soon.</p>}

      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div key={task._id} className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-base text-white leading-snug">{task.task_title}</h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00d7c0]/10 text-[#00d7c0] border border-[#00d7c0]/30 text-xs font-bold rounded-full shrink-0">
                <FaCoins />{task.payable_amount}
              </span>
            </div>
            <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{task.task_detail}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold">
                <FaUsers />{task.slots_left} slots left
              </span>
              <span className="text-slate-500">By <strong className="text-slate-300">{task.buyer_name}</strong></span>
            </div>
            {task.submitted ? (
              <div className="w-full text-center py-2.5 rounded-xl bg-slate-800 text-slate-400 text-sm font-semibold">Already submitted</div>
            ) : (
              <Link to={`/dashboard/taskDetails/${task._id}`}
                className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2">
                <span>View Task</span>
                <FaArrowRight className="text-xs" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
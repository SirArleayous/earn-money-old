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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Available Task <span className="text-[#00d7c0]">Directory</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Explore verified micro-tasks across active campaigns. Complete requirements accurately to build your coin balance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#111827] border border-slate-800 rounded-xl px-3 py-2 text-slate-300">
          <FaFilter className="text-[#00d7c0] text-sm" />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-slate-200 text-sm font-medium outline-none cursor-pointer">
            <option value="" className="bg-[#111827] text-slate-200">Sort By Reward</option>
            <option value="high" className="bg-[#111827] text-slate-200">Highest Reward First</option>
            <option value="low" className="bg-[#111827] text-slate-200">Lowest Reward First</option>
          </select>
        </div>
      </div>

      {isLoading && <div className="flex justify-center py-16"><span className="loading loading-ring loading-lg"></span></div>}
      {!isLoading && !tasks.length && <p className="text-center text-slate-500 py-16">No open tasks right now. Check back soon.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTasks.map((task) => (
          <div key={task._id}
            className="bg-[#111827]/90 backdrop-blur-xl border border-slate-800 hover:border-[#00d7c0]/50 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1 group">
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-white group-hover:text-[#00d7c0] transition-colors leading-snug">{task.task_title}</h3>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00d7c0]/10 text-[#00d7c0] border border-[#00d7c0]/30 text-xs font-bold rounded-full">
                <FaCoins />
                <span>{task.payable_amount} Coins</span>
              </div>
              <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">{task.task_detail}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FaUsers className="text-slate-500" />
                  <strong className="text-slate-200">{task.slots_left} slots left</strong>
                </span>
                <span className="text-slate-500">By: <strong className="text-slate-300">{task.buyer_name}</strong></span>
              </div>

              {task.submitted ? (
                <div className="w-full text-center py-2.5 rounded-xl bg-slate-800 text-slate-400 text-sm font-semibold">Already submitted</div>
              ) : (
                <Link to={`/dashboard/taskDetails/${task._id}`}
                  className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-[#00d7c0]/10 flex items-center justify-center gap-2">
                  <span>View Task Details</span>
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
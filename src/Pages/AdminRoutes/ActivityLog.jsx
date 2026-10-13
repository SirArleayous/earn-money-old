import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { ThemeContext } from "../../context/ThemeContext";
import { themed, Loader, Pager, fmtDate } from "./ui";

const ActivityLog = () => {
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-activity", page],
    queryFn: async () => (await axiosSecure.get("/api/admin/activity", { params: { page, limit: 30 } })).data,
    refetchInterval: 20000,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <Loader />;

  return (
    <div className={`min-h-screen p-6 ${themed(theme)}`}>
      <div className="w-[90%] mx-auto">
        <div className="py-10">
          <h2 className="font-bold text-center text-3xl">Activity Log</h2>
          <p className="py-2 w-[50%] mx-auto text-center text-slate-400">Every important action on the platform, newest first.</p>
        </div>
        <div className="overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl">
          <table className="table w-full text-left">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
              <tr className={` ${theme === "light" ? " text-black" : " text-white"}`}>
                <th className="px-6 py-4">When</th>
                <th className="px-6 py-4">Who</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data?.items.map((a) => (
                <tr key={a._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-xs whitespace-nowrap text-slate-400">{fmtDate(a.createdAt)}</td>
                  <td className="px-6 py-4 text-xs text-slate-300">{a.actor}</td>
                  <td className="px-6 py-4 font-bold text-[#00d7c0]">{a.action}</td>
                  <td className="px-6 py-4 text-xs max-w-[220px] truncate text-slate-300">{a.target}</td>
                  <td className="px-6 py-4 text-xs opacity-70 text-slate-400">{a.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.items.length && <p className="text-center opacity-60 py-8">No activity yet</p>}
        </div>
        <Pager page={data?.page || 1} pages={data?.pages || 1} onChange={setPage} />
        <div className="pb-10" />
      </div>
    </div>
  );
};

export default ActivityLog;
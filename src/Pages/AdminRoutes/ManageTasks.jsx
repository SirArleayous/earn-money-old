import React, { useContext, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import ManageTaskTable from "./ManageTaskTable";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import { themed, Loader, Pager, Tabs, Badge, errMsg, useDebounce } from "./ui";

const ManageTasks = () => {
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);
  const [tab, setTab] = useState("Tasks");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounce(search);
  const isTasks = tab === "Tasks";

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["manageTasks", tab, q, status, page],
    queryFn: async () =>
      (await axiosSecure.get(isTasks ? "/api/admin/tasks" : "/api/admin/submissions", { params: { search: q, status, page } })).data,
    placeholderData: (prev) => prev,
    refetchInterval: 8000, // live: new tasks and submissions show up by themselves
  });
  const items = data?.items || [];

  const switchTab = (t) => { setTab(t); setStatus(""); setPage(1); };

  const ManageTaskRemove = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? Pending submissions are rejected and unused coins go back to the buyer.`)) return;
    try {
      const { data: r } = await axiosSecure.delete(`/api/admin/tasks/${task._id}`);
      toast.success(`Task is successfully deleted (${r.refunded} coins refunded)`);
      refetch();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={`min-h-screen ${themed(theme)}`}>
      <div className="w-[90%] mx-auto">
        <div className="py-10">
          <h2 className="font-bold text-center text-3xl">Task Management</h2>
          <p className="py-2 w-[50%] mx-auto text-center">
            {" "}
            Streamline and organize your tasks efficiently, ensuring smooth workflow and timely completion of responsibilities.
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pb-4">
          <Tabs tabs={["Tasks", "Submissions"]} value={tab} onChange={switchTab} />
          <div className="flex flex-wrap gap-3">
            <input className="input input-bordered input-sm" placeholder="Search" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            <select className="select select-bordered select-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All statuses</option>
              {(isTasks ? ["Active", "Completed"] : ["Pending", "Approved", "Rejected"]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isTasks ? (
            <table className="table">
              <thead>
                <tr className={` ${theme === "light" ? " text-black" : " dark:text-white"}`}>
                  <th>Title</th>
                  <th>Detail</th>
                  <th>Date</th>
                  <th>worker</th>
                  <th>Submission</th>
                  <th>Payment</th>
                  <th>Slots</th>
                  <th>Escrow</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((manageTask) => (
                  <ManageTaskTable key={manageTask._id} ManageTaskRemove={ManageTaskRemove} manageTask={manageTask}></ManageTaskTable>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table">
              <thead>
                <tr className={` ${theme === "light" ? " text-black" : " dark:text-white"}`}>
                  <th>Task</th><th>Worker</th><th>Buyer</th><th>Evidence</th><th>Reward</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s._id}>
                    <td className="font-bold max-w-[180px] truncate">{s.task_title}</td>
                    <td className="text-xs">{s.worker_email}</td>
                    <td className="text-xs">{s.buyer_email}</td>
                    <td className="max-w-[240px] truncate" title={s.submission_detail}>{s.submission_detail}</td>
                    <td>{s.payable_amount}</td>
                    <td><Badge status={s.status} /></td>
                    <td className="text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!items.length && <p className="text-center opacity-60 py-8">Nothing found</p>}
        </div>
        <Pager page={data?.page || 1} pages={data?.pages || 1} onChange={setPage} />
        <div className="pb-10" />
      </div>
    </div>
  );
};

export default ManageTasks;
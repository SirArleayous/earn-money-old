import React, { useContext, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import ManageUsersTable from "./ManageUsersTable";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import { themed, Loader, Pager, errMsg, useDebounce } from "./ui";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounce(search);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", q, role, page],
    queryFn: async () => (await axiosSecure.get("/api/admin/users", { params: { search: q, role, page } })).data,
    placeholderData: (prev) => prev,
  });
  const allUsers = data?.items || [];

  const run = async (call, okMsg) => {
    try {
      await call();
      toast.success(okMsg);
      refetch();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  const handleUserDelete = (u) => {
    if (window.confirm(`Delete ${u.email}? Their login and ${u.coin} coins are removed. This cannot be undone.`))
      run(() => axiosSecure.delete(`/api/admin/users/${u._id}`), "successfully deleted");
  };

  const handleManageRole = (newRole, u) => {
    if (newRole && newRole !== u.role && window.confirm(`Change ${u.email} from ${u.role} to ${newRole}?`))
      run(() => axiosSecure.patch(`/api/admin/users/${u._id}`, { role: newRole }), "Successfully Updated ");
  };

  const handleCoins = (u) => {
    const v = window.prompt(`Add (+) or remove (-) coins for ${u.email}`, "10");
    if (v === null) return;
    const n = parseInt(v, 10);
    if (!n) return toast.error("Enter a whole number, e.g. 50 or -20");
    run(() => axiosSecure.patch(`/api/admin/users/${u._id}`, { coinDelta: n }), "Coins updated");
  };

  const handleSuspend = (u) => {
    const next = !u.suspended;
    if (window.confirm(`${next ? "Suspend" : "Reactivate"} ${u.email}?`))
      run(() => axiosSecure.patch(`/api/admin/users/${u._id}`, { suspended: next }), next ? "User suspended" : "User reactivated");
  };

  if (isLoading) return <Loader />;

  return (
    <div className={`p-6 min-h-screen ${themed(theme)}`}>
      <div className="w-11/12 mx-auto">
        <div className="py-8">
          <h2 className="font-bold text-3xl text-center">User Management Hub</h2>
          <p className="w-[60%] mx-auto text-center py-2 text-slate-400">
            A centralized system to manage users efficiently, allowing for role assignments, activity tracking, and
            profile updates, ensuring seamless administration and user engagement.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pb-4 items-center">
          <input
            className="bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#00d7c0] w-full max-w-xs"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#00d7c0]"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="" className="bg-slate-900 text-white">All roles</option>
            <option value="Worker" className="bg-slate-900 text-white">Worker</option>
            <option value="Buyer" className="bg-slate-900 text-white">Buyer</option>
            <option value="Admin" className="bg-slate-900 text-white">Admin</option>
          </select>
          <span className="text-sm text-slate-400 font-medium self-center">
            {data?.total ?? 0} users
          </span>
        </div>

        <div className="overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl">
          <table className="table w-full text-left border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
              <tr className={` ${theme === "light" ? " text-black" : " dark:text-white"}`}>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">photo</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Coin</th>
                <th className="px-6 py-4">Update role</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {allUsers.map((singleUser) => (
                <ManageUsersTable
                  key={singleUser._id}
                  handleManageRole={handleManageRole}
                  handleUserDelete={handleUserDelete}
                  handleCoins={handleCoins}
                  handleSuspend={handleSuspend}
                  singleUser={singleUser}
                ></ManageUsersTable>
              ))}
            </tbody>
          </table>
          {!allUsers.length && <p className="text-center opacity-60 py-8">No users found</p>}
        </div>
        <Pager page={data?.page || 1} pages={data?.pages || 1} onChange={setPage} />
        <div className="pb-8" />
      </div>
    </div>
  );
};

export default ManageUsers;
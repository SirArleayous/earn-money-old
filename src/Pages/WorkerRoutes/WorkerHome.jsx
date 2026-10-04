import React, { useContext } from "react";
import { VscFileSubmodule } from "react-icons/vsc";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiCoinsLine } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import ApprovedSubmissions from "./ApprovedSubmissions";
import ApexCharts from "../../components/ApexCharts/ApexCharts";
import { ThemeContext } from "../../context/ThemeContext";

const WorkerHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { theme } = useContext(ThemeContext);

  const {
    data: { result: myTotalSubmissions = [], total = 0 } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["mySubmission", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`api/worker/submissions/${user?.email}`);
      console.log(data);
      return data;
    },
  });

  const { data: pendingSubmissions = [] } = useQuery({
    queryKey: ["pendingSubmissions", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `api/worker/pending/${user?.email}`
      );
      console.log(data);
      return data;
    },
  });

  const totalApprovedData = myTotalSubmissions.filter(
    (approve) => approve.status === "Approve"
  );
  console.log(totalApprovedData);

  const totalEarning = totalApprovedData.reduce(
    (total, earning) => total + (earning.PaymentCoin || 0),
    0
  );

  console.log(myTotalSubmissions);
  console.log(pendingSubmissions);

  return (
    <div
      className={`${
        theme === "light"
          ? "backdrop-blur-xl bg-[#f9fafc] text-black"
          : "dark:bg-black dark:text-white"
      }`}
    >
      <h2 className="font-bold text-2xl p-10 pb-0">
        SINEX User Dashboard: Earnings & Task Analytics
      </h2>
      <div className="p-10 lg:flex gap-3 justify-between">
        <div className="lg:w-[70%]">
          <div className="shadow-2xl">
            <ApexCharts theme={theme}></ApexCharts>
          </div>
          <div
            className={`rounded-xl mt-4 ${
              theme === "light"
                ? "backdrop-blur-xl bg-[#FFFFFF] text-black"
                : "dark:bg-gradient-to-r from-[#020710] to-[#1b2028] dark:text-white"
            } z-10`}
          >
            <h2 className="font-bold text-center py-6 text-3xl">
              Approved Task Submissions
            </h2>
            <ApprovedSubmissions
              theme={theme}
              totalApprovedData={totalApprovedData}
            ></ApprovedSubmissions>
          </div>
        </div>
        <div className="lg:w-[30%] mt-10 lg:mt-0">
          <div
            className={`space-y-3 p-6 shadow-2xl rounded-xl ${
              theme === "light"
                ? "backdrop-blur-xl bg-[#FFFFFF]"
                : "dark:bg-gradient-to-r from-[#020710] to-[#1b2028] dark:text-white"
            } z-10`}
          >
            <div className="stats shadow w-full bg-[#00d7c0] text-slate-950">
              <div className="stat">
                <div className="stat-title text-center text-slate-900 font-bold">
                  Total Submissions
                </div>
                <button className="font-bold text-2xl py-3 flex justify-center text-slate-950">
                  <VscFileSubmodule></VscFileSubmodule>
                </button>
                <div className="stat-value text-center text-slate-950">
                  {myTotalSubmissions.length}
                </div>
              </div>
            </div>

            <div className="stats shadow w-full bg-[#6330bc] text-white">
              <div className="stat">
                <div className="stat-title text-center text-white font-bold">
                  Pending Submissions
                </div>
                <button className="font-bold text-2xl py-3 flex justify-center">
                  <MdOutlinePendingActions></MdOutlinePendingActions>
                </button>
                <div className="stat-value text-center">
                  {pendingSubmissions.length}
                </div>
              </div>
            </div>

            <div className="stats shadow w-full bg-[#00e396] text-slate-950">
              <div className="stat">
                <div className="stat-title text-center text-slate-900 font-bold">
                  Total Earnings (Coins)
                </div>
                <button className="font-bold text-2xl py-3 flex justify-center text-slate-950">
                  <RiCoinsLine></RiCoinsLine>
                </button>
                <div className="stat-value text-center text-slate-950">{totalEarning}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[75%] mx-auto"></div>
    </div>
  );
};

export default WorkerHome;
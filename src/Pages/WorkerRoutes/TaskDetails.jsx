import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";

const TaskDetails = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const {
    data: taskDetail = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["taskDetail"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`api/tasks/${id}`);
      console.log(data);
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );

  console.log(taskDetail);
  const {
    title,
    _id,
    detail,
    payment,
    worker,
    totalPayment,
    PaymentCoin,
    completionDate,
    submissionImage,
    taskImage,
    buyerInfo,
  } = taskDetail || {};

  console.log(PaymentCoin);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submissionDetail = form.submission_detail.value;
    const currentDate = new Date();

    const taskSubmitInfo = {
      task_id: taskDetail._id,
      task_title: taskDetail.title,
      payable_amount: taskDetail.payment,
      submission_detail: submissionDetail,
      PaymentCoin: taskDetail.PaymentCoin,
      worker_detail: {
        name: user?.displayName,
        email: user?.email,
      },
      buyer_detail: {
        name: taskDetail.buyerInfo.name,
        email: taskDetail.buyerInfo.email,
      },
      current_date: currentDate,
      status: "pending",
    };
    console.log(taskSubmitInfo);

    if (worker > 0) {
      try {
        const { data } = await axiosSecure.post(
          `api/worker/submit/${user?.email}`,
          taskSubmitInfo
        );

        refetch();
        console.log(data);
        toast.success("Submission is Successful!!!");

        let message = `${user?.displayName} has submitted work for ${title}`;
        const route = "/dashboard";
        const notificationObj = {
          message,
          email: taskDetail.buyerInfo.email,
          actionRoute: route,
          time: currentDate,
        };

        try {
          const { data } = await axiosSecure.post(
            "/notifications",
            notificationObj
          );
          console.log(data);
          toast.success("Successfully sent notification to campaign client");
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
        toast.error("Something Went Wrong...", err.message);
      }
    }
  };

  let date = new Date(completionDate);

  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dateFormatted = `${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;

  console.log(dateFormatted);

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-[#f9fafc] text-black"
          : "dark:bg-black dark:text-white"
      }`}
    >
      <div className="w-[90%] mx-auto">
        <div className="py-8">
          <h2 className="font-bold text-center text-3xl">
            SINEX Task Details & Submission Guide
          </h2>
          <p className="py-3 text-center md:w-[60%] mx-auto">
            Review the campaign instructions carefully before executing your task. Submit required proof details to receive your verified reward balance.
          </p>
        </div>
        <div className="lg:flex gap-4">
          <div className="card mb-10 shadow-xl duration-500 lg:w-[60%]">
            <figure>
              <img
                className="w-full h-[350px] object-cover"
                src={taskImage}
                alt="Task"
              />
            </figure>
            <div className="card-body">
              <div className="">
                <h2 className="font-bold text-xl">{title}</h2>
                <p className="py-2">{detail}</p>
                <p className="py-2">
                  <span className="font-bold text-xl mr-2">
                    Completion-Date:
                  </span>
                  {dateFormatted}
                </p>
                <p className="py-2">
                  <span className="font-bold text-xl">
                    Required-Workers:
                  </span>
                  <span className="btn ml-2">{worker}</span>
                </p>
                <p className="py-2 border-b pb-6">
                  <span className="font-bold text-xl">Payment:</span>
                  <span className="btn ml-2">{payment}.00$</span>
                </p>
              </div>

              <div className="flex justify-between">
                <div className="">
                  <h2 className="font-bold my-2">{buyerInfo?.name}</h2>
                  <div className="">
                    <img
                      className="w-14 h-14 rounded-full"
                      src={buyerInfo?.photo}
                      alt="Client"
                    />
                  </div>
                </div>
                <div className="">
                  <h2 className="font-bold my-2">Total-Payment</h2>
                  <div className="">
                    <p className="py-2">
                      <span className="btn">{totalPayment}.00$</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[40%] mb-10 shadow-xl">
            <div className="">
              <img className="" src={submissionImage} alt="Sample" />
            </div>

            <div className="p-5">
              <div className="">
                <h2 className="font-bold text-xl">
                  Tailored Professional Execution
                </h2>
                <p className="py-2">
                  Tasks are structured to maintain quality and operational efficiency across the SINEX platform ecosystem.
                </p>
                <p className="py-2">
                  Ensure all requested evidence, URLs, or notes are submitted accurately below for fast client verification.
                </p>
              </div>
              <div className="py-5">
                <form onSubmit={handleTaskSubmit}>
                  <textarea
                    placeholder="Enter submission proof details..."
                    name="submission_detail"
                    className="textarea textarea-bordered textarea-lg w-full max-w-lg"
                    required
                  ></textarea>
                  <div className="mt-2">
                    <button className="btn bg-[#00d7c0] hover:bg-[#00bfa8] border-none text-white font-bold">
                      Submit Task Evidence
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
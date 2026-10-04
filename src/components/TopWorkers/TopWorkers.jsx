import { useQuery } from "@tanstack/react-query";
import React from "react";
import Worker from "./Worker";
import axios from "axios";

const TopWorkers = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://earn-money-server-5.onrender.com";

  const {
    data: TopWorkers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["TopWorkers"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/users/top-workers`);
        console.log(data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Top workers fetch warning:", error);
        return [];
      }
    },
  });

  console.log(TopWorkers);

  return (
    <div className="w-11/12 mx-auto pb-10 pt-12">
      <div className="pt-10">
        <h2 className="font-bold text-4xl text-center">Top Achieving SINEX Users</h2>
        <p className="text-center md:w-[45%] mx-auto py-3">
          Recognizing our top platform contributors who excel in task execution and maintain consistent performance across regional campaigns.
        </p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-5 my-10 mx-auto">
        {TopWorkers.map((TopWorker, index) => (
          <Worker key={index} TopWorker={TopWorker}></Worker>
        ))}
      </div>
    </div>
  );
};

export default TopWorkers;
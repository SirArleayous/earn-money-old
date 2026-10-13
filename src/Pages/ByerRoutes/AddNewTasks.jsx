import React, { useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { myInfoContext } from "../../Layouts/DashBoardLayout";

const imageKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const FEE = 0.05; // keep in sync with BUYER_FEE on the server

const field =
  "w-full bg-[#0B0F19] border border-slate-800 focus:border-[#00d7c0] text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-all";
const label = "block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2";
const err = "text-rose-400 text-xs mt-1";

const AddNewTasks = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const ctx = useContext(myInfoContext);
  const balance = ctx?.myInfo?.coin ?? 0;
  const {
    register, handleSubmit, reset, watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const workers = Number(watch("required_workers")) || 0;
  const pay = Number(watch("payable_amount")) || 0;
  const reward = workers * pay;
  const fee = Math.ceil(reward * FEE);
  const total = reward + fee;

  const onSubmit = async (data) => {
    try {
      let task_image = "";
      if (data.task_image?.[0] && imageKey) {
        try {
          const fd = new FormData();
          fd.append("image", data.task_image[0]);
          const r = await axios.post(`https://api.imgbb.com/1/upload?key=${imageKey}`, fd);
          task_image = r?.data?.data?.display_url || "";
        } catch {
          toast("Image upload failed, publishing without it", { icon: "⚠️" });
        }
      }
      await axiosSecure.post("/api/tasks", {
        task_title: data.task_title,
        task_detail: data.task_detail,
        submission_info: data.submission_info,
        required_workers: Number(data.required_workers),
        payable_amount: Number(data.payable_amount),
        completion_date: data.completion_date,
        task_image,
      });
      toast.success("New task created successfully!");
      reset();
      ctx?.refetch?.(); // refresh coin balance
      // other lists in this browser update immediately; other users get it within ~8 seconds
      ["myTasks", "open-tasks", "manageTasks", "admin-stats"].forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not create task");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">
          Create <span className="text-[#00d7c0]">New Task Entry</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Quickly add new tasks and keep your projects on track with seamless organization across the SINEX platform.
        </p>
      </div>

      <div className="bg-[#111827]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={label}>Task Title</label>
            <input type="text" placeholder="e.g. Mobile App Beta Test & Feedback" className={field}
              {...register("task_title", { required: "Task title is required", maxLength: { value: 150, message: "Max 150 characters" } })} />
            {errors.task_title && <p className={err}>{errors.task_title.message}</p>}
          </div>

          <div>
            <label className={label}>Task Detail</label>
            <textarea rows="4" placeholder="Provide clear step-by-step instructions for workers..." className={`${field} resize-none`}
              {...register("task_detail", { required: "Task details are required" })}></textarea>
            {errors.task_detail && <p className={err}>{errors.task_detail.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={label}>Required Workers</label>
              <input type="number" min="1" placeholder="e.g. 50" className={field}
                {...register("required_workers", { required: "Required workers count is required", min: { value: 1, message: "At least 1" } })} />
              {errors.required_workers && <p className={err}>{errors.required_workers.message}</p>}
            </div>
            <div>
              <label className={label}>Reward per Worker (Coins)</label>
              <input type="number" min="1" step="1" placeholder="e.g. 10" className={field}
                {...register("payable_amount", { required: "Reward is required", min: { value: 1, message: "At least 1 coin" } })} />
              {errors.payable_amount && <p className={err}>{errors.payable_amount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={label}>Completion Date</label>
              <input type="date" className={field} {...register("completion_date", { required: "Completion date is required" })} />
              {errors.completion_date && <p className={err}>{errors.completion_date.message}</p>}
            </div>
            <div>
              <label className={label}>Proof Workers Must Submit</label>
              <input type="text" placeholder="e.g. Screenshot link + username" className={field}
                {...register("submission_info", { required: "Tell workers what proof to submit" })} />
              {errors.submission_info && <p className={err}>{errors.submission_info.message}</p>}
            </div>
          </div>

          <div>
            <label className={label}>Task Image (optional)</label>
            <input type="file" accept="image/*" {...register("task_image")}
              className="w-full text-xs text-slate-400 bg-[#0B0F19] border border-slate-800 rounded-xl file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00d7c0]/10 file:text-[#00d7c0] hover:file:bg-[#00d7c0]/20 cursor-pointer" />
          </div>

          <div className="p-4 bg-[#0B0F19] border border-slate-800 rounded-xl text-sm text-slate-300 flex flex-wrap justify-between gap-2">
            <span>Reward pool: <strong className="text-white">{reward}</strong></span>
            <span>5% platform fee: <strong className="text-white">{fee}</strong></span>
            <span>Total cost: <strong className={total > balance ? "text-rose-400" : "text-[#00d7c0]"}>{total} coins</strong></span>
            <span>Your balance: <strong className="text-white">{balance}</strong></span>
          </div>

          <button type="submit" disabled={isSubmitting || total > balance}
            className="w-full bg-[#00d7c0] hover:bg-[#00b8a4] text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#00d7c0]/20 cursor-pointer active:scale-[0.99] disabled:opacity-50">
            {isSubmitting ? "Publishing Task..." : total > balance ? "Not enough coins" : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewTasks;
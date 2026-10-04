import React, { useContext, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";

const Withdrawals = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [withdrawCoin, setWithDrawCoin] = useState(null);
  const [convertedUsd, setConvertedUsd] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const { theme } = useContext(ThemeContext);

  const {
    data: amountInfo = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["amountCoin", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`api/users/me/${user?.email}`);
      console.log(data);
      return data;
    },
  });

  const handleWithdrawCoin = (e) => {
    const withdrawCoin = parseInt(e.target.value);
    setWithDrawCoin(withdrawCoin);
    setConvertedUsd(withdrawCoin / 20);
  };

  const handleWithdrawSubmit = async (data) => {
    console.log(data);
    console.log(withdrawCoin);
    const date = new Date();

    if (amountInfo?.coin < withdrawCoin) {
      return toast.error("Withdrawal coin amount exceeds your available total balance");
    }

    const WithdrawalInfo = {
      ...data,
      withdrawCoin: withdrawCoin,
      convertedUsd: convertedUsd,
      name: amountInfo.name,
      email: amountInfo.email,
      withdrawalDate: date,
      status: "pending",
    };
    console.log(WithdrawalInfo);
    try {
      const { data } = await axiosSecure.post(
        `api/withdrawals/${user?.email}`,
        WithdrawalInfo
      );
      console.log(data);
      toast.success("Withdrawal Request Submitted Successfully!");
      reset();
      refetch();
      setConvertedUsd(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-[#f9fafc] text-black"
          : "dark:bg-black dark:text-white"
      }`}
    >
      <div className="w-11/12 mx-auto">
        <div className="py-8">
          <h2 className="text-center font-bold text-3xl md:text-4xl py-3">
            SINEX Earnings Withdrawal Hub
          </h2>
          <p className="md:w-[40%] mx-auto text-center">
            Convert your earned reward coins into localized wallet balances fast and securely through our verified processing gateway.
          </p>

          <h2 className="font-bold text-3xl text-center py-4 mt-6">
            Your Total Balance: ${amountInfo.coin ? amountInfo.coin / 20 : 0} ({amountInfo.coin || 0} Coins)
          </h2>
        </div>
        <div className="md:w-[70%] lg:w-[50%] mx-auto pb-20">
          <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
            <form
              onSubmit={handleSubmit(handleWithdrawSubmit)}
              className="card-body"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Coins To Withdraw</span>
                </label>
                <input
                  type="number"
                  onChange={handleWithdrawCoin}
                  placeholder="Enter coin amount"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Equivalent Amount ($ USD)</span>
                </label>
                <input
                  type="number"
                  value={convertedUsd || ""}
                  placeholder="Withdraw amount ($)"
                  className="input input-bordered"
                  required
                  readOnly
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Account / Wallet Number</span>
                </label>
                <input
                  type="number"
                  {...register("accountNumber")}
                  placeholder="Enter account / wallet number"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Payment Method</span>
                </label>
                <select
                  {...register("paymentMethod")}
                  className="select select-bordered w-full max-w-xs"
                  defaultValue=""
                  required
                >
                  <option disabled value="">
                    Select Payment Method
                  </option>
                  <option value="bkash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="BankTransfer">Bank Transfer / Local Wallet</option>
                </select>
              </div>
              <div className="form-control mt-6">
                {amountInfo.coin <= 200 ? (
                  <h2 className="text-red-500 font-bold text-xl text-center">
                    Insufficient Balance (Minimum 200 Coins Required)
                  </h2>
                ) : (
                  <button className="btn bg-[#00d7c0] hover:bg-[#00bfa8] border-none text-slate-950 font-bold">
                    Request Withdrawal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;
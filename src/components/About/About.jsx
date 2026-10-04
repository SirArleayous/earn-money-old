import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const Faq = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`w-11/12 mx-auto p-8 rounded-lg space-y-4 ${
        theme === "light"
          ? "bg-[#eaeaea] text-black"
          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
      }`}
    >
      <div>
        <div className="py-6">
          <h2 className="text-4xl font-bold text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-center md:w-[50%] mx-auto py-3">
            Find answers to common questions about the SINEX ecosystem and services.
          </p>
        </div>
      </div>

      <div
        className={`collapse collapse-plus rounded-lg shadow-lg border border-base-300 ${
          theme === "light"
            ? "bg-[#eaeaea] text-black"
            : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
        }`}
      >
        <input type="radio" name="my-accordion-3" defaultChecked />
        <div className="collapse-title font-semibold">
          How Can I Earn Rewards As A User?
        </div>
        <div className="collapse-content text-sm">
          First of all, sign up as a User. Then go to your dashboard, click on the
          available tasks list, and complete the task according to the given
          instructions. Once your submitted evidence is approved, your reward will
          be added directly to your wallet balance in your regional currency.
        </div>
      </div>

      <div
        className={`collapse collapse-plus rounded-lg shadow-lg border border-base-300 ${
          theme === "light"
            ? "bg-[#eaeaea] text-black"
            : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
        }`}
      >
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-semibold">
          How Can I Get My Tasks Executed As A Client/Business?
        </div>
        <div className="collapse-content text-sm">
          First of all, sign up as a Client/Business. Go to your client dashboard,
          click on add new campaign or task, set your budget, and provide clear
          instructions. Verified users will complete your tasks and submit
          proof for your review and approval.
        </div>
      </div>

      <div
        className={`collapse collapse-plus rounded-lg shadow-lg border border-base-300 ${
          theme === "light"
            ? "bg-[#eaeaea] text-black"
            : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
        }`}
      >
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-semibold">
          How Can I Fund My Client Wallet To Launch Tasks?
        </div>
        <div className="collapse-content text-sm">
          Navigate to the Deposit/Wallet section in your Client Dashboard and fund your
          account balance following the secure payment steps provided.
        </div>
      </div>

      <div
        className={`collapse collapse-plus rounded-lg shadow-lg border border-base-300 ${
          theme === "light"
            ? "bg-[#eaeaea] text-black"
            : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
        }`}
      >
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-semibold">
          How Can I Withdraw My Wallet Balance?
        </div>
        <div className="collapse-content text-sm">
          As a User, go to your dashboard, select the Withdrawals tab, fill in your payment details and requested amount, and submit it for admin processing.
        </div>
      </div>
    </div>
  );
};

export default Faq;
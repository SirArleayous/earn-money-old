import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const Faq = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`w-11/12 mx-auto p-8 rounded-2xl space-y-4 my-10 ${
        theme === "light"
          ? "bg-[#f3f4f6] text-slate-900"
          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
      }`}
    >
      <div className="py-6">
        <h2 className="text-4xl font-extrabold text-center tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-center md:w-[60%] mx-auto py-3 opacity-80 text-sm md:text-base">
          Find answers to common questions about the SINEX ecosystem and platform operations.
        </p>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Accordion Item 1 */}
        <details className="group border border-slate-700/30 bg-base-100 dark:bg-slate-900 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden shadow-sm" open>
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-lg text-slate-900 dark:text-white">
            <span>How Can I Earn Rewards As A User?</span>
            <span className="shrink-0 rounded-full bg-slate-800/10 dark:bg-slate-800 p-1.5 text-slate-900 dark:text-white sm:p-3">
              <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </summary>
          <p className="mt-4 leading-relaxed opacity-90 text-sm md:text-base text-slate-700 dark:text-slate-300 border-t border-slate-700/20 pt-3">
            First of all, sign up as a User. Then go to your dashboard, click on the available tasks list, and complete the task according to the given instructions. Once your submitted evidence is approved, your reward will be added directly to your wallet balance in your regional currency.
          </p>
        </details>

        {/* Accordion Item 2 */}
        <details className="group border border-slate-700/30 bg-base-100 dark:bg-slate-900 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-lg text-slate-900 dark:text-white">
            <span>How Can I Get My Tasks Executed As A Client/Business?</span>
            <span className="shrink-0 rounded-full bg-slate-800/10 dark:bg-slate-800 p-1.5 text-slate-900 dark:text-white sm:p-3">
              <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </summary>
          <p className="mt-4 leading-relaxed opacity-90 text-sm md:text-base text-slate-700 dark:text-slate-300 border-t border-slate-700/20 pt-3">
            First of all, sign up as a Client/Business. Go to your client dashboard, click on add new campaign or task, set your budget, and provide clear instructions. Verified users will complete your tasks and submit proof for your review and approval.
          </p>
        </details>

        {/* Accordion Item 3 */}
        <details className="group border border-slate-700/30 bg-base-100 dark:bg-slate-900 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-lg text-slate-900 dark:text-white">
            <span>How Can I Fund My Client Wallet To Launch Tasks?</span>
            <span className="shrink-0 rounded-full bg-slate-800/10 dark:bg-slate-800 p-1.5 text-slate-900 dark:text-white sm:p-3">
              <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </summary>
          <p className="mt-4 leading-relaxed opacity-90 text-sm md:text-base text-slate-700 dark:text-slate-300 border-t border-slate-700/20 pt-3">
            Navigate to the Deposit/Wallet section in your Client Dashboard and fund your account balance following the secure payment steps provided.
          </p>
        </details>

        {/* Accordion Item 4 */}
        <details className="group border border-slate-700/30 bg-base-100 dark:bg-slate-900 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-lg text-slate-900 dark:text-white">
            <span>How Can I Withdraw My Wallet Balance?</span>
            <span className="shrink-0 rounded-full bg-slate-800/10 dark:bg-slate-800 p-1.5 text-slate-900 dark:text-white sm:p-3">
              <svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </summary>
          <p className="mt-4 leading-relaxed opacity-90 text-sm md:text-base text-slate-700 dark:text-slate-300 border-t border-slate-700/20 pt-3">
            As a User, go to your dashboard, select the Withdrawals tab, fill in your payment details and requested amount, and submit it for admin processing.
          </p>
        </details>
      </div>
    </div>
  );
};

export default Faq;
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const DiamondFacility = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className="bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(https://ninetheme.com/themes/cryptoland/wp-content/uploads/2018/10/data-bg.png)`,
      }}
    >
      <div className="w-11/12 mx-auto">
        <div className="pb-14 pt-20">
          <h2 className="md:text-4xl text-3xl font-bold text-center">
            Diamond Features for Your SINEX Journey
          </h2>
          <p className="text-center md:w-[50%] mx-auto py-3">
            Unlock premium features built to enhance your experience, including rapid withdrawals, diverse campaign options, and round-the-clock support.
          </p>
        </div>
        <div className="lg:flex gap-8 py-10">
          <div className="lg:w-[25%] space-y-4">
            <div
              className={`rounded-xl p-10 ${
                theme === "light"
                  ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                  : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
              }`}
            >
              <h2 className="font-bold text-2xl text-center">
                Fast Payouts
              </h2>
              <p className="text-center py-3">
                Receive your converted earnings reliably through our structured payout gateway.
              </p>
            </div>
            <div
              className={`rounded-xl p-10 ${
                theme === "light"
                  ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                  : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
              }`}
            >
              <h2 className="font-bold text-2xl text-center">
                Secure Escrow
              </h2>
              <p className="text-center py-3">
                Enjoy peace of mind with escrow-backed campaign funds ensuring verified tasks are paid out.
              </p>
            </div>
            <div
              className={`rounded-xl p-10 ${
                theme === "light"
                  ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                  : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
              }`}
            >
              <h2 className="font-bold text-2xl text-center">
                24/7 Assistance
              </h2>
              <p className="text-center py-3">
                Get help anytime with our dedicated operational support team.
              </p>
            </div>
          </div>
          {theme === "light" ? (
            <div className="lg:w-[40%] lg:py-0 py-10 flex justify-center items-center mx-auto">
              <img
                className="w-full"
                src="https://toka.peerduck.com/wp-content/uploads/2022/03/worldwide.png"
                alt="Worldwide"
              />
            </div>
          ) : (
            <div className="lg:w-[30%] lg:py-0 py-10 flex justify-center items-center mx-auto">
              <img
                className="w-full"
                src="https://iko-nuxt.netlify.app/assets/img/update/normal/intro_1-1.png"
                alt="Network"
              />
            </div>
          )}

          <div className="lg:w-[25%] space-y-4">
            <div
              className={`rounded-xl p-10 ${
                theme === "light"
                  ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                  : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
              }`}
            >
              <h2 className="font-bold text-2xl text-center">
                Diverse Opportunities
              </h2>
              <p className="text-center py-3">
                Explore varied task categories matching your technical skills and preferences.
              </p>
            </div>
            <div
              className={`rounded-xl p-10 ${
                theme === "light"
                  ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                  : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
              }`}
            >
              <h2 className="font-bold text-2xl text-center">
                Flexible Schedules
              </h2>
              <p className="text-center py-3">
                Select tasks and campaigns that seamlessly fit your lifestyle.
              </p>
            </div>
            <div
              className={`rounded-xl p-10 ${
                theme === "light"
                  ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                  : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
              }`}
            >
              <h2 className="font-bold text-2xl text-center">
                Knowledge Resources
              </h2>
              <p className="text-center py-3">
                Access community insights and guides to maximize your task earnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamondFacility;
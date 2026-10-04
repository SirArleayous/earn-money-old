import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ScaleCard = () => {
  const [range, setRange] = useState(false);
  const { theme } = useContext(ThemeContext);
  return (
    <div className="">
      <div className="w-[90%] mx-auto pb-14">
        <div
          className={`rounded-xl px-8 md:px-14 py-10 w-full shadow-2xl ${
            theme === "light"
              ? "bg-[#eaeaea] text-black"
              : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
          }`}
        >
          <div className="md:pb-16 md:pt-10 py-10">
            <h2 className="font-bold text-4xl text-center">
              Empower Your Financial Balance, Anywhere, Anytime
            </h2>
            <p className="text-center pt-4 pb-6 w-[70%] mx-auto">
              Unlock your earning potential with SINEX's secure, global platform. Track wallet balances in real time, access regional campaign opportunities, and achieve financial goals seamlessly.
            </p>
            <div className="">
              <input
                type="range"
                min={0}
                max="100"
                value="90"
                className="range range-accent range-md"
                readOnly
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="">
              <h2 className="font-bold text-2xl text-left">
                Global Opportunities, Local Settlement
              </h2>
              <p className="text-left py-4">
                Execute tasks globally, receive payouts locally, and grow within a secure community.
              </p>
              <div className="">
                <input
                  type="range"
                  min={0}
                  max="100"
                  value="80"
                  className="range range-md"
                  readOnly
                />
              </div>
            </div>

            <div className="">
              <h2 className="font-bold text-2xl text-left">
                Multi-Country Scalability
              </h2>
              <p className="text-left py-4">
                Connect with clients and users across borders and earn from the comfort of home.
              </p>
              <div className="">
                <input
                  type="range"
                  min={0}
                  max="100"
                  value="90"
                  className="range range-md"
                  readOnly
                />
              </div>
            </div>
            <div className="">
              <h2 className="font-bold text-2xl text-left">
                Safe & Secure Architecture
              </h2>
              <p className="text-left py-4">
                Our platform ensures robust security for your credentials, data, and wallet earnings.
              </p>
              <div className="">
                <input
                  type="range"
                  min={0}
                  max="100"
                  value="85"
                  className="range range-md"
                  readOnly
                />
              </div>
            </div>
            <div className="">
              <h2 className="font-bold text-2xl text-left">
                Consistent Growth Engine
              </h2>
              <p className="text-left py-4">
                Continuous expansions bring fresh, high-yield tasks to active users every day.
              </p>
              <div className="">
                <input
                  type="range"
                  min={0}
                  max="100"
                  value="90"
                  className="range range-md"
                  readOnly
                />
              </div>
            </div>

            <div className="">
              <h2 className="font-bold text-2xl text-left">
                Redefining Task Ecosystems
              </h2>
              <p className="text-left py-4">
                Discover how SINEX makes task completion intuitive, rewarding, and accessible to all.
              </p>
              <div className="">
                <input
                  type="range"
                  min={0}
                  max="100"
                  value="75"
                  className="range range-md"
                  readOnly
                />
              </div>
            </div>

            <div className="">
              <h2 className="font-bold text-2xl text-left">
                A Community of Verified Success
              </h2>
              <p className="text-left py-4">
                Join thousands of verified earners driving excellence across the SINEX network.
              </p>
              <div className="">
                <input
                  type="range"
                  min={0}
                  max="100"
                  value="80"
                  className="range range-md"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleCard;
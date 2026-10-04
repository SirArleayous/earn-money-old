import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const Access = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="w-11/12 mx-auto">
      <div
        className={`grid lg:grid-cols-3 rounded-xl gap-4 p-8 ${
          theme === "light" ? "text-black" : "text-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-[28%]">
            <img
              src="https://toka.peerduck.com/wp-content/uploads/2022/03/key.png"
              alt="Register"
            />
          </div>
          <div className="">
            <h2 className="font-bold text-xl pb-2">Register Account</h2>
            <p className="">
              Access the SINEX ecosystem with custom tools tailored for users or business clients.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[40%]">
            <img
              src="https://toka.peerduck.com/wp-content/uploads/2022/02/app03r34.png"
              alt="Dashboard"
            />
          </div>
          <div className="">
            <h2 className="font-bold text-xl pb-2">Connect Dashboard</h2>
            <p className="">Enter your personalized dashboard to execute or publish campaigns.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[40%]">
            <img
              src="https://toka.peerduck.com/wp-content/uploads/2022/02/crypto-trading-hit.png"
              alt="Profit"
            />
          </div>
          <div className="">
            <h2 className="font-bold text-xl pb-2">Access Growth</h2>
            <p className="">
              Build earnings by completing tasks or scale business goals with verified users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Access;
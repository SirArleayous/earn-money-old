import React from "react";
import { motion } from "motion/react";
import { NavLink } from "react-router-dom";

const Work = () => {
  return (
    <div className="w-11/12 mx-auto py-20">
      <div className="lg:flex justify-between gap-6">
        <div className="lg:w-[50%] flex justify-center relative">
          <div className="w-[50%]">
            <img
              src="https://toka.peerduck.com/wp-content/uploads/2022/02/cryptophone.png"
              alt="Platform"
            />
          </div>
          <motion.div
            animate={{ y: 20 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-0 left-10 w-[30%]"
          >
            <img
              src="https://toka.peerduck.com/wp-content/uploads/2022/02/graph-crypto-trading.png"
              alt="Analytics"
            />
          </motion.div>
          <motion.div
            animate={{ y: 20 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute bottom-0 right-10 w-[30%]"
          >
            <img
              src="https://toka.peerduck.com/wp-content/uploads/2022/02/stocks.png"
              alt="Growth"
            />
          </motion.div>
        </div>
        <div className="lg:w-[50%] flex flex-col justify-center py-10 lg:py-0">
          <h2 className="text-[#00d7c0] text-xl font-bold">
            What does SINEX deliver?
          </h2>
          <h3 className="font-bold text-5xl py-4 leading-tight">
            Turn Simple Tasks into <br /> Real-World Rewards
          </h3>
          <p>
            SINEX is a multi-country platform where users earn reward coins by completing verified tasks, digital campaigns, and community engagements. Earned rewards convert smoothly into localized currency balances, offering a seamless route to monetize time and effort.
          </p>
          <div className="my-6">
            <NavLink to="/about" className="mt-8 lg:mt-0">
              <button className="rounded-md font-bold bg-[#00d7c0] text-slate-950 hover:bg-[#00bfa8] border-none py-3 px-6">
                Learn More
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import heroHand from "../../assets/hand.png";
import card from "../../assets/card.png";
import diamond1 from "../../assets/diamond1.png";
import diamond2 from "../../assets/coin90.png";
import "./hero.css";
import { motion } from "motion/react";
import CountUp from "react-countup";
import { ThemeContext } from "../../context/ThemeContext";
import { NavLink } from "react-router-dom";

const Hero = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="relative pt-36">
      <div className="absolute right-0 w-[40%] top-[340px] z-10 lg:flex hidden">
        <img src={heroHand} className="" alt="SINEX Opportunity" />
      </div>
      <div className="lg:h-screen w-11/12 mx-auto">
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 7000, // Set the delay time between slides (in ms)
            disableOnInteraction: false, // Allow autoplay to continue after user interaction
          }}
          rtl={true} // Enable right-to-left layout
          loop={true}
          speed={1000}
          freeMode={true}
          modules={[Autoplay]}
          className="mySwiper"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="lg:flex justify-between">
              <div className="lg:w-[50%] md:w-[70%] w-[90%] mx-auto lg:mx-0 flex items-center">
                <div className="">
                  <p
                    className={`rounded-lg text-center py-3 px-7 lg:w-[60%] md:w-[70%] md:mx-auto lg:mx-0 w-full text-xl ${
                      theme === "light"
                        ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                        : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                    }`}
                  >
                    {" "}
                    <span className="text-[#00d7c0] font-bold">
                      Discover
                    </span>{" "}
                    SINEX Opportunities
                  </p>
                  <h1 className="font-bold xl:leading-tight text-center lg:text-left text-3xl md:text-4xl lg:text-5xl xl:text-6xl py-4 ">
                    Build Your <span className="text-[#00d7c0]">rewards</span>.{" "}
                    Anytime, Anywhere,
                    <br /> Effortlessly!
                  </h1>

                  <p className=" lg:text-left text-center py-3 leading-normal lg:w-[80%]">
                    Access legitimate micro-tasks and research opportunities across global markets with the freedom to execute tasks on your own schedule.
                  </p>

                  <div className="md:flex space-y-2 md:space-y-2 gap-6 items-center justify-center lg:justify-start pt-5">
                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={2} />
                        M+
                      </h2>
                      <p className=" py-4">Global Tasks</p>
                    </div>

                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={90} />K
                      </h2>
                      <p className=" py-4">Active Users</p>
                    </div>
                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={12.5} />K
                      </h2>
                      <p className=" py-4">Daily Rewards</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-[46%] ">
                <motion.div
                  animate={{ y: 20 }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="w-[50%] flex justify-end mx-auto"
                >
                  <img src={diamond2} alt="SINEX Rewards" />
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="lg:flex justify-between">
              <div className="lg:w-[50%] md:w-[70%] w-[90%] mx-auto lg:mx-0 flex items-center">
                <div className="">
                  <p
                    className={`rounded-lg text-center py-3 px-7 lg:w-[60%] md:w-[70%] md:mx-auto lg:mx-0 w-full text-xl ${
                      theme === "light"
                        ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                        : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                    }`}
                  >
                    {" "}
                    <span className="text-[#00d7c0] font-bold">
                      Discover
                    </span>{" "}
                    Multi-Currency Wallets
                  </p>
                  <h1 className="font-bold xl:leading-tight text-center lg:text-left text-3xl md:text-4xl lg:text-5xl xl:text-6xl py-4 ">
                    Earn Your <span className="text-[#00d7c0]">balance</span>.{" "}
                    Anytime, Anywhere,
                    <br /> Instantly!
                  </h1>
                  <p className=" lg:text-left text-center py-3 leading-normal lg:w-[80%]">
                    Execute verified campaigns for top regional clients and receive immediate payouts straight to your preferred localized currency wallet.
                  </p>
                  <div className="md:flex space-y-2 md:space-y-2 gap-6 items-center justify-center lg:justify-start pt-5">
                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={4} />
                        M+
                      </h2>
                      <p className=" py-4">Total Payouts</p>
                    </div>

                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={95} />K
                      </h2>
                      <p className=" py-4">Verified Submissions</p>
                    </div>
                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={44.5} />K
                      </h2>
                      <p className=" py-4">Fast Withdrawals</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-[43%] ">
                <motion.div
                  animate={{ y: 20 }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="w-[60%] flex justify-end mx-auto"
                >
                  <img src={card} alt="SINEX Wallet" />
                </motion.div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="lg:flex justify-between">
              <div className="lg:w-[50%] md:w-[70%] w-[90%] mx-auto lg:mx-0 flex items-center">
                <div className="">
                  <p
                    className={`rounded-lg text-center py-3 px-7 lg:w-[60%] md:w-[70%] md:mx-auto lg:mx-0 w-full text-xl ${
                      theme === "light"
                        ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                        : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                    }`}
                  >
                    {" "}
                    <span className="text-[#00d7c0] font-bold">
                      Discover
                    </span>{" "}
                    Verified Campaigns
                  </p>
                  <h1 className="font-bold xl:leading-tight text-center lg:text-left text-3xl md:text-4xl lg:text-5xl xl:text-6xl py-4">
                    Boost Your <span className="text-[#00d7c0]">skills</span>.
                    Anytime, anywhere! <br /> Seamlessly!
                  </h1>
                  <p className=" lg:text-left text-center py-3 leading-normal lg:w-[80%]">
                    Connect with enterprise campaigns, complete user research studies, and maximize your earnings with configurable multi-country bonuses.
                  </p>
                  <div className="md:flex space-y-2 md:space-y-2 gap-6 items-center justify-center lg:justify-start pt-5">
                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={3} />
                        M+
                      </h2>
                      <p className=" py-4">Campaign Rewards</p>
                    </div>

                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={85} />K
                      </h2>
                      <p className=" py-4">Task Completed</p>
                    </div>
                    <div
                      className={`rounded-xl px-7 py-4 text-center ${
                        theme === "light"
                          ? "bg-gradient-to-r from-[#d7d7d7] to-[#eaeaea] text-black"
                          : "bg-gradient-to-t from-[#27292f] to-[#10121d] text-white"
                      }`}
                    >
                      <h2 className="text-5xl text-[#00d7c0] font-bold">
                        <CountUp end={11} />
                        H+
                      </h2>
                      <p className=" py-4">Welcome Bonuses</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-[50%] ">
                <motion.div
                  animate={{ y: 20 }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="w-[60%] flex justify-end mx-auto"
                >
                  <img src={diamond1} alt="SINEX Assets" />
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
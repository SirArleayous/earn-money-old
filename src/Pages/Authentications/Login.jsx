import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomCursor from "../../components/CustomCursor/CustomCursor";

const Login = () => {
  const { createSignInUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      await createSignInUser(email, password);
      toast.success("Login Successful! Welcome to SINEX.");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Firebase Login Error:", error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        toast.error("Invalid email or password. Please verify your credentials.");
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Google Login Successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen py-12 px-4 flex items-center justify-center">
      <CustomCursor />
      <div className="w-full max-w-md mx-auto bg-slate-900 rounded-2xl shadow-2xl p-6 lg:p-8 border border-slate-800 text-slate-100">
        
        <h2 className="font-extrabold text-3xl text-center mb-2">
          Login to SINEX
        </h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          Welcome back! Access your dashboard and earnings.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-slate-200 font-semibold">Email Address</span>
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter email"
              className="input input-bordered w-full bg-slate-800 border-slate-700 text-white focus:border-[#00d7c0] focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="form-control relative">
            <label className="label">
              <span className="label-text text-slate-200 font-semibold">Password</span>
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder="Enter password"
                className="input input-bordered w-full bg-slate-800 border-slate-700 text-white focus:border-[#00d7c0] focus:outline-none pr-10"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white z-10"
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 hover:text-[#00d7c0] cursor-pointer">
              Forgot password?
            </span>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="btn w-full bg-[#00d7c0] text-slate-950 hover:bg-[#00bfa8] border-none font-bold"
            >
              Login to SINEX
            </button>
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="btn w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center gap-2"
            >
              <img
                src="https://i.ibb.co/TvvzXfq/google.png"
                className="w-5 h-5 object-contain"
                alt="Google"
              />
              Continue With Google
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Don't have a SINEX account?{" "}
            <NavLink to="/register" className="text-[#00d7c0] hover:underline font-semibold">
              Register here
            </NavLink>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
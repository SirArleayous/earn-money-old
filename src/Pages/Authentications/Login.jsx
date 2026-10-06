import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { getAuthErrorMessage } from "../../utils/authError";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://earn-money-server-5.onrender.com";

const inputCls =
  "w-full rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:border-[#00d7c0] focus:outline-none";
const labelCls = "block mb-1 text-sm font-semibold text-slate-200";
const errCls = "text-red-400 text-xs mt-1";

const Login = () => {
  const { createSignInUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      await createSignInUser(email, password);
      toast.success("Login successful! Welcome to SINEX.");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user } = await signInWithGoogle();
      // Backend should upsert, so first-time Google users get a DB record (role/coins).
      axios
        .post(
          `${backendUrl}/api/users`,
          { name: user.displayName, email: user.email, photo: user.photoURL, role: "Worker", coin: 10 },
          { timeout: 60000 }
        )
        .catch((e) => console.warn("Backend user sync failed:", e.message));
      toast.success("Google login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen py-12 px-4 flex items-center justify-center">
      <CustomCursor />
      <div className="w-full max-w-md mx-auto bg-slate-900 rounded-2xl shadow-2xl p-6 lg:p-8 border border-slate-800 text-slate-100">
        <h2 className="font-extrabold text-3xl text-center mb-2">Login to SINEX</h2>
        <p className="text-slate-400 text-center text-sm mb-6">Welcome back! Access your dashboard and earnings.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={labelCls}>Email Address</label>
            <input type="email" placeholder="Enter email" className={inputCls}
              {...register("email", { required: "Email is required" })} />
            {errors.email && <p className={errCls}>{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Enter password"
                className={`${inputCls} pr-10`}
                {...register("password", { required: "Password is required" })} />
              <button type="button" onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className={errCls}>{errors.password.message}</p>}
          </div>

          <div className="pt-2 space-y-3">
            <button type="submit" disabled={isSubmitting}
              className="w-full rounded-lg bg-[#00d7c0] text-slate-950 font-bold py-2 hover:bg-[#00bfa8] disabled:opacity-60">
              {isSubmitting ? "Logging in..." : "Login to SINEX"}
            </button>
            <button type="button" onClick={handleGoogleLogin}
              className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2 flex items-center justify-center gap-2">
              <img src="https://i.ibb.co/TvvzXfq/google.png" className="w-5 h-5 object-contain" alt="Google" />
              Continue With Google
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Don't have a SINEX account?{" "}
            <NavLink to="/register" className="text-[#00d7c0] hover:underline font-semibold">Register here</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

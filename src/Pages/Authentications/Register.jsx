import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import CustomCursor from "../../components/CustomCursor/CustomCursor";
import { getAuthErrorMessage } from "../../utils/authError";

const imageKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imageApi = `https://api.imgbb.com/1/upload?key=${imageKey}`;
const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://earn-money-server-5.onrender.com";
const DEFAULT_PHOTO = "https://i.ibb.co/mR40Bmy/user.png";

const inputCls =
  "w-full rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:border-[#00d7c0] focus:outline-none";
const labelCls = "block mb-1 text-sm font-semibold text-slate-200";
const errCls = "text-red-400 text-xs mt-1";
const primaryBtn =
  "w-full rounded-lg bg-[#00d7c0] text-slate-950 font-bold py-2 hover:bg-[#00bfa8] disabled:opacity-60";

// Render's free tier sleeps, so allow a long wake-up time.
const saveUser = async (userData) => {
  try {
    await axios.post(`${backendUrl}/api/users`, userData, { timeout: 60000 });
  } catch (err) {
    console.warn("Backend user save failed:", err.message);
    toast("Account created, but profile sync failed. Try logging in again shortly.", { icon: "⚠️" });
  }
};

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ label: "Weak", color: "bg-red-500", progress: 0 });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Keep react-hook-form's own onChange and add ours on top.
  const { onChange: rhfOnChange, ...passwordReg } = register("password", {
    required: "Password is required",
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
      message: "At least 6 characters with uppercase & lowercase letters",
    },
  });

  const evaluateStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[!@#$%^&*]/.test(pw)) score++;
    if (!pw || score <= 2) setStrength({ label: "Weak", color: "bg-red-500", progress: pw ? 25 : 0 });
    else if (score === 3) setStrength({ label: "Medium", color: "bg-yellow-500", progress: 50 });
    else setStrength({ label: "Strong", color: "bg-green-500", progress: 100 });
  };

  const onSubmit = async ({ name, email, password, role, photo }) => {
    const coin = role === "Worker" ? 10 : 50;
    let photoURL = DEFAULT_PHOTO;

    if (photo?.[0] && imageKey) {
      try {
        const formData = new FormData();
        formData.append("image", photo[0]);
        const res = await axios.post(imageApi, formData);
        photoURL = res?.data?.data?.display_url || DEFAULT_PHOTO;
      } catch (err) {
        console.warn("Image upload failed, using default avatar:", err);
      }
    }

    try {
      await createUser(email, password);
      await updateUserProfile({ displayName: name, photoURL });
      await saveUser({ name, photo: photoURL, email, role, coin });
      toast.success("Welcome to SINEX! Registration successful.");
      reset();
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const { user } = await signInWithGoogle();
      await saveUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL || DEFAULT_PHOTO,
        role: "Worker",
        coin: 10,
      });
      toast.success("Registered successfully with Google!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen py-12 px-4 flex items-center justify-center">
      <CustomCursor />
      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center bg-slate-900 rounded-2xl shadow-2xl p-6 lg:p-12 border border-slate-800">
        <div className="space-y-6 text-white">
          <h2 className="font-extrabold text-3xl lg:text-4xl leading-tight">Register for SINEX Platform</h2>
          <p className="text-slate-300 leading-relaxed text-sm lg:text-base">
            Sign up now to unlock global digital task opportunities, build your reward balance, and launch
            verified multi-country campaigns.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <NavLink to="/login" className="rounded-lg bg-[#00d7c0] text-slate-950 font-bold px-6 py-2 hover:bg-[#00bfa8]">
              Go To Login
            </NavLink>
            <NavLink
              to="/"
              className="rounded-lg border border-slate-600 text-white px-4 py-2 flex items-center gap-2 hover:bg-slate-800"
            >
              Go To Home <FaArrowRight />
            </NavLink>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input type="text" placeholder="Enter full name" className={inputCls}
                {...register("name", { required: "Name is required" })} />
              {errors.name && <p className={errCls}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Profile Photo</label>
              <input type="file" accept="image/*"
                className={`${inputCls} file:mr-3 file:rounded file:border-0 file:bg-[#00d7c0] file:px-3 file:py-1 file:font-semibold file:text-slate-950`}
                {...register("photo", { required: "Photo is required" })} />
              {errors.photo && <p className={errCls}>{errors.photo.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Email Address</label>
              <input type="email" placeholder="Enter email" className={inputCls}
                {...register("email", { required: "Email is required" })} />
              {errors.email && <p className={errCls}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Select Account Role</label>
              <select defaultValue="" className={inputCls}
                {...register("role", { required: "Role selection is required" })}>
                <option disabled value="">Choose Account Type</option>
                <option value="Worker">User (Complete Tasks & Earn Rewards)</option>
                <option value="Buyer">Client / Business (Create Campaigns)</option>
              </select>
              {errors.role && <p className={errCls}>{errors.role.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Enter password"
                  className={`${inputCls} pr-10`} {...passwordReg}
                  onChange={(e) => { rhfOnChange(e); evaluateStrength(e.target.value); }} />
                <button type="button" onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className={errCls}>{errors.password.message}</p>}
              <div className="mt-3">
                <div className="h-1.5 w-full bg-slate-800 rounded">
                  <div className={`h-full ${strength.color} rounded transition-all duration-300`}
                    style={{ width: `${strength.progress}%` }} />
                </div>
                <p className="text-xs mt-1 text-slate-400">{strength.label}</p>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button type="submit" disabled={isSubmitting} className={primaryBtn}>
                {isSubmitting ? "Creating account..." : "Register Account"}
              </button>
              <button type="button" onClick={handleGoogleRegister}
                className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2 flex items-center justify-center gap-2">
                <img src="https://i.ibb.co/TvvzXfq/google.png" className="w-5 h-5 object-contain" alt="Google" />
                Continue With Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

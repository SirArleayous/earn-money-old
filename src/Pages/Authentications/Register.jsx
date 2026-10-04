import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import CustomCursor from "../../components/CustomCursor/CustomCursor";

const Image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${Image_hosting_key}`;

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    label: "Strengthen Your Password",
    color: "bg-red-500",
    progress: 0,
  });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://earn-money-server-5.onrender.com";

  const evaluatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ label: "Weak", color: "bg-red-500", progress: 0 });
      return;
    }

    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score <= 2) {
      setPasswordStrength({ label: "Weak", color: "bg-red-500", progress: 25 });
    } else if (score === 3) {
      setPasswordStrength({ label: "Medium", color: "bg-yellow-500", progress: 50 });
    } else if (score >= 4) {
      setPasswordStrength({ label: "Strong", color: "bg-green-500", progress: 100 });
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password, role } = data;
    let coin = role === "User" ? 10 : 50;
    let photoURL = "https://i.ibb.co/mR40Bmy/user.png";

    // 1. Safe Image Upload (Fallback on failure)
    if (data.photo && data.photo[0] && Image_hosting_key) {
      try {
        const formData = new FormData();
        formData.append("image", data.photo[0]);
        const imgResponse = await axios.post(image_hosting_api, formData);
        if (imgResponse?.data?.data?.display_url) {
          photoURL = imgResponse.data.data.display_url;
        }
      } catch (imgError) {
        console.warn("Image hosting failed, using default avatar:", imgError);
      }
    }

    // 2. Firebase Account Creation
    try {
      const userCredential = await createUser(email, password);
      await updateUserProfile({ displayName: name, photoURL });

      const userData = {
        name,
        photo: photoURL,
        email,
        role: role || "User",
        coin,
      };

      // 3. Post to Backend Database with Timeout Catch
      try {
        await axios.post(`${backendUrl}/api/users`, userData, { timeout: 8000 });
      } catch (backendErr) {
        console.warn("Backend server request timed out or unfulfilled:", backendErr.message);
      }

      toast.success("Welcome to SINEX! Registration Successful.");
      reset();
      navigate("/dashboard");
    } catch (error) {
      console.error("Firebase Registration Error: ", error);
      toast.error(error?.message || "Registration failed. Check Firebase Auth settings.");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const data = await signInWithGoogle();
      const googleUserData = {
        name: data?.user?.displayName,
        email: data?.user?.email,
        photo: data?.user?.photoURL,
        role: "User",
        coin: 10,
      };
      try {
        await axios.post(`${backendUrl}/api/users`, googleUserData, { timeout: 8000 });
      } catch (backendErr) {
        console.warn("Backend server request timed out:", backendErr.message);
      }
      toast.success("Registered successfully with Google!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Auth Error: ", error);
      toast.error("Google registration failed");
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen py-12 px-4 flex items-center justify-center">
      <CustomCursor />
      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center bg-slate-900 rounded-2xl shadow-2xl p-6 lg:p-12 border border-slate-800">
        
        {/* Left Info Column */}
        <div className="space-y-6 text-white">
          <h2 className="font-extrabold text-3xl lg:text-4xl leading-tight">
            Register for SINEX Platform
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm lg:text-base">
            Sign up now to unlock global digital task opportunities, build your reward balance, and launch verified multi-country campaigns.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <NavLink to="/login">
              <button className="btn bg-[#00d7c0] text-slate-950 hover:bg-[#00bfa8] border-none font-bold px-6">
                Go To Login
              </button>
            </NavLink>
            <NavLink to="/">
              <button className="btn btn-outline border-slate-600 text-white hover:bg-slate-800 flex items-center gap-2">
                Go To Home
                <FaArrowRight />
              </button>
            </NavLink>
          </div>
        </div>

        {/* Right Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-200 font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter full name"
                className="input input-bordered w-full bg-slate-800 border-slate-700 text-white focus:border-[#00d7c0] focus:outline-none"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-200 font-semibold">Profile Photo</span>
              </label>
              <input
                type="file"
                {...register("photo", { required: "Photo is required" })}
                className="file-input file-input-bordered bg-slate-800 border-slate-700 text-white w-full"
              />
              {errors.photo && (
                <p className="text-red-400 text-xs mt-1">{errors.photo.message}</p>
              )}
            </div>

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

            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-200 font-semibold">Select Account Role</span>
              </label>
              <select
                {...register("role", { required: "Role selection is required" })}
                className="select select-bordered w-full bg-slate-800 border-slate-700 text-white focus:border-[#00d7c0] focus:outline-none"
                defaultValue=""
              >
                <option disabled value="">
                  Choose Account Type
                </option>
                <option value="Worker">User (Complete Tasks & Earn Rewards)</option>
                <option value="Buyer">Client / Business (Create Campaigns)</option>
              </select>
              {errors.role && (
                <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
              )}
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text text-slate-200 font-semibold">Password</span>
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                      message: "Password must be at least 6 characters with uppercase & lowercase letters",
                    },
                  })}
                  placeholder="Enter password"
                  className="input input-bordered w-full bg-slate-800 border-slate-700 text-white focus:border-[#00d7c0] focus:outline-none pr-10"
                  onChange={(e) => evaluatePasswordStrength(e.target.value)}
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

              <div className="mt-3">
                <div className="h-1.5 w-full bg-slate-800 rounded">
                  <div
                    className={`h-full ${passwordStrength.color} rounded transition-all duration-300`}
                    style={{ width: `${passwordStrength.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-slate-400">{passwordStrength.label}</p>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="btn w-full bg-[#00d7c0] text-slate-950 hover:bg-[#00bfa8] border-none font-bold"
              >
                Register Account
              </button>
              <button
                onClick={handleGoogleRegister}
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

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
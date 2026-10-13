import React, { useContext } from "react";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import { myInfoContext } from "../../Layouts/DashBoardLayout";
import { CgProfile } from "react-icons/cg";
import { MdEmail, MdVerified } from "react-icons/md";
import { BsCoin, BsShieldCheck } from "react-icons/bs";

const UserProfile = () => {
  const { user } = useAuth();
  const [role] = useRole();
  const { myInfo } = useContext(myInfoContext) || {};

  // Profile data fallback
  const profileData = {
    name: myInfo?.name || user?.displayName || "Dauda Mathias",
    email: myInfo?.email || user?.email || "dauda@gmail.com",
    role: myInfo?.role || role || "Worker",
    coin: myInfo?.coin || 250,
    photo: myInfo?.photo || user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Dauda",
    status: "Verified Member",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Title */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-3xl font-extrabold text-white">
          User <span className="text-[#00d7c0]">Profile</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Manage your personal SINEX ecosystem details, role verification, and wallet credit metrics.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#00d7c0]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
          <div className="relative">
            <img
              src={profileData.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#00d7c0]/40 bg-slate-800"
            />
            <div className="absolute bottom-0 right-0 p-1.5 bg-[#00d7c0] text-slate-950 rounded-full shadow-lg">
              <MdVerified className="text-base" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-2xl font-bold text-white">{profileData.name}</h3>
              <span className="px-3 py-0.5 bg-[#00d7c0]/10 text-[#00d7c0] border border-[#00d7c0]/30 text-xs font-bold rounded-full">
                {profileData.role}
              </span>
            </div>
            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
              <MdEmail className="text-slate-500" />
              <span>{profileData.email}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Wallet Credits</span>
              <BsCoin className="text-[#00d7c0] text-lg" />
            </div>
            <p className="text-3xl font-extrabold text-[#00d7c0]">
              UGX {profileData.coin}
            </p>
            <span className="text-xs text-slate-500 block">Available reward balance</span>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Account Status</span>
              <BsShieldCheck className="text-emerald-400 text-lg" />
            </div>
            <p className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <MdVerified />
              {profileData.status}
            </p>
            <span className="text-xs text-slate-500 block">KYC & Email confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
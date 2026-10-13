import React, { useContext } from "react";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import { myInfoContext } from "../../Layouts/DashBoardLayout";
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
    <div className="space-y-5">
      <div className="relative overflow-hidden bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 text-center">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#00d7c0]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative inline-block">
          <img src={profileData.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-[#00d7c0]/40 bg-slate-800" />
          <div className="absolute bottom-0 right-0 p-1.5 bg-[#00d7c0] text-slate-950 rounded-full shadow-lg">
            <MdVerified className="text-base" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mt-3">{profileData.name}</h3>
        <span className="inline-block mt-1 px-3 py-0.5 bg-[#00d7c0]/10 text-[#00d7c0] border border-[#00d7c0]/30 text-xs font-bold rounded-full">
          {profileData.role}
        </span>
        <p className="text-slate-400 text-sm flex items-center justify-center gap-2 mt-2 break-all">
          <MdEmail className="text-slate-500 shrink-0" /><span>{profileData.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            <span>Wallet</span><BsCoin className="text-[#00d7c0] text-base" />
          </div>
          <p className="text-2xl font-extrabold text-[#00d7c0]">{profileData.coin}</p>
          <span className="text-[11px] text-slate-500 block">Coins available</span>
        </div>
        <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            <span>Status</span><BsShieldCheck className="text-emerald-400 text-base" />
          </div>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1"><MdVerified />{profileData.status}</p>
          <span className="text-[11px] text-slate-500 block">KYC & Email confirmed</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
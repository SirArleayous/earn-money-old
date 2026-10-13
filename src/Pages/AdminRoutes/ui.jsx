import React, { useEffect, useState } from "react";

// Same look the existing admin pages use (light / dark theme)
export const themed = (theme) =>
  theme === "light"
    ? "backdrop-blur-xl bg-[#FFFFFF] text-black"
    : "dark:bg-gradient-to-r from-[#020710] to-[#1b2028] dark:text-white";

export const errMsg = (e) => e?.response?.data?.message || e?.message || "Something went wrong";
export const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "");

export const useDebounce = (value, ms = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
};

export const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <span className="loading loading-ring loading-lg"></span>
  </div>
);

const tone = {
  emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  amber: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  rose: "bg-rose-500/10 text-rose-500 border-rose-500/30",
  violet: "bg-violet-500/10 text-violet-500 border-violet-500/30",
  sky: "bg-sky-500/10 text-sky-500 border-sky-500/30",
  teal: "bg-teal-500/10 text-teal-500 border-teal-500/30",
};
const map = {
  Approved: "emerald", Active: "emerald", Completed: "emerald", Pending: "amber", Rejected: "rose",
  Suspended: "rose", Admin: "violet", Buyer: "sky", Worker: "teal",
};
export const Badge = ({ status, label }) => (
  <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${tone[map[status] || "teal"]}`}>{label || status}</span>
);

export const Pager = ({ page, pages, onChange }) =>
  pages > 1 ? (
    <div className="flex items-center justify-end gap-3 pt-4 text-xs">
      <button className="btn btn-xs" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
      <span>Page {page} of {pages}</span>
      <button className="btn btn-xs" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  ) : null;

export const Tabs = ({ tabs, value, onChange }) => (
  <div className="flex gap-2">
    {tabs.map((t) => (
      <button key={t} onClick={() => onChange(t)} className={`btn btn-sm ${value === t ? "btn-accent text-white" : "btn-ghost"}`}>
        {t}
      </button>
    ))}
  </div>
);

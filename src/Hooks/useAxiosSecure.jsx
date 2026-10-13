import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import useAuth from "./useAuth";

const rawUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const API_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl.replace(/\/$/, "")}/api`;

export const axiosSecure = axios.create({ baseURL: API_URL });

// Intercept requests: attach auth token and prevent double `/api/api` URL duplication
axiosSecure.interceptors.request.use(async (config) => {
  const u = getAuth().currentUser;
  if (u) {
    config.headers.authorization = `Bearer ${await u.getIdToken()}`;
  }

  // Strip duplicate leading /api if the calling component passed '/api/...'
  if (config.url && config.url.startsWith("/api/")) {
    config.url = config.url.replace(/^\/api/, "");
  } else if (config.url && config.url.startsWith("api/")) {
    config.url = config.url.replace(/^api\//, "");
  }

  return config;
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const signOutFn = auth?.userSignOut || auth?.logOut;

  useEffect(() => {
    const id = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        const { status, data } = error.response || {};
        // Sign out only for bad tokens or suspended accounts (a plain 403 is just "not allowed")
        if (status === 401 || (status === 403 && data?.message === "Account suspended")) {
          await signOutFn?.();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
    return () => axiosSecure.interceptors.response.eject(id);
  }, [signOutFn, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
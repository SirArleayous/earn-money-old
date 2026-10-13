import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Routers/router.jsx";
import AuthProvider from "./components/AuthProvider/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./context/ThemeContext.jsx";

// Offline mock API: OFF now that the real backend runs. It would hide real notifications and data.
// import "./utils/Installmock.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Prevents queries from endlessly retrying on errors
      refetchOnWindowFocus: true, // switching back to the tab pulls fresh data
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);

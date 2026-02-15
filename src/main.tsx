import "./index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Sessions from "./pages/Sessions";
import SessionDetails from "./pages/SessionDetails";
import Library from "./pages/Library";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "sonner";
import App from "./App";

const ALLOWED_ROLES = ["REGULAR_USER", "ADMIN", "TECH_ADMIN"];

// 1. QueryClient z trybem offline-first
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      gcTime: 1000 * 60 * 60,
      networkMode: "offlineFirst",
    },
  },
});

// 2. Persister do localStorage (tylko w przeglądarce)
const persister =
  typeof window !== "undefined"
    ? createSyncStoragePersister({ storage: window.localStorage })
    : undefined;

// 3. Persist Query Cache (tylko w przeglądarce)
if (persister) {
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // 24h
  });
}

// 4. Router
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute requiredRoles={ALLOWED_ROLES}>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/sessions" replace /> },
      { path: "sessions", element: <Sessions /> },
      { path: "sessions/:id", element: <SessionDetails /> },
      { path: "library", element: <Library /> },
    ],
  },
]);

// 5. Render
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

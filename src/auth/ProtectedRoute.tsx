import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({
  children,
  requiredRoles,
}: {
  children: ReactNode;
  requiredRoles: string[];
}) {
  const { initialized, authenticated, roles } = useAuth();

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-400">Ładowanie...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = requiredRoles.some((r) => (roles ?? []).includes(r));
  if (!hasRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-400">Brak uprawnień do tej sekcji.</div>
      </div>
    );
  }

  return <>{children}</>;
}

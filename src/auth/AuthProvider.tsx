import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import keycloak from "./keycloak";
import { setAuthToken } from "@/lib/api";

type AuthContextType = {
  initialized: boolean;
  authenticated: boolean;
  token: string | undefined;
  userId: string | undefined;
  roles: string[];
  login: () => void;
  logout: () => void;
};

let keycloakInitStarted = false;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (keycloakInitStarted) {
      const parsed = keycloak.tokenParsed as Record<string, unknown> | undefined;
      const realmRoles: string[] = (parsed?.realm_access as { roles?: string[] })?.roles ?? [];
      const sub = parsed?.sub as string | undefined;

      setAuthenticated(!!keycloak.token);
      setToken(keycloak.token ?? undefined);
      setUserId(sub);
      setRoles(realmRoles);
      setInitialized(true);
      return;
    }

    keycloakInitStarted = true;
    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(!!auth);
        setToken(keycloak.token ?? undefined);

        const parsed = keycloak.tokenParsed as Record<string, unknown> | undefined;
        const realmRoles: string[] = (parsed?.realm_access as { roles?: string[] })?.roles ?? [];
        const sub = parsed?.sub as string | undefined;

        setUserId(sub);
        setRoles(realmRoles);
        setInitialized(true);

        // auto-refresh tokena co 20s
        const refreshInterval = setInterval(() => {
          keycloak
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed && keycloak.token) {
                setToken(keycloak.token);
                const newParsed = keycloak.tokenParsed as Record<string, unknown> | undefined;
                setUserId(newParsed?.sub as string | undefined);
              }
            })
            .catch(() => {
              setAuthenticated(false);
              setToken(undefined);
              setUserId(undefined);
            });
        }, 20000);

        return () => clearInterval(refreshInterval);
      })
      .catch((err) => {
        console.error("Keycloak init error", err);
        setInitialized(true);
      });
  }, []);

  const login = useCallback(() => {
    keycloak.login();
  }, []);

  const logout = useCallback(() => {
    setAuthenticated(false);
    setToken(undefined);
    setUserId(undefined);
    setRoles([]);

    keycloak.logout({
      redirectUri: window.location.origin,
    });
  }, []);

  const value: AuthContextType = {
    initialized,
    authenticated,
    token,
    userId,
    roles,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

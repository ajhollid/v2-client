import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import { useGet } from "@/hooks/UseApi";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

  const { response: me, loading, error } = useGet("/auth/me");
  useEffect(() => {
    if (!loading) {
      if (me) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    }
  }, [me, loading, error]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

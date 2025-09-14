import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import { useGet } from "@/hooks/UseApi";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { data, error, loading } = useGet(
    "/auth/me",
    {},
    () => {
      setAuthenticated(true);
    },
    () => {
      setAuthenticated(false);
    }
  );

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

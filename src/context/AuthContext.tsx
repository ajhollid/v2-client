import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean | null;
  setAuthenticated: (auth: boolean) => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

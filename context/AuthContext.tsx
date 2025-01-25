import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  profileimage?: string;
  bannerimage?: string;
  biography?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  setAuth: (authUser: User | null) => void;
  setUserData: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (authUser: User | null) => {
    setUser(authUser);
  };

  const setUserData = (userData: Partial<User>) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

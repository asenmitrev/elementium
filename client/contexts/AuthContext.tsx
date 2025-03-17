import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthService } from "@/services/auth.service";
import { redirect } from "next/navigation";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthed = await AuthService.checkAuth();
        setIsAuthenticated(isAuthed);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    await AuthService.login(username, password);
    setIsAuthenticated(true);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    await AuthService.register(username, email, password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // We'll need a logout endpoint on the server to clear cookies
    AuthService.logout();
    setIsAuthenticated(false);
    redirect("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

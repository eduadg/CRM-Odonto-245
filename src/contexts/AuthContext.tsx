import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebaseConfig";
import { loginUser, registerUser } from "../services/authService";
import { getUserById } from "../services/userService";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userData = await getUserById(firebaseUser.uid);
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const firebaseUser = await loginUser(email, password);
    const userData = await getUserById(firebaseUser.uid);
    setUser(userData);
  };

  const register = async (
    fullName: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const newUser = await registerUser(
      fullName,
      phone,
      email,
      password,
      confirmPassword
    );
    setUser(newUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setCookie, getCookie, deleteCookie, setLocalStorage, getLocalStorage } from "./storage-utils";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "organizer";
  school?: string;
  grade?: number;
  organization?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "student" | "organizer") => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "student" | "organizer";
  school?: string;
  grade?: number;
  organization?: string;
  phone?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const initialMockUsers: User[] = [
  {
    id: "1",
    name: "Болд Батаа",
    email: "bold@student.mn",
    role: "student",
    school: "1-р сургууль",
    grade: 11,
  },
  {
    id: "2",
    name: "Сарнай Дорж",
    email: "sarnai@organizer.mn",
    role: "organizer",
    organization: "Математикийн Холбоо",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from storage on mount
  useEffect(() => {
    const loadUserData = () => {
      // Load users from localStorage or use defaults
      const storedUsers = getLocalStorage("temtseen_users");
      if (storedUsers && Array.isArray(storedUsers)) {
        setUsers(storedUsers);
      } else {
        setUsers(initialMockUsers);
        setLocalStorage("temtseen_users", initialMockUsers);
      }

      // Check for existing session
      const sessionData = getCookie("temtseen_session");
      if (sessionData) {
        try {
          const userData = JSON.parse(decodeURIComponent(sessionData));
          setUser(userData);
        } catch (error) {
          console.error("Error parsing session data:", error);
          deleteCookie("temtseen_session");
        }
      }
      
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      setLocalStorage("temtseen_users", users);
    }
  }, [users]);

  const login = async (email: string, password: string, role: "student" | "organizer"): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = users.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      // Save session to cookie (expires in 7 days)
      setCookie("temtseen_session", encodeURIComponent(JSON.stringify(foundUser)), 7);
      return true;
    }
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      school: data.school,
      grade: data.grade,
      organization: data.organization,
      phone: data.phone,
      address: data.address,
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    
    // Save session to cookie
    setCookie("temtseen_session", encodeURIComponent(JSON.stringify(newUser)), 7);
    return true;
  };

  const logout = () => {
    setUser(null);
    deleteCookie("temtseen_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
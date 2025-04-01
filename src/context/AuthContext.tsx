import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
    

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);
    
    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Login failed");
            }
            const data = await response.json();
            setToken(data.token);
            localStorage.setItem("authToken", data.token);

        } catch (error) {
            toast({
                title: "Login Failed",
                description: error.message || "Failed to login",
                variant: "destructive",
            });
        }
    }

    const register = async (username: string, password: string) => { 
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) { 
                const errorData = await response.json();
                throw new Error(errorData.error || "Registration failed");
            }

            toast({
                title: "Registration Successful",
                description: "You can now login with your credentials.",
            });
        } catch (error) {
            toast({
                title: "Registration Failed",
                description: error.message || "Failed to register",
                variant: "destructive",
            })
        }
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem("authToken");
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, login, logout, register, isAuthenticated }}>
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

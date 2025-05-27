import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "farmer" | "retailer";
  businessName?: string;
  phoneNumber?: string;
  locationString?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isFarmer: () => boolean;
  isRetailer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      }

      setIsLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    checkUserData(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const checkUserData = async (token: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to get user data:", error);
    }
  };

  const isFarmer = () => {
    return user?.role === "farmer";
  };

  const isRetailer = () => {
    return user?.role === "retailer";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        isFarmer,
        isRetailer,
      }}
    >
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

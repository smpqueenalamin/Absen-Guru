import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Profile {
  id: string;
  name: string;
  email: string | null;
  role: string;
  photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: { access_token: string } | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, role?: "admin" | "teacher") => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data, error } = await apiClient.getCurrentUser();
        
        if (data?.user && !error) {
          setUser(data.user);
          setProfile({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          });
          setSession({ access_token: sessionStorage.getItem('auth_token') || '' });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await apiClient.login(email, password);

      if (error) {
        return { error };
      }

      if (data?.user) {
        setUser(data.user);
        setProfile({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
        setSession(data.session);
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: "admin" | "teacher" = "teacher") => {
    try {
      setIsLoading(true);
      
      const { data, error } = await apiClient.register(email, password, name, role);

      if (error) {
        return { error };
      }

      if (data?.user) {
        setUser(data.user);
        setProfile({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
        setSession(data.session);
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await apiClient.logout();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      signIn, 
      signUp, 
      signOut, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
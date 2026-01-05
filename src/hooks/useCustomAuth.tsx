import { useEffect, useState, useCallback } from "react";
import { api, User } from "@/lib/api";

export const useCustomAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = api.getUser();
    if (storedUser && api.isAuthenticated()) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  return { 
    user, 
    loading, 
    signOut,
    updateUser,
    isAuthenticated: api.isAuthenticated()
  };
};

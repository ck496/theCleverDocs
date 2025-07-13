import { useState, useEffect } from "react";
import apiClient from "@/api/client";

// Example user data interface
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface UserApiResponse {
  status: string;
  data: User;
}

// Example hook showing how to reuse the apiClient for other data
export const useUserData = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        setError(null);
        // Uses the same apiClient with interceptors, base URL, etc.
        const response = await apiClient.get<UserApiResponse>(`/users/${userId}`);
        const data = response.data;
        
        if (data.status === "success") {
          setUser(data.data);
        } else {
          throw new Error("Invalid user response format");
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await apiClient.patch<UserApiResponse>(`/users/${user.id}`, updates);
      const data = response.data;
      
      if (data.status === "success") {
        setUser(data.data);
      }
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    updateUser,
  };
};

export default useUserData;
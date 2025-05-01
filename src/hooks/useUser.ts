
import { useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface User {
  _id: string;
  displayName: string;
  location?: string;
  bio?: string;
  profilePhoto?: string;
  socialMedia?: string; // Added this optional field to fix TS error
}

interface UserResponse {
  success: boolean;
  data: User;
  message: string;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

export const useUser = (userId: string): UseUserReturn => {
  console.log('useUser called with userId:', userId);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        console.log('Fetching user data from:', `${API_BASE_URL}/users/${userId}`);
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('User data response:', response);
        const result: UserResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch user data');
        }

        if (result.success && result.data) {
          setUser(result.data);
        } else {
          throw new Error('User data not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const refreshUser = async () => {
    if (userId) {
      await fetchUser();
    }
  };

  return { user, loading, error, refreshUser };
};

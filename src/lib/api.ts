const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  return data;
};

export const registerUser = async (userData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    // Don't set Content-Type header - browser will set it with boundary
    body: userData,
  });
  
  const data = await response.json();
  console.log(data);
  return {
    success: response.ok,
    data: data,
    error: !response.ok ? data.error : null
  };
};

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

// New function to update user profile
export const updateUserProfile = async (field: string, value: string | File) => {
  // Create form data for the update
  const formData = new FormData();
  formData.append('field', field);
  
  // If the value is a File (for profile photo), append it directly
  if (value instanceof File) {
    formData.append('value', value);
  } else {
    formData.append('value', value);
  }
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      data: data,
      error: !response.ok ? data.error : null
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'Failed to update profile. Please try again.'
    };
  }
};

// Function to get user profile data
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      data: data,
      error: !response.ok ? data.error : null
    };
  } catch (error) {
    console.error('Profile fetch error:', error);
    return {
      success: false,
      error: 'Failed to fetch profile data. Please try again.'
    };
  }
};

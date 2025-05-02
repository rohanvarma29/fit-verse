const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const loginUser = async (email: string, password: string) => {
  try {
    
    console.log('API Request:', `${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // First check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      // Try to get error message from response if it's JSON
      let errorMessage = 'An error occurred during login';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If parsing JSON fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    // If response is ok, parse the JSON data
    const data = await response.json();
    console.log('API Response:', response.status, data);
    return {
      success: true,
      data: data,
      error: null
    };
  } catch (error) {
    // Handle network errors or other exceptions
    return {
      success: false,
      error: 'Network error or server is unavailable',
      data: null
    };
  }
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

export const updateUserProfile = async (userData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Updating user profile with token:', token ? 'Token exists' : 'No token');
    console.log('API URL:', `${API_BASE_URL}/users/update`);
    
    const response = await fetch(`${API_BASE_URL}/users/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: userData,
    });
    
    console.log('Update response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'An error occurred while updating profile';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
    
    const data = await response.json();
    console.log('Update response data:', data);
    return {
      success: true,
      data: data.data,
      error: null
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: 'Network error or server is unavailable',
      data: null
    };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred while fetching users';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error or server is unavailable',
      data: null
    };
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred while fetching user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error or server is unavailable',
      data: null
    };
  }
};

export const updateAvailability = async (meetLink: string) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/users/availability`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ meetLink }),
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred while updating availability';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error or server is unavailable',
      data: null
    };
  }
};

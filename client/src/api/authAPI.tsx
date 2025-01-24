import { UserLogin } from "../interfaces/UserLogin";
import { API_BASE_URL, getCommonHeaders, handleResponse, checkServerHealth } from './config';

const login = async (userInfo: UserLogin) => {
  try {
    // Check server health before attempting login
    const isHealthy = await checkServerHealth();
    if (!isHealthy) {
      throw new Error('Authentication server is not available. Please try again later.');
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        ...getCommonHeaders(),
        'Accept': 'application/json'
      },
      body: JSON.stringify(userInfo),
      credentials: 'include', // Include cookies for cross-origin requests
      mode: 'cors' // Explicitly set CORS mode
    });

    const data = await handleResponse(response);
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during login');
  }
};

// Check authentication status
const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'GET',
      headers: {
        ...getCommonHeaders(),
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      localStorage.removeItem('token');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    localStorage.removeItem('token');
    return false;
  }
};

export { login, checkAuth };

import { UserLogin } from "../interfaces/UserLogin";
import { API_BASE_URL, getCommonHeaders, handleResponse, checkServerHealth } from './config';

const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rest/v1/rpc/login`, {
      method: 'POST',
      headers: getCommonHeaders(),
      body: JSON.stringify({
        p_username: userInfo.username,
        p_password: userInfo.password
      }),
      mode: 'cors'
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

    const response = await fetch(`${API_BASE_URL}/rest/v1/rpc/verify_token`, {
      method: 'POST',
      headers: {
        ...getCommonHeaders(),
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token }),
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

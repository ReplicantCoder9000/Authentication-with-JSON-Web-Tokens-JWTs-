// Get the base URL from environment variables or use a default
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || window.location.origin;
  }
  return 'http://localhost:3002'; // Development server URL
};

export const API_BASE_URL = getBaseUrl();

// Common headers for API requests
export const getCommonHeaders = () => ({
  'Content-Type': 'application/json',
});

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Try to get error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } catch (e) {
      // If parsing JSON fails, throw generic error
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  return response.json();
};

// Helper function to check server health
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        ...getCommonHeaders(),
        'Accept': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

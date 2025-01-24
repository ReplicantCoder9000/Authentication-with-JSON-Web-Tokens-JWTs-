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
  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteXNldmNxdnFjZGlzY3N0bnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDA4MTMsImV4cCI6MjA1MzMxNjgxM30.XprMKVG0Tw3mUtYq6YZjBXREojMlmL2FcM8jq8-fJr0',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteXNldmNxdnFjZGlzY3N0bnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDA4MTMsImV4cCI6MjA1MzMxNjgxM30.XprMKVG0Tw3mUtYq6YZjBXREojMlmL2FcM8jq8-fJr0'
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
    const response = await fetch(`${API_BASE_URL}/rest/v1/rpc/check_health`, {
      method: 'POST',
      headers: getCommonHeaders(),
      mode: 'cors'
    });
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

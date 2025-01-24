export const API_BASE_URL = 'https://fmysevcqvqcdiscstnpv.supabase.co';

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

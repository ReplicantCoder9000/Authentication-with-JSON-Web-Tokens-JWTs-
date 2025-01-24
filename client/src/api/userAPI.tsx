import { API_BASE_URL, getCommonHeaders, handleResponse } from './config';

const retrieveUsers = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rest/v1/users`,
      {
        headers: getCommonHeaders()
      }
    );
    return handleResponse(response);

  } catch (err) { 
    console.log('Error from data retrieval:', err);
    return [];
  }
}

export { retrieveUsers };

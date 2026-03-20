const PRIMARY_AZURE_API_URL =
  'https://booking-backend-bqfrbyeeaactgegx.southeastasia-01.azurewebsites.net';
const LEGACY_AZURE_API_URL =
  'https://booking-backend-bqfrbyeeaactgegx.southeastasia-01.azurewebsites.net/api/books';
const LOCAL_API_URL = 'http://localhost:8080/api/books';

const isLocalFrontend =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URLS = isLocalFrontend
  ? [PRIMARY_AZURE_API_URL, LEGACY_AZURE_API_URL, LOCAL_API_URL]
  : [PRIMARY_AZURE_API_URL, LEGACY_AZURE_API_URL];

export const fetchWithFallback = async (path = '', options = {}) => {
  let lastResponse = null;
  let lastError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      if (response.ok) {
        return response;
      }

      lastResponse = response;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError || new Error('Unable to reach the API.');
};

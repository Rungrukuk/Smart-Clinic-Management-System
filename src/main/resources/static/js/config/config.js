export const API_BASE_URL = 'http://localhost:8080/api';

export function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export const JSON_HEADERS = {
  'Content-Type': 'application/json'
};
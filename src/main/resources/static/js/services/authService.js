import { API_BASE_URL, authHeaders } from '../config/config.js';

const AUTH_API = `${API_BASE_URL}/auth`;

let _cachedUserPromise = null;

export async function getMe(token) {
  if (!token) return null;

  if (!_cachedUserPromise) {
    _cachedUserPromise = fetch(`${AUTH_API}/me`, {
      headers: authHeaders(token)
    })
      .then(res => {
        if (!res.ok) {
          _cachedUserPromise = null;
          return null;
        }
        return res.json();
      })
      .catch(() => {
        _cachedUserPromise = null;
        return null;
      });
  }

  return _cachedUserPromise;
}

export function clearAuthCache() {
  _cachedUserPromise = null;
}
import { API_BASE_URL, authHeaders, JSON_HEADERS } from '../config/config.js';

const ADMIN_API = `${API_BASE_URL}/admin`;

export async function adminLogin(credentials) {
  try {
    const response = await fetch(`${ADMIN_API}/login`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    return { success: response.ok, token: data.token, message: data.message };
  } catch (error) {
    console.error('Error during admin login:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getAllPatients(token) {
  try {
    const response = await fetch(`${ADMIN_API}/patients`, {
      headers: authHeaders(token)
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.patients || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
}

export async function getAllAppointmentsAdmin(token) {
  try {
    const response = await fetch(`${ADMIN_API}/appointments`, {
      headers: authHeaders(token)
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.appointments || [];
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    return [];
  }
}
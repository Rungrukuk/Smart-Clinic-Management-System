import { API_BASE_URL, authHeaders, JSON_HEADERS } from '../config/config.js';

const DOCTOR_API = `${API_BASE_URL}/doctor`;

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function doctorLogin(credentials) {
  try {
    const response = await fetch(`${DOCTOR_API}/login`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    return { success: response.ok, token: data.token, message: data.message };
  } catch (error) {
    console.error('Error during doctor login:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(DOCTOR_API, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(doctor)
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error saving doctor:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function updateDoctor(doctor, token) {
  try {
    const response = await fetch(DOCTOR_API, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(doctor)
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error updating doctor:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getDoctorAvailability(doctorId, date, token) {
  try {
    const response = await fetch(
      `${DOCTOR_API}/availability/${doctorId}/${date}`,
      {
        headers: authHeaders(token)
      }
    );

    const data = await response.json();

    return {
      success: response.ok,
      availability: data.availability || []
    };
  } catch (error) {
    console.error('Error fetching availability:', error);
    return { success: false, availability: [] };
  }
}

export async function filterDoctors(name) {
  try {
    const response = await fetch(
      `${DOCTOR_API}/filter/${name}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error('Error filtering doctors:', error);
    return [];
  }
}
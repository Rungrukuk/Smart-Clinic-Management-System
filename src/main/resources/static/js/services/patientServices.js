import { API_BASE_URL, authHeaders, JSON_HEADERS } from '../config/config.js';

const PATIENT_API = `${API_BASE_URL}/patient`;

export async function patientSignup(data) {
  try {
    const response = await fetch(PATIENT_API, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return { success: response.ok, message: result.message };
  } catch (error) {
    console.error('Error during patient signup:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function patientLogin(data) {
  try {
    const response = await fetch(`${PATIENT_API}/login`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return { success: response.ok, token: result.token, message: result.message };
  } catch (error) {
    console.error('Error during patient login:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getPatientData(token) {
  try {
    const response = await fetch(PATIENT_API, {
      headers: authHeaders(token)
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return null;
  }
}

export async function getPatientAppointments(patientId, token) {
  try {
    const response = await fetch(`${PATIENT_API}/appointments/${patientId}`, {
      headers: authHeaders(token)
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    return null;
  }
}

export async function filterAppointments(condition, name, token) {
  try {
    const cond = condition && condition !== 'null' ? condition : 'null';
    const nm   = name      && name      !== 'null' ? name      : 'null';
    const response = await fetch(`${PATIENT_API}/filter/${cond}/${nm}`, {
      headers: authHeaders(token)
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error filtering appointments:', error);
    return null;
  }
}
import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + '/patient';

export async function patientSignup(data) {
  try {
    const response = await fetch(PATIENT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return response;
  } catch (error) {
    console.error('Error during patient login:', error);
    return null;
  }
}

export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return null;
  }
}

export async function getPatientAppointments(id, token) {
  try {
    const response = await fetch(
      `${PATIENT_API}/appointments/${id}/${token}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return null;
  }
}

export async function filterAppointments(condition, name, token) {
  try {
    const cond = condition && condition !== 'null' ? condition : 'null';
    const nm   = name      && name      !== 'null' ? name      : 'null';

    const response = await fetch(
      `${PATIENT_API}/filter/${cond}/${nm}/${token}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error filtering appointments:', error);
    return [];
  }
}
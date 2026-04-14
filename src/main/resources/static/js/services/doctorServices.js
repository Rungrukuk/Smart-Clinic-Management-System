import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + '/doctor';

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    return await response.json();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor)
    });

    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error saving doctor:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function filterDoctors(name, time, specialty) {
  try {
    const response = await fetch(
      `${DOCTOR_API}/filter/${name}/${time}/${specialty}`
    );

    if (!response.ok) {
      showToast('Failed to filter doctors. Please try again.', 'error');
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error filtering doctors:', error);
    return [];
  }
}
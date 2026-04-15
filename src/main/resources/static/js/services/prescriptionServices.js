import { API_BASE_URL, authHeaders } from '../config/config.js';

const PRESCRIPTION_API = `${API_BASE_URL}/prescription`;

export async function savePrescription(prescriptionData, token) {
  try {
    const response = await fetch(PRESCRIPTION_API, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(prescriptionData)
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error saving prescription:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getPrescriptionByAppointment(appointmentId, token) {
  try {
    const response = await fetch(`${PRESCRIPTION_API}/${appointmentId}`, {
      headers: authHeaders(token)
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.prescription || null;
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return null;
  }
}
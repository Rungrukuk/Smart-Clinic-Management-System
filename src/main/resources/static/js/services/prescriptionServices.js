import { API_BASE_URL } from "../config/config.js";

const PRESCRIPTION_API = API_BASE_URL + '/prescription';

export async function savePrescription(prescriptionData, token) {
  try {
    const response = await fetch(`${PRESCRIPTION_API}/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(
      `${PRESCRIPTION_API}/${appointmentId}/${token}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return null;
  }
}
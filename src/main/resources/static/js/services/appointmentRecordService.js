import { API_BASE_URL } from "../config/config.js";

const APPOINTMENT_API = API_BASE_URL + '/appointments';

export async function getAllAppointments(date, patientName, token) {
  try {
    const name = patientName || 'null';
    const response = await fetch(
      `${APPOINTMENT_API}/${date}/${name}/${token}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

export async function bookAppointment(appointmentData, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error booking appointment:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function updateAppointment(appointmentData, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function cancelAppointment(id, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/${id}/${token}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
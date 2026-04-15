import { API_BASE_URL, authHeaders } from '../config/config.js';

const APPOINTMENT_API = `${API_BASE_URL}/appointment`;

export async function getAllAppointments(date, patientName, token) {
  try {
    let url;
    if (date && patientName) {
      url = `${APPOINTMENT_API}/${date}/${patientName}`;
    } else if (date) {
      url = `${APPOINTMENT_API}/date/${date}`;
    } else if (patientName) {
      url = `${APPOINTMENT_API}/patient/${patientName}`;
    } else {
      url = `${APPOINTMENT_API}/doctor`;
    }

    const response = await fetch(url, { headers: authHeaders(token) });
    if (!response.ok) return [];
    const data = await response.json();
    return data.appointments || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

export async function bookAppointment(appointmentData, token) {
  try {
    const response = await fetch(APPOINTMENT_API, {
      method: 'POST',
      headers: authHeaders(token),
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
    const response = await fetch(APPOINTMENT_API, {
      method: 'PUT',
      headers: authHeaders(token),
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
    const response = await fetch(`${APPOINTMENT_API}/${id}/cancel`, {
      method: 'POST',
      headers: authHeaders(token)
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getAppointmentById(id, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/${id}`, {
      headers: authHeaders(token)
    });

    const data = await response.json();

    return {
      success: response.ok,
      appointment: data.appointment
    };
  } catch (e) {
    console.error('Error fetching appointment:', e);
    return { success: false };
  }
}

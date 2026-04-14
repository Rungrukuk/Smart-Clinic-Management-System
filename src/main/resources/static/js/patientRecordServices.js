import { API_BASE_URL } from './config/config.js';

const RECORD_API = API_BASE_URL + '/patient-records';

export async function getPatientRecords(token) {
  try {
    const response = await fetch(RECORD_API, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return [];

    return await response.json();
  } catch (error) {
    console.error('Error fetching patient records:', error);
    return [];
  }
}

export async function filterPatientRecords(condition, name, token) {
  try {
    const response = await fetch(
      `${RECORD_API}/filter/${condition}/${name}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) return [];

    return await response.json();
  } catch (error) {
    console.error('Error filtering patient records:', error);
    return [];
  }
}

export async function getPatientRecordById(id, token) {
  try {
    const response = await fetch(`${RECORD_API}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error('Error fetching patient record:', error);
    return null;
  }
}
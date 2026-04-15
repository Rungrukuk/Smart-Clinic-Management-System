import { API_BASE_URL, authHeaders } from '../config/config.js';

const REPORT_API = `${API_BASE_URL}/report`;

export async function getDailyReport(date, token) {
  try {
    const response = await fetch(`${REPORT_API}/daily?date=${date}`, {
      headers: authHeaders(token)
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching daily report:', error);
    return [];
  }
}

export async function getTopDoctorByMonth(month, year, token) {
  try {
    const response = await fetch(
      `${REPORT_API}/top-doctor/month?month=${month}&year=${year}`,
      { headers: authHeaders(token) }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching top doctor by month:', error);
    return [];
  }
}

export async function getTopDoctorByYear(year, token) {
  try {
    const response = await fetch(`${REPORT_API}/top-doctor/year?year=${year}`, {
      headers: authHeaders(token)
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching top doctor by year:', error);
    return [];
  }
}
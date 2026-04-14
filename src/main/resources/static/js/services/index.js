import { openModal }    from '../components/modals.js';
import { API_BASE_URL } from '../config/config.js';

const ADMIN_API  = API_BASE_URL + '/admin/login';
const DOCTOR_API = API_BASE_URL + '/doctor/login';

window.onload = function () {

  const adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    adminBtn.addEventListener('click', () => openModal('adminLogin'));
  }

  const doctorBtn = document.getElementById('doctorBtn');
  if (doctorBtn) {
    doctorBtn.addEventListener('click', () => openModal('doctorLogin'));
  }

  const patientBtn = document.getElementById('patientBtn');
  if (patientBtn) {
    patientBtn.addEventListener('click', () => selectRole('patient'));
  }
};

window.adminLoginHandler = async function () {
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;

  try {
    const response = await fetch(ADMIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      selectRole('admin');
    } else {
      showToast(data.message || 'Invalid credentials.', 'error');
    }
  } catch (error) {
    showToast('An unexpected error occurred.', 'error');
  }
};

window.doctorLoginHandler = async function () {
  const email    = document.getElementById('doctorEmail').value;
  const password = document.getElementById('doctorPassword').value;

  try {
    const response = await fetch(DOCTOR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      selectRole('doctor');
    } else {
      showToast(data.message || 'Invalid credentials.', 'error');
    }
  } catch (error) {
    showToast('An unexpected error occurred.', 'error');
  }
};
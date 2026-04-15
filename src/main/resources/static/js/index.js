import { openModal }   from './components/modals.js';
import { adminLogin }  from './services/adminService.js';
import { doctorLogin } from './services/doctorServices.js';

window.onload = function () {
  document.getElementById('adminBtn')
    ?.addEventListener('click', () => openModal('adminLogin'));
  document.getElementById('doctorBtn')
    ?.addEventListener('click', () => openModal('doctorLogin'));
  document.getElementById('patientBtn')
    ?.addEventListener('click', () => selectRole('patient'));
};

window.adminLoginHandler = async function () {
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;

  const result = await adminLogin({ username, password });

  if (result.success && result.token) {
    localStorage.setItem('token', result.token);
    selectRole('ADMIN');
  } else {
    showToast(result.message || 'Invalid credentials.', 'error');
  }
};

window.doctorLoginHandler = async function () {
  const identifier = document.getElementById('doctorEmail').value.trim();
  const password   = document.getElementById('doctorPassword').value;

  const result = await doctorLogin({ identifier, password });

  if (result.success && result.token) {
    localStorage.setItem('token', result.token);
    selectRole('DOCTOR');
  } else {
    showToast(result.message || 'Invalid credentials.', 'error');
  }
};
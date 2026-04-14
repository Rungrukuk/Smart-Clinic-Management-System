import { createDoctorCard }            from './components/doctorCard.js';
import { getDoctors, filterDoctors }   from './services/doctorServices.js';
import { patientLogin, patientSignup } from './services/patientServices.js';

document.addEventListener('DOMContentLoaded', () => {
  loadDoctorCards();
  setupFilters();
});

async function loadDoctorCards() {
  const doctors    = await getDoctors();
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = '';

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = '<p class="noPatientRecord">No doctors available.</p>';
    return;
  }

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

function setupFilters() {
  document.getElementById('searchBar')
    .addEventListener('input', filterDoctorsOnChange);
  document.getElementById('filterTime')
    .addEventListener('change', filterDoctorsOnChange);
  document.getElementById('filterSpecialty')
    .addEventListener('change', filterDoctorsOnChange);
}

async function filterDoctorsOnChange() {
  const name      = document.getElementById('searchBar').value       || 'null';
  const time      = document.getElementById('filterTime').value      || 'null';
  const specialty = document.getElementById('filterSpecialty').value || 'null';

  const doctors = await filterDoctors(name, time, specialty);
  renderDoctorCards(doctors);
}

function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = '';

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = '<p class="noPatientRecord">No doctors found with the given filters.</p>';
    return;
  }

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

window.signupPatient = async function () {
  const data = {
    name:     document.getElementById('signupName').value.trim(),
    email:    document.getElementById('signupEmail').value.trim(),
    password: document.getElementById('signupPassword').value,
    phone:    document.getElementById('signupPhone').value.trim(),
    address:  document.getElementById('signupAddress').value.trim()
  };

  const result = await patientSignup(data);

  if (result.success) {
    showToast(result.message || 'Account created successfully!');
    closeModal();
  } else {
    showToast(result.message || 'Signup failed. Please try again.', 'error');
  }
};

window.loginPatient = async function () {
  const data = {
    email:    document.getElementById('loginEmail').value.trim(),
    password: document.getElementById('loginPassword').value
  };

  const response = await patientLogin(data);

  if (response && response.ok) {
    const result = await response.json();
    localStorage.setItem('token', result.token);
    window.location.href = '/pages/loggedPatientDashboard.html';
  } else {
    showToast('Invalid credentials. Please try again.', 'error');
  }
};
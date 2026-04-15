import { createDoctorCard } from './components/doctorCard.js';
import { createPatientAppointmentRow } from './components/appointmentRow.js';

import {
  getDoctors,
  filterDoctors,
  getDoctorAvailability
} from './services/doctorServices.js';

import {
  bookAppointment
} from './services/appointmentRecordService.js';

import {
  patientLogin,
  patientSignup,
  getPatientData,
  getPatientAppointments
} from './services/patientServices.js';

import { getMe } from './services/authService.js';

const token = localStorage.getItem('token');

let currentUser = null;
let patientId = null;
let currentTab = 'doctors';
let initialized = false;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  if (initialized) return;
  initialized = true;

  if (token) {
    currentUser = await getMe(token);
  }

  setupFilters();
  setupAuthUI();

  await loadDoctors();

  if (isLoggedInPatient()) {
    const data = await getPatientData(token);
    patientId = data?.patient?.id;
  }

  await loadTab('doctors');
}

function isLoggedInPatient() {
  return currentUser?.role === 'PATIENT';
}

window.switchPatientTab = async function (event, tab) {
  if (currentTab === tab) return;

  currentTab = tab;

  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`tab-${tab}`).classList.add('active');
  event.currentTarget.classList.add('active');

  await loadTab(tab);
};

async function loadTab(tab) {
  if (tab === 'doctors') {
    await loadDoctors();
  }

  if (tab === 'appointments') {
    await loadAppointments();
  }
}

async function loadDoctors() {
  const doctors = await getDoctors();
  renderDoctors(doctors);
}

function renderDoctors(doctors) {
  const content = document.getElementById('content');
  content.innerHTML = '';

  if (!doctors?.length) {
    content.innerHTML = '<p class="noPatientRecord">No doctors available.</p>';
    return;
  }

  doctors.forEach(doctor => {
    content.appendChild(
      createDoctorCard(doctor, {
        role: isLoggedInPatient() ? 'loggedPatient' : 'patient',
        onBook: handleBookDoctor
      })
    );
  });
}

function setupFilters() {
  const specialty = document.getElementById('filterSpecialty');
  const time = document.getElementById('filterTime');
  const name = document.getElementById('searchBar');

  if (specialty) {
    specialty.addEventListener('change', applyDoctorFilter);
  }

  if (time) {
    time.addEventListener('change', applyDoctorFilter);
  }

  if (name) {
    name.addEventListener('input', debounce(applyDoctorFilter, 300));
  }
}


async function applyDoctorFilter() {
  const name = document.getElementById('searchBar').value || 'null';
  const specialty = document.getElementById('filterSpecialty').value || 'null';
  const time = document.getElementById('filterTime').value || 'null';

  const doctors = await filterDoctors(name, specialty, time);
  renderDoctors(doctors);
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}


function handleBookDoctor(doctor) {
  if (!isLoggedInPatient()) {
    window.openModal('patientLogin');
    return;
  }

  openBookingOverlay(doctor);
}

function openBookingOverlay(doctor) {
  const backdrop = document.getElementById('modalAppBackdrop');
  const modal = document.getElementById('modalApp');
  const body = document.getElementById('modalApp-body');

  body.innerHTML = `
    <h3>Book Appointment</h3>

    <label>Doctor</label>
    <input class="input-field" value="${doctor.name}" readonly />

    <label>Specialty</label>
    <input class="input-field" value="${doctor.specialty || ''}" readonly />

    <label>Date</label>
    <input type="date" id="bookDate" class="input-field" />

    <label>Time</label>
    <select id="bookTime" class="input-field">
      <option value="">Select date first</option>
    </select>

    <button class="confirm-btn" onclick="confirmBooking('${doctor.id}')">
      Confirm Booking
    </button>
  `;

  backdrop.classList.add('active');
  modal.classList.add('active');

  backdrop.onclick = closeBookingOverlay;

  document.getElementById('bookDate').onchange = () => {
    loadAvailability(doctor.id);
  };
}

function closeBookingOverlay() {
  document.getElementById('modalAppBackdrop').classList.remove('active');
  document.getElementById('modalApp').classList.remove('active');
}

async function loadAvailability(doctorId) {
  const date = document.getElementById('bookDate').value;
  const select = document.getElementById('bookTime');

  if (!date) return;

  const res = await getDoctorAvailability(doctorId, date, token);

  const slots = res?.availability || [];

  select.innerHTML = '<option value="">Select time</option>';

  if (!slots.length) {
    select.innerHTML = '<option value="">No available times</option>';
    return;
  }

  for (const slot of slots) {
    const [start, end] = slot.split('-');

    const opt = document.createElement('option');
    opt.value = start;
    opt.textContent = `${start} - ${end}`;
    select.appendChild(opt);
  }
}

window.confirmBooking = async function (doctorId) {
  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;

  if (!date || !time) {
    showToast('Select date and time', 'error');
    return;
  }

  const result = await bookAppointment(
    { doctorId, appointmentTime: `${date}T${time}:00` },
    token
  );

  if (result.success) {
    closeBookingOverlay();
    showToast('Appointment booked successfully!');
  } else {
    showToast(result.message || 'Booking failed', 'error');
  }
};

async function loadAppointments() {
  if (!patientId) {
    const data = await getPatientData(token);
    patientId = data?.patient?.id;
  }

  if (!patientId) return renderAppointments([]);

  const res = await getPatientAppointments(patientId, token);
  renderAppointments(res?.appointments);
}

function renderAppointments(appointments) {
  const tableBody = document.getElementById('appointmentTableBody');
  tableBody.innerHTML = '';

  if (!appointments?.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7">No appointments found.</td>
      </tr>`;
    return;
  }

  appointments.forEach(a => {
    tableBody.appendChild(createPatientAppointmentRow(a));
  });
}

function setupAuthUI() {
  const isPatient = isLoggedInPatient();

  const topbar = document.getElementById('patientTopbar');
  if (topbar) topbar.style.display = isPatient ? 'block' : 'none';
}

window.loginPatient = async function () {
  const result = await patientLogin({
    identifier: document.getElementById('loginEmail').value.trim(),
    password: document.getElementById('loginPassword').value
  });

  if (result.success && result.token) {
    localStorage.setItem('token', result.token);
    window.location.reload();
  } else {
    showToast(result.message || 'Invalid credentials', 'error');
  }
};

window.signupPatient = async function () {
  const result = await patientSignup({
    name: document.getElementById('signupName').value.trim(),
    email: document.getElementById('signupEmail').value.trim(),
    password: document.getElementById('signupPassword').value,
    phone: document.getElementById('signupPhone').value.trim(),
    address: document.getElementById('signupAddress').value.trim()
  });

  if (result.success) {
    showToast('Account created');
    closeModal();
  } else {
    showToast(result.message || 'Signup failed', 'error');
  }
};

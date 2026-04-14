import { openModal }                             from './components/modals.js';
import { getDoctors, filterDoctors, saveDoctor } from './services/doctorServices.js';
import { createDoctorCard }                      from './components/doctorCard.js';
import { API_BASE_URL }                          from './config/config.js';

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {

  const addDocBtn = document.getElementById('addDocBtn');
  if (addDocBtn) {
    addDocBtn.addEventListener('click', () => openModal('addDoctor'));
  }

  document.getElementById('searchBar')
    .addEventListener('input', filterDoctorsOnChange);
  document.getElementById('sortTime')
    .addEventListener('change', filterDoctorsOnChange);
  document.getElementById('filterSpecialty')
    .addEventListener('change', filterDoctorsOnChange);

  loadDoctorCards();
});

window.switchTab = function (tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');

  if (tab === 'patients')     loadPatients();
  if (tab === 'appointments') loadAppointments();
};

async function loadDoctorCards() {
  const doctors = await getDoctors();
  renderDoctorCards(doctors);
}

function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = '';

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = '<p class="noPatientRecord">No doctors found.</p>';
    return;
  }

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

async function filterDoctorsOnChange() {
  const name      = document.getElementById('searchBar').value       || 'null';
  const time      = document.getElementById('sortTime').value        || 'null';
  const specialty = document.getElementById('filterSpecialty').value || 'null';
  const doctors   = await filterDoctors(name, time, specialty);
  renderDoctorCards(doctors);
}

window.adminAddDoctor = async function () {
  if (!token) {
    showToast('You must be logged in as an admin.', 'error');
    return;
  }

  const availability = Array.from(
    document.querySelectorAll('input[name="availability"]:checked')
  ).map(cb => cb.value);

  const doctor = {
    name:           document.getElementById('doctorName').value,
    specialty:      document.getElementById('doctorSpecialty').value,
    email:          document.getElementById('doctorEmail').value,
    password:       document.getElementById('doctorPassword').value,
    phone:          document.getElementById('doctorMobile').value,
    availableTimes: availability
  };

  const result = await saveDoctor(doctor, token);

  if (result.success) {
    showToast(result.message || 'Doctor added successfully!');
    closeModal();
    loadDoctorCards();
  } else {
    showToast(result.message || 'Failed to add doctor.', 'error');
  }
};

async function loadPatients() {
  const tbody = document.getElementById('patientTableBody');
  tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">Loading...</td></tr>';

  try {
    const response = await fetch(`${API_BASE_URL}/admin/patients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const patients = await response.json();

    if (!patients || patients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">No patients found.</td></tr>';
      return;
    }

    tbody.innerHTML = patients.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.email}</td>
        <td>${p.phone || '—'}</td>
        <td>${p.address || '—'}</td>
      </tr>
    `).join('');

  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">Failed to load patients.</td></tr>';
  }
}

const STATUS_LABELS  = { 0: 'Pending', 1: 'Consulted', 2: 'Cancelled' };
const STATUS_CLASSES = { 0: 'status-0', 1: 'status-1', 2: 'status-2' };

async function loadAppointments() {
  const tbody = document.getElementById('appointmentTableBody');
  tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">Loading...</td></tr>';

  try {
    const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const appointments = await response.json();

    if (!appointments || appointments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">No appointments found.</td></tr>';
      return;
    }

    tbody.innerHTML = appointments.map(a => `
      <tr>
        <td>${a.id}</td>
        <td>${a.patient?.name || '—'}</td>
        <td>${a.doctor?.name || '—'}</td>
        <td>${a.appointmentTime
              ? a.appointmentTime.replace('T', ' ').substring(0, 16)
              : '—'}</td>
        <td class="${STATUS_CLASSES[a.status] || ''}">
          ${STATUS_LABELS[a.status] ?? '—'}
        </td>
      </tr>
    `).join('');

  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">Failed to load appointments.</td></tr>';
  }
}

window.loadDailyReport = async function () {
  const date = document.getElementById('reportDate').value;
  if (!date) { showToast('Please select a date.', 'error'); return; }

  try {
    const response = await fetch(`${API_BASE_URL}/reports/daily?date=${date}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const rows    = await response.json();
    const wrapper = document.getElementById('dailyReportResult');
    const tbody   = document.getElementById('dailyReportBody');

    tbody.innerHTML = rows && rows.length > 0
      ? rows.map(r => `
          <tr>
            <td>${r[0]}</td>
            <td>${r[1] ? String(r[1]).substring(0, 16).replace('T', ' ') : '—'}</td>
            <td>${r[2] === 1 ? 'Consulted' : r[2] === 2 ? 'Cancelled' : 'Pending'}</td>
            <td>${r[3]}</td>
            <td>${r[4]}</td>
          </tr>`).join('')
      : '<tr><td colspan="5" class="noPatientRecord">No appointments on this date.</td></tr>';

    wrapper.style.display = 'block';
  } catch (e) {
    showToast('Failed to load daily report.', 'error');
  }
};

window.loadTopDoctorMonth = async function () {
  const month = document.getElementById('reportMonth').value;
  const year  = document.getElementById('reportMonthYear').value;
  if (!month || !year) { showToast('Please enter month and year.', 'error'); return; }

  try {
    const response = await fetch(
      `${API_BASE_URL}/reports/top-doctor/month?month=${month}&year=${year}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const rows = await response.json();
    const div  = document.getElementById('topDoctorMonthResult');
    div.innerHTML = rows && rows.length > 0
      ? `Doctor ID: <strong style="color:var(--accent)">${rows[0][0]}</strong>
         &nbsp;|&nbsp; Patients seen: <strong style="color:var(--accent)">${rows[0][1]}</strong>`
      : 'No data found.';
  } catch (e) {
    showToast('Failed to load report.', 'error');
  }
};

window.loadTopDoctorYear = async function () {
  const year = document.getElementById('reportYear').value;
  if (!year) { showToast('Please enter a year.', 'error'); return; }

  try {
    const response = await fetch(
      `${API_BASE_URL}/reports/top-doctor/year?year=${year}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const rows = await response.json();
    const div  = document.getElementById('topDoctorYearResult');
    div.innerHTML = rows && rows.length > 0
      ? `Doctor ID: <strong style="color:var(--accent)">${rows[0][0]}</strong>
         &nbsp;|&nbsp; Patients seen: <strong style="color:var(--accent)">${rows[0][1]}</strong>`
      : 'No data found.';
  } catch (e) {
    showToast('Failed to load report.', 'error');
  }
};
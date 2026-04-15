import { openModal }                                               from './components/modals.js';
import { getDoctors, filterDoctors, saveDoctor }                  from './services/doctorServices.js';
import { createDoctorCard }                                        from './components/doctorCard.js';
import { getAllPatients, getAllAppointmentsAdmin }                  from './services/adminService.js';
import { getDailyReport, getTopDoctorByMonth, getTopDoctorByYear } from './services/reportService.js';

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addDocBtn')
    ?.addEventListener('click', () => openModal('addDoctor'));
  document.getElementById('searchBar')
    .addEventListener('input', filterDoctorsOnChange);
  document.getElementById('sortTime')
    .addEventListener('change', filterDoctorsOnChange);
  document.getElementById('filterSpecialty')
    .addEventListener('change', filterDoctorsOnChange);

  loadDoctorCards();
});

window.switchTab = function (event, tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');

  if (tab === 'patients')     loadPatients();
  if (tab === 'appointments') loadAppointments();
};

async function loadDoctorCards() {
  renderDoctorCards(await getDoctors());
}

function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = '';

  if (!doctors?.length) {
    contentDiv.innerHTML = '<p class="noPatientRecord">No doctors found.</p>';
    return;
  }

  doctors.forEach(doctor => contentDiv.appendChild(createDoctorCard(doctor)));
}

async function filterDoctorsOnChange() {
  const name      = document.getElementById('searchBar').value       || 'null';
  const time      = document.getElementById('sortTime').value        || 'null';
  const specialty = document.getElementById('filterSpecialty').value || 'null';
  renderDoctorCards(await filterDoctors(name, time, specialty));
}

window.adminAddDoctor = async function () {
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

  const patients = await getAllPatients(token);

  if (!patients.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">No patients found.</td></tr>';
    return;
  }

  tbody.innerHTML = patients.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.email}</td>
      <td>${p.phone   || '—'}</td>
      <td>${p.address || '—'}</td>
    </tr>
  `).join('');
}

const STATUS_LABELS  = { 0: 'Scheduled', 1: 'Completed', 2: 'Cancelled' };
const STATUS_CLASSES = { 0: 'status-0',  1: 'status-1',  2: 'status-2'  };

async function loadAppointments() {
  const tbody = document.getElementById('appointmentTableBody');
  tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">Loading...</td></tr>';

  const appointments = await getAllAppointmentsAdmin(token);

  if (!appointments.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="noPatientRecord">No appointments found.</td></tr>';
    return;
  }

  tbody.innerHTML = appointments.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.patient?.name || '—'}</td>
      <td>${a.doctor?.name  || '—'}</td>
      <td>${a.appointmentTime
            ? a.appointmentTime.replace('T', ' ').substring(0, 16)
            : '—'}</td>
      <td class="${STATUS_CLASSES[a.status] || ''}">
        ${STATUS_LABELS[a.status] ?? '—'}
      </td>
    </tr>
  `).join('');
}

window.loadDailyReport = async function () {
  const date = document.getElementById('reportDate').value;
  if (!date) { showToast('Please select a date.', 'error'); return; }

  const rows    = await getDailyReport(date, token);
  const wrapper = document.getElementById('dailyReportResult');
  const tbody   = document.getElementById('dailyReportBody');

  tbody.innerHTML = rows?.length
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
};

window.loadTopDoctorMonth = async function () {
  const month = document.getElementById('reportMonth').value;
  const year  = document.getElementById('reportMonthYear').value;
  if (!month || !year) { showToast('Please enter month and year.', 'error'); return; }

  const [rows, doctors] = await Promise.all([
    getTopDoctorByMonth(month, year, token),
    getDoctors()
  ]);

  const div = document.getElementById('topDoctorMonthResult');
  if (!rows?.length) { div.innerHTML = 'No data found.'; return; }
  renderTopDoctor(div, rows[0], doctors);
};

window.loadTopDoctorYear = async function () {
  const year = document.getElementById('reportYear').value;
  if (!year) { showToast('Please enter a year.', 'error'); return; }

  const [rows, doctors] = await Promise.all([
    getTopDoctorByYear(year, token),
    getDoctors()
  ]);

  const div = document.getElementById('topDoctorYearResult');
  if (!rows?.length) { div.innerHTML = 'No data found.'; return; }
  renderTopDoctor(div, rows[0], doctors);
};

function renderTopDoctor(container, row, doctors) {
  const [doctorId, patientCount] = row;
  const doctor = doctors.find(d => d.id === doctorId);

  container.innerHTML = doctor
    ? `<strong style="color:var(--accent)">${doctor.name}</strong>
       &nbsp;|&nbsp; Specialty: <strong style="color:var(--accent)">${doctor.specialty || '—'}</strong>
       &nbsp;|&nbsp; Email: <strong style="color:var(--accent)">${doctor.email || '—'}</strong>
       &nbsp;|&nbsp; Patients seen: <strong style="color:var(--accent)">${patientCount}</strong>`
    : `Doctor ID: <strong style="color:var(--accent)">${doctorId}</strong>
       &nbsp;|&nbsp; Patients seen: <strong style="color:var(--accent)">${patientCount}</strong>`;
}
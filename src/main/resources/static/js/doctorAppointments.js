import { getAllAppointments }         from './services/appointmentRecordService.js';
import { createDoctorAppointmentRow } from './components/appointmentRow.js';

const token     = localStorage.getItem('token');
const tableBody = document.getElementById('patientTableBody');

let selectedDate = null;
let patientName  = null;

document.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('datePicker');
  const searchBar  = document.getElementById('searchBar');

  if (datePicker) datePicker.value = '';

  document.getElementById('searchBtn')?.addEventListener('click', () => {
    selectedDate = datePicker?.value || null;
    patientName  = searchBar?.value.trim() || null;
    loadAppointments();
  });

  document.getElementById('todayBtn')?.addEventListener('click', () => {
    selectedDate = new Date().toISOString().split('T')[0];
    if (datePicker) datePicker.value = selectedDate;
    patientName = null;
    if (searchBar) searchBar.value = '';
    loadAppointments();
  });

  loadAppointments();
});

async function loadAppointments() {
  renderRows(await getAllAppointments(selectedDate, patientName, token));
}

function renderRows(appointments) {
  tableBody.innerHTML = '';

  if (!appointments?.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="noPatientRecord">No appointments found for this date.</td>
      </tr>`;
    return;
  }

  appointments.forEach(a => tableBody.appendChild(createDoctorAppointmentRow(a)));
}
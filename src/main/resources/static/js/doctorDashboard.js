import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow }   from './components/patientRows.js';

const token = localStorage.getItem('token');
const tableBody = document.getElementById('patientTableBody');

let selectedDate = new Date().toISOString().split('T')[0];
let patientName  = null;

document.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('datePicker');
  if (datePicker) datePicker.value = selectedDate;

  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      patientName = e.target.value.trim() || null;
      loadAppointments();
    });
  }

  const todayBtn = document.getElementById('todayBtn');
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      selectedDate = new Date().toISOString().split('T')[0];
      if (datePicker) datePicker.value = selectedDate;
      loadAppointments();
    });
  }

  if (datePicker) {
    datePicker.addEventListener('change', (e) => {
      selectedDate = e.target.value;
      loadAppointments();
    });
  }

  loadAppointments();
});

async function loadAppointments() {
  tableBody.innerHTML = '';

  try {
    const appointments = await getAllAppointments(selectedDate, patientName, token);

    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="noPatientRecord">
            No appointments found for this date.
          </td>
        </tr>`;
      return;
    }

    appointments.forEach(appointment => {
      const patient = appointment.patient || appointment;
      const row = createPatientRow(patient, appointment);
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading appointments:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="noPatientRecord">
          Failed to load appointments. Please try again.
        </td>
      </tr>`;
  }
}
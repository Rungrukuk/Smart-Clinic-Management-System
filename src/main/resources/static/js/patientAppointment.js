import { createAppointmentRow }                        from './components/appointmentRow.js';
import { getPatientAppointments, filterAppointments,
         getPatientData }                              from './services/patientServices.js';
import { cancelAppointment }                           from './services/appointmentRecordService.js';

const token     = localStorage.getItem('token');
const tableBody = document.getElementById('appointmentTableBody');

document.addEventListener('DOMContentLoaded', async () => {
  await loadAppointments();
  setupFilters();
});

async function loadAppointments() {
  tableBody.innerHTML = '';

  try {
    const patientData = await getPatientData(token);

    const appointments = await getPatientAppointments(patientData?.id, token);

    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="noPatientRecord">No appointments found.</td>
        </tr>`;
      return;
    }

    appointments.forEach(appointment => {
      const row = createAppointmentRow(appointment);
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading appointments:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="noPatientRecord">Failed to load appointments.</td>
      </tr>`;
  }
}

function setupFilters() {
  document.getElementById('searchBar')
    .addEventListener('input', filterOnChange);
  document.getElementById('filterCondition')
    .addEventListener('change', filterOnChange);
}

async function filterOnChange() {
  const name      = document.getElementById('searchBar').value       || 'null';
  const condition = document.getElementById('filterCondition').value || 'null';

  tableBody.innerHTML = '';

  const appointments = await filterAppointments(condition, name, token);

  if (!appointments || appointments.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="noPatientRecord">No appointments match your search.</td>
      </tr>`;
    return;
  }

  appointments.forEach(appointment => {
    const row = createAppointmentRow(appointment);
    tableBody.appendChild(row);
  });
}

window.cancelAppointment = async function (id) {
  const result = await cancelAppointment(id, token);

  if (result.success) {
    showToast(result.message || 'Appointment cancelled.');
    await loadAppointments();
  } else {
    showToast(result.message || 'Failed to cancel appointment.', 'error');
  }
};
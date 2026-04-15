import { createPatientRecordRow }                  from './components/patientRecordRow.js';
import { getPatientRecords, filterPatientRecords } from './services/patientRecordServices.js';

const token     = localStorage.getItem('token');
const tableBody = document.getElementById('patientRecordTableBody');

document.addEventListener('DOMContentLoaded', async () => {
  await loadPatientRecords();
  setupFilters();
});

async function loadPatientRecords() {
  renderRows(await getPatientRecords(token));
}

function setupFilters() {
  document.getElementById('searchBar')
    .addEventListener('input', filterOnChange);
  document.getElementById('filterStatus')
    .addEventListener('change', filterOnChange);
  document.getElementById('filterDate')
    .addEventListener('change', filterOnChange);
}

async function filterOnChange() {
  const name   = document.getElementById('searchBar').value    || 'null';
  const status = document.getElementById('filterStatus').value || 'null';
  const date   = document.getElementById('filterDate').value   || 'null';
  renderRows(await filterPatientRecords(status, name, date, token));
}

function renderRows(records) {
  tableBody.innerHTML = '';

  if (!records?.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="noPatientRecord">No patient records found.</td>
      </tr>`;
    return;
  }

  records.forEach(record => tableBody.appendChild(createPatientRecordRow(record)));
}
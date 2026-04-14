import { createPatientRecordRow }                        from './components/patientRecordRow.js';
import { getPatientRecords, filterPatientRecords }       from './services/patientRecordServices.js';

const token     = localStorage.getItem('token');
const tableBody = document.getElementById('patientRecordTableBody');

document.addEventListener('DOMContentLoaded', async () => {
  await loadPatientRecords();
  setupFilters();
});

async function loadPatientRecords() {
  tableBody.innerHTML = '';

  try {
    const records = await getPatientRecords(token);

    if (!records || records.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="noPatientRecord">No patient records found.</td>
        </tr>`;
      return;
    }

    records.forEach(record => {
      const row = createPatientRecordRow(record);
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading patient records:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="noPatientRecord">Failed to load patient records.</td>
      </tr>`;
  }
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

  tableBody.innerHTML = '';

  const records = await filterPatientRecords(status, name, date, token);

  if (!records || records.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="noPatientRecord">No records match your search.</td>
      </tr>`;
    return;
  }

  records.forEach(record => {
    const row = createPatientRecordRow(record);
    tableBody.appendChild(row);
  });
}
export function createPatientRecordRow(record) {
  const row = document.createElement('tr');

  const idCell = document.createElement('td');
  idCell.textContent = record.appointmentId || record.id || '—';

  const nameCell = document.createElement('td');
  nameCell.textContent = record.patientName || record.patient?.name || record.name || '—';

  const phoneCell = document.createElement('td');
  phoneCell.textContent = record.patient?.phone || record.phone || '—';

  const emailCell = document.createElement('td');
  emailCell.textContent = record.patient?.email || record.email || '—';

  const dateCell = document.createElement('td');
  const rawDate  = record.appointmentDate || record.date || '';
  dateCell.textContent = rawDate
    ? rawDate.toString().substring(0, 10)
    : '—';

  const timeCell = document.createElement('td');
  const rawTime  = record.appointmentTime || record.time || '';
  timeCell.textContent = rawTime
    ? rawTime.toString().substring(11, 16) || rawTime.toString().toUpperCase()
    : '—';

  const statusCell  = document.createElement('td');
  const statusBadge = document.createElement('span');
  statusBadge.textContent = record.status || '—';
  statusBadge.classList.add(
    'status-badge',
    `status-${(record.status || 'pending').toLowerCase()}`
  );
  statusCell.appendChild(statusBadge);

  const actionsCell = document.createElement('td');
  const viewBtn     = document.createElement('button');
  viewBtn.classList.add('prescription-btn');
  viewBtn.textContent = 'View Details';

  viewBtn.addEventListener('click', () => {
    const patientName   = record.patientName || record.patient?.name || '';
    const appointmentId = record.appointmentId || record.id || '';

    const params = new URLSearchParams({ patientName, appointmentId });
    window.location.href = `../pages/addPrescription.html?${params.toString()}`;
  });

  actionsCell.appendChild(viewBtn);

  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(phoneCell);
  row.appendChild(emailCell);
  row.appendChild(dateCell);
  row.appendChild(timeCell);
  row.appendChild(statusCell);
  row.appendChild(actionsCell);

  return row;
}
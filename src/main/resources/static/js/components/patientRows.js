export function createPatientRow(patient, appointment) {
  const row = document.createElement('tr');

  const idCell = document.createElement('td');
  idCell.textContent = patient.id || '—';

  const nameCell = document.createElement('td');
  nameCell.textContent = patient.name || '—';

  const phoneCell = document.createElement('td');
  phoneCell.textContent = patient.phone || '—';

  const emailCell = document.createElement('td');
  emailCell.textContent = patient.email || '—';

  const prescriptionCell = document.createElement('td');
  const prescriptionBtn  = document.createElement('button');
  prescriptionBtn.classList.add('prescription-btn');
  prescriptionBtn.innerHTML = `
    <img src="../assets/images/addPrescriptionIcon/addPrescription.png"
         alt="Prescription"
         style="width:16px; height:16px;" />
    Add Prescription`;

  prescriptionBtn.addEventListener('click', () => {
    const params = new URLSearchParams({
      patientName:   patient.name   || '',
      appointmentId: appointment?.id || ''
    });
    window.location.href = `../pages/addPrescription.html?${params.toString()}`;
  });

  prescriptionCell.appendChild(prescriptionBtn);

  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(phoneCell);
  row.appendChild(emailCell);
  row.appendChild(prescriptionCell);

  return row;
}
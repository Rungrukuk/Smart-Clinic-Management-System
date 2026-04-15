import { savePrescription, getPrescriptionByAppointment } from './services/prescriptionServices.js';
import { getMe }                                          from './services/authService.js';

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
  const patientName   = getQueryParam('patientName');
  const appointmentId = getQueryParam('appointmentId');

  if (patientName)   document.getElementById('patientName').value   = patientName;
  if (appointmentId) document.getElementById('appointmentId').value = appointmentId;

  if (appointmentId) {
    const existing = await getPrescriptionByAppointment(appointmentId, token);
    if (existing) {
      document.getElementById('medication').value  = existing.medication  || '';
      document.getElementById('dosage').value      = existing.dosage      || '';
      document.getElementById('doctorNotes').value = existing.doctorNotes || '';
    }
  }

  const user      = await getMe(token);
  const isPatient = user?.role === 'PATIENT';

  if (isPatient) {
    document.getElementById('medication').readOnly  = true;
    document.getElementById('dosage').readOnly      = true;
    document.getElementById('doctorNotes').readOnly = true;
    document.querySelector('button')?.remove();
  }
});

window.submitPrescription = async function () {
  const user = await getMe(token);

  if (user?.role !== 'DOCTOR') {
    showToast('You are not authorized to perform this action.', 'error');
    return;
  }

  const medication = document.getElementById('medication').value.trim();
  const dosage     = document.getElementById('dosage').value.trim();

  if (!medication || !dosage) {
    showToast('Please fill in medication and dosage.', 'error');
    return;
  }

  const result = await savePrescription({
    patientName:   getQueryParam('patientName'),
    appointmentId: getQueryParam('appointmentId'),
    medication,
    dosage,
    doctorNotes: document.getElementById('doctorNotes').value.trim()
  }, token);

  showToast(
    result.message || (result.success ? 'Prescription saved!' : 'Failed to save.'),
    result.success ? 'success' : 'error'
  );
};
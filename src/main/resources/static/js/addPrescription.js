import { savePrescription, getPrescriptionByAppointment } from './services/prescriptionServices.js';

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
  const patientName   = getQueryParam('patientName');
  const appointmentId = getQueryParam('appointmentId');

  if (patientName)   document.getElementById('patientName').value   = patientName;
  if (appointmentId) document.getElementById('appointmentId').value = appointmentId;

  if (appointmentId) {
    const existing = await getPrescriptionByAppointment(appointmentId, token);
    if (existing) {
      document.getElementById('medication').value   = existing.medication   || '';
      document.getElementById('dosage').value       = existing.dosage       || '';
      document.getElementById('doctorNotes').value  = existing.doctorNotes  || '';
    }
  }
});

window.submitPrescription = async function () {
  const patientName   = getQueryParam('patientName');
  const appointmentId = getQueryParam('appointmentId');

  const prescriptionData = {
    patientName,
    appointmentId,
    medication:   document.getElementById('medication').value.trim(),
    dosage:       document.getElementById('dosage').value.trim(),
    doctorNotes:  document.getElementById('doctorNotes').value.trim()
  };

  if (!prescriptionData.medication || !prescriptionData.dosage) {
    showToast('Please fill in medication and dosage.', 'error');
    return;
  }

  const result = await savePrescription(prescriptionData, token);

  if (result.success) {
    showToast(result.message || 'Prescription saved successfully!');
    setTimeout(() => history.back(), 1500);
  } else {
    showToast(result.message || 'Failed to save prescription.', 'error');
  }
};
import { updateAppointment } from './services/appointmentRecordService.js';

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
  const appointmentId = getQueryParam('appointmentId') || '';
  const doctorName    = getQueryParam('doctorName')    || '';
  const date          = getQueryParam('date')          || '';
  const time          = getQueryParam('time')          || '';
  const status        = getQueryParam('status')        || 'pending';
  const notes         = getQueryParam('notes')         || '';

  if (!appointmentId) {
    showToast('No appointment ID provided.', 'error');
    return;
  }

  document.getElementById('appointmentId').value     = appointmentId;
  document.getElementById('doctorName').value        = doctorName;
  document.getElementById('appointmentDate').value   = date;
  document.getElementById('appointmentTime').value   = time;
  document.getElementById('appointmentStatus').value = status;
  document.getElementById('appointmentNotes').value  = notes;
});

window.submitUpdate = async function () {
  const appointmentId = getQueryParam('appointmentId');

  const updatedData = {
    id:     appointmentId,
    date:   document.getElementById('appointmentDate').value,
    time:   document.getElementById('appointmentTime').value,
    status: document.getElementById('appointmentStatus').value,
    notes:  document.getElementById('appointmentNotes').value
  };

  if (!updatedData.date || !updatedData.time) {
    showToast('Please fill in date and time.', 'error');
    return;
  }

  const result = await updateAppointment(updatedData, token);

  if (result.success) {
    showToast(result.message || 'Appointment updated successfully!');
    setTimeout(() => history.back(), 1500);
  } else {
    showToast(result.message || 'Failed to update appointment.', 'error');
  }
};
import {
  cancelAppointment,
  updateAppointment,
  getAppointmentById
} from './services/appointmentRecordService.js';

import { getDoctorAvailability } from './services/doctorServices.js';

const token = localStorage.getItem('token');

let currentAppointment = null;

document.addEventListener('DOMContentLoaded', async () => {
  const appointmentId = getQueryParam('appointmentId');

  if (!appointmentId) {
    showToast('No appointment ID provided.', 'error');
    return;
  }

  const res = await getAppointmentById(appointmentId, token);

  if (!res?.success) {
    showToast('Failed to load appointment', 'error');
    return;
  }

  currentAppointment = res.appointment;

  if (!currentAppointment) {
    showToast('Invalid appointment data', 'error');
    return;
  }

  populateForm(currentAppointment);

  document
    .getElementById('appointmentDate')
    ?.addEventListener('change', loadAvailability);

  await loadAvailability();
});

function splitDateTime(dateTime) {
  if (!dateTime) return { date: '', time: '' };

  const [date, timeFull] = dateTime.split('T');
  const time = timeFull?.substring(0, 5);

  return { date, time };
}

function populateForm(a) {
  const { date, time } = splitDateTime(a.appointmentTime);

  document.getElementById('appointmentId').value = a.id;
  document.getElementById('doctorName').value = a.doctorName;

  document.getElementById('appointmentDate').value = date;

  document.getElementById('appointmentStatus').value = String(a.status);

  document.getElementById('appointmentTime').dataset.selectedTime = time;
}

async function loadAvailability() {
  const date = document.getElementById('appointmentDate').value;

  if (!date || !currentAppointment) return;

  const res = await getDoctorAvailability(
    currentAppointment.doctorId,
    date,
    token
  );

  if (!res?.success) {
    showToast('Failed to load availability', 'error');
    return;
  }

  populateTimeDropdown(res.availability || []);
}

function populateTimeDropdown(slots) {
  const select = document.getElementById('appointmentTime');
  const selectedTime = select.dataset.selectedTime;

  select.innerHTML = '<option value="">Select time</option>';

  if (!slots.length) {
    select.innerHTML = '<option value="">No available times</option>';
    return;
  }

  slots.forEach(slot => {
    const [start, end] = slot.split('-');

    const option = document.createElement('option');
    option.value = start;
    option.textContent = `${start} - ${end}`;

    if (start === selectedTime) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}

function buildUpdatePayload() {
  const payload = { id: currentAppointment.id };

  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const status = document.getElementById('appointmentStatus').value;

  if (status !== String(currentAppointment.status)) {
    payload.status = Number(status);
  }

  if (date && time) {
    const newTime = `${date}T${time}`;

    if (newTime.slice(0, 16) !== currentAppointment.appointmentTime.slice(0, 16)) {
      payload.appointmentTime = newTime;
    }
  }

  return payload;
}


function normalize(dt) {
  return dt?.slice(0, 16); 
}


window.submitUpdate = async function () {
  const payload = buildUpdatePayload();

  if (!payload || typeof payload !== 'object') {
    showToast('Internal error: invalid payload', 'error');
    return;
  }

  if (Object.keys(payload).length === 1) {
    showToast('No changes detected');
    return;
  }


  const result = await updateAppointment(payload, token);

  if (result.success) {
    showToast(result.message || 'Updated successfully');
  } else {
    showToast(result.message || 'Update failed', 'error');
  }
};


window.cancelAndGoBack = async function () {
  if (!currentAppointment?.id) return;

  const confirmCancel = confirm('Cancel this appointment?');

  if (!confirmCancel) return;

  const result = await cancelAppointment(currentAppointment.id, token);

  if (result.success) {
    showToast('Appointment cancelled');
    setTimeout(() => history.back(), 800);
  } else {
    showToast(result.message || 'Failed to cancel appointment', 'error');
  }
};

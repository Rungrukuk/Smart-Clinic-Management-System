import { createDoctorCard }                from './components/doctorCard.js';
import { getDoctors, filterDoctors }       from './services/doctorServices.js';
import { bookAppointment }                 from './services/appointmentRecordService.js';
import { getPatientData }                  from './services/patientServices.js';

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
  await loadPatientName();
  loadDoctorCards();
  setupFilters();
});

async function loadPatientName() {
  try {
    const patient = await getPatientData(token);
    const nameEl  = document.getElementById('patientDisplayName');
    if (nameEl && patient?.name) {
      nameEl.textContent = patient.name;
    }
  } catch (e) {
    console.error('Could not load patient name:', e);
  }
}

async function loadDoctorCards() {
  const doctors    = await getDoctors();
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = '';

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = '<p class="noPatientRecord">No doctors available.</p>';
    return;
  }

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

function setupFilters() {
  document.getElementById('searchBar')
    .addEventListener('input', filterDoctorsOnChange);
  document.getElementById('filterTime')
    .addEventListener('change', filterDoctorsOnChange);
  document.getElementById('filterSpecialty')
    .addEventListener('change', filterDoctorsOnChange);
}

async function filterDoctorsOnChange() {
  const name      = document.getElementById('searchBar').value       || 'null';
  const time      = document.getElementById('filterTime').value      || 'null';
  const specialty = document.getElementById('filterSpecialty').value || 'null';

  const doctors    = await filterDoctors(name, time, specialty);
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = '';

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = '<p class="noPatientRecord">No doctors found.</p>';
    return;
  }

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

window.showBookingOverlay = function (e, doctor) {
  const backdrop  = document.getElementById('modalAppBackdrop');
  const modalApp  = document.getElementById('modalApp');
  const modalBody = document.getElementById('modalApp-body');

  if (!backdrop || !modalApp || !modalBody) {
    console.error('Booking overlay elements not found in DOM.');
    return;
  }

  modalBody.innerHTML = `
    <h3>Book Appointment</h3>
    <label>Doctor</label>
    <input type="text" class="input-field" value="Dr. ${doctor.name}" readonly />
    <label>Specialty</label>
    <input type="text" class="input-field" value="${doctor.specialty || ''}" readonly />
    <label for="bookDate">Date</label>
    <input type="date" id="bookDate" class="input-field" min="${getTodayDate()}" />
    <label for="bookTime">Preferred Time</label>
    <select id="bookTime" class="input-field">
      <option value="">Select time</option>
      <option value="09:00">09:00 AM</option>
      <option value="10:00">10:00 AM</option>
      <option value="11:00">11:00 AM</option>
      <option value="13:00">01:00 PM</option>
      <option value="14:00">02:00 PM</option>
      <option value="15:00">03:00 PM</option>
      <option value="16:00">04:00 PM</option>
    </select>
    <button class="confirm-btn" onclick="confirmBooking('${doctor.id}')">
      Confirm Booking
    </button>
  `;

  backdrop.classList.add('active');
  modalApp.classList.add('active');
  backdrop.onclick = () => closeBookingOverlay();
};

window.confirmBooking = async function (doctorId) {
  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;

  if (!date || !time) {
    showToast('Please select both date and time.', 'error');
    return;
  }

  const appointmentTime = `${date}T${time}:00`;
  const result = await bookAppointment({ doctorId, appointmentTime }, token);

  if (result.success) {
    closeBookingOverlay();
    triggerRipple();
    showToast(result.message || 'Appointment booked successfully!');
  } else {
    showToast(result.message || 'Booking failed. Please try again.', 'error');
  }
};

function closeBookingOverlay() {
  document.getElementById('modalAppBackdrop').classList.remove('active');
  document.getElementById('modalApp').classList.remove('active');
}

function triggerRipple() {
  const ripple = document.getElementById('rippleOverlay');
  if (!ripple) return;
  ripple.classList.add('active');
  setTimeout(() => {
    ripple.classList.add('fade-out');
    setTimeout(() => ripple.classList.remove('active', 'fade-out'), 600);
  }, 600);
}
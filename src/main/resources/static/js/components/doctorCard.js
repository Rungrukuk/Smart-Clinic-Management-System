import { getPatientData } from '../services/patientServices.js';

export function createDoctorCard(doctor) {

  const card = document.createElement('div');
  card.classList.add('doctor-card');

  const role = localStorage.getItem('userRole');

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('doctor-info');

  const name = document.createElement('h3');
  name.textContent = doctor.name;

  const specialization = document.createElement('p');
  specialization.classList.add('specialty-badge');
  specialization.textContent = doctor.specialty || '';

  const availability = document.createElement('p');
  availability.classList.add('doctor-availability');
  const times = doctor.availableTimes || [];
  availability.textContent = Array.isArray(times) ? times.join(', ') : times;

  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);

  if (role !== 'patient') {
    const email = document.createElement('p');
    email.classList.add('doctor-email');
    email.textContent = doctor.email;
    infoDiv.appendChild(email);
  }

  infoDiv.appendChild(availability);

  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('card-actions');

  if (role === 'patient') {
    const bookNow = document.createElement('button');
    bookNow.textContent = 'Book Now';
    bookNow.classList.add('button');
    bookNow.addEventListener('click', () => {
      if (typeof window.openModal === 'function') {
        window.openModal('patientLogin');
      }
    });
    actionsDiv.appendChild(bookNow);

  } else if (role === 'loggedPatient') {
    const bookNow = document.createElement('button');
    bookNow.textContent = 'Book Now';
    bookNow.classList.add('button');
    bookNow.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      try {
        const patientData = await getPatientData(token);
        if (typeof window.showBookingOverlay === 'function') {
          window.showBookingOverlay(null, doctor, patientData);
        }
      } catch (error) {
        showToast('Could not load your details. Please try again.', 'error');
      }
    });
    actionsDiv.appendChild(bookNow);
  }

  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);

  return card;
}
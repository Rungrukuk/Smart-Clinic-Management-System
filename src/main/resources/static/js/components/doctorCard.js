export function createDoctorCard(doctor, { role, onBook } = {}) {
  const card = document.createElement('div');
  card.classList.add('doctor-card');

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('doctor-info');

  const name = document.createElement('h3');
  name.textContent = doctor.name;

  const specialization = document.createElement('p');
  specialization.classList.add('specialty-badge');
  specialization.textContent = doctor.specialty || '—';

  const availability = document.createElement('p');
  availability.classList.add('doctor-availability');
  availability.textContent = (doctor.availableTimes || []).join(', ');

  infoDiv.append(name, specialization);

  if (role !== 'patient' && role !== 'loggedPatient') {
    const email = document.createElement('p');
    email.classList.add('doctor-email');
    email.textContent = doctor.email || '—';
    infoDiv.appendChild(email);
  }

  infoDiv.appendChild(availability);

  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('card-actions');

  const bookBtn = document.createElement('button');
  bookBtn.textContent = 'Book Appointment';
  bookBtn.classList.add('button');

  bookBtn.addEventListener('click', () => {
    if (typeof onBook === 'function') {
      onBook(doctor);
    }
  });

  if (role === 'patient' || role === 'loggedPatient') {
    actionsDiv.appendChild(bookBtn);
  }

  card.append(infoDiv, actionsDiv);

  return card;
}

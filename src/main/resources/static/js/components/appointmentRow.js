export function createAppointmentRow(appointment) {
  const row = document.createElement('tr');

  const idCell = document.createElement('td');
  idCell.textContent = appointment.id || '—';

  const doctorCell = document.createElement('td');
  doctorCell.textContent = appointment.doctorName || appointment.doctor?.name || '—';

  const specialtyCell = document.createElement('td');
  specialtyCell.textContent =
    appointment.specialization || appointment.doctor?.specialization || '—';

  const dateCell = document.createElement('td');
  dateCell.textContent = appointment.date || '—';

  const timeCell = document.createElement('td');
  timeCell.textContent = appointment.time
    ? appointment.time.toString().toUpperCase()
    : '—';

  const statusCell  = document.createElement('td');
  const statusBadge = document.createElement('span');
  statusBadge.textContent = appointment.status || '—';
  statusBadge.classList.add(
    'status-badge',
    `status-${(appointment.status || 'pending').toLowerCase()}`
  );
  statusCell.appendChild(statusBadge);

  const actionsCell = document.createElement('td');
  const isPending   = !appointment.status ||
                      appointment.status.toLowerCase() === 'pending';

  if (isPending) {
    const editBtn = document.createElement('button');
    editBtn.classList.add('adminBtn');
    editBtn.innerHTML = `
      <img src="../assets/images/edit/edit.png"
           alt="Edit" style="width:14px; height:14px;" />
      Update`;

    editBtn.addEventListener('click', () => {
      const params = new URLSearchParams({
        appointmentId: appointment.id                                    || '',
        doctorName:    appointment.doctorName || appointment.doctor?.name || '',
        date:          appointment.date                                  || '',
        time:          appointment.time                                  || '',
        status:        appointment.status                                || 'pending',
        notes:         appointment.notes                                 || ''
      });
      window.location.href =
        `../pages/updateAppointment.html?${params.toString()}`;
    });

    actionsCell.appendChild(editBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('danger-btn');
    cancelBtn.textContent = 'Cancel';

    cancelBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        window.cancelAppointment(appointment.id);
      }
    });

    actionsCell.appendChild(cancelBtn);
  }

  row.appendChild(idCell);
  row.appendChild(doctorCell);
  row.appendChild(specialtyCell);
  row.appendChild(dateCell);
  row.appendChild(timeCell);
  row.appendChild(statusCell);
  row.appendChild(actionsCell);

  return row;
}
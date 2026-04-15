function createCell(text = '—') {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

function formatDateTime(dateTime) {
  if (!dateTime) return { date: '—', time: '—' };

  const str = dateTime.toString();

  return {
    date: str.substring(0, 10),
    time: str.substring(11, 16)
  };
}

function getStatusText(status) {
  const statusMap = {
    0: 'scheduled',
    1: 'completed',
    2: 'cancelled'
  };

  return statusMap[status] || 'pending';
}

function createStatusCell(status) {
  const statusText = getStatusText(status);

  const td = document.createElement('td');
  const badge = document.createElement('span');

  badge.textContent = statusText;
  badge.classList.add('status-badge', `status-${statusText}`);

  td.appendChild(badge);

  return { td, statusText };
}

function createActionsCell(appointment, role) {
  const td = document.createElement('td');

  const statusText = getStatusText(appointment.status);

  if (statusText === 'completed') {
    const btn = document.createElement('button');
    btn.textContent = role === 'doctor' ? 'Edit Prescription' : 'View Prescription';
    btn.classList.add('button');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const params = new URLSearchParams({
        appointmentId: appointment.id,
        patientName: appointment.patient?.name || appointment.patientName
      });

      window.location.href = `../pages/prescription.html?${params.toString()}`;
    });

    td.appendChild(btn);
    return td;
  }

  if (statusText === 'scheduled') {
    const btn = document.createElement('button');
    btn.textContent = 'Edit';
    btn.classList.add('button');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const params = new URLSearchParams({
        appointmentId: appointment.id
      });

      window.location.href =
        `../pages/updateAppointment.html?${params.toString()}`;
    });

    td.appendChild(btn);
    return td;
  }

  const label = document.createElement('span');
  label.textContent = '—';
  label.classList.add('status-label');

  td.appendChild(label);
  return td;
}




export function createPatientAppointmentRow(appointment) {
  const row = document.createElement('tr');
  
  const { date, time } = formatDateTime(appointment.appointmentTime);
  const { td: statusCell } = createStatusCell(appointment.status);

  const doctorName =
    appointment.doctorName ||
    appointment.doctor?.name ||
    `Doctor #${appointment.doctorId}`;

  const specialty =
    appointment.doctorSpeciality ||
    appointment.doctor?.specialty ||
    '—';

  row.appendChild(createCell(appointment.id));
  row.appendChild(createCell(doctorName));
  row.appendChild(createCell(specialty));
  row.appendChild(createCell(date));
  row.appendChild(createCell(time));
  row.appendChild(statusCell);

  const role = 'patient';
  row.appendChild(createActionsCell(appointment, role));

  return row;
}



export function createDoctorAppointmentRow(appointment) {
  const row = document.createElement('tr');

  const patient = appointment.patient || {};
  const { date, time } = formatDateTime(appointment.appointmentTime);
  const { td: statusCell } = createStatusCell(appointment.status);

  row.appendChild(createCell(appointment.id));
  row.appendChild(createCell(patient.name));
  row.appendChild(createCell(patient.phone));
  row.appendChild(createCell(patient.email));
  row.appendChild(createCell(date));
  row.appendChild(createCell(time));
  row.appendChild(statusCell);

  const role = 'doctor';
  row.appendChild(createActionsCell(appointment, role));

  return row;
}
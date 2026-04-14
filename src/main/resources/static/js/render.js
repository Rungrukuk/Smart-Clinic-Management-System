function selectRole(role) {
  localStorage.setItem('userRole', role);

  switch (role) {
    case 'admin':
      window.location.href = '/admin/adminDashboard';
      break;
    case 'doctor':
      window.location.href = '/doctor/doctorDashboard';
      break;
    case 'patient':
      window.location.href = '/pages/patientDashboard.html';
      break;
    case 'loggedPatient':
      window.location.href = '/pages/loggedPatientDashboard.html';
      break;
    default:
      window.location.href = '/';
  }
}

function renderContent() {
  const role = localStorage.getItem('userRole');
  if (!role) {
    window.location.href = '/';
  }
}

window.selectRole    = selectRole;
window.renderContent = renderContent;
function selectRole(role) {
  switch (role) {
    case 'ADMIN':
      window.location.href = '/admin/adminDashboard';
      break;
    case 'DOCTOR':
      window.location.href = '/doctor/doctorDashboard';
      break;
    case 'PATIENT':
      window.location.href = '/pages/patientDashboard.html';
      break;
    case 'patient':
      window.location.href = '/pages/patientDashboard.html';
      break;
    default:
      window.location.href = '/';
  }
}

function renderContent() {}

window.selectRole    = selectRole;
window.renderContent = renderContent;
async function renderHeader() {
  const path  = window.location.pathname;
  const token = localStorage.getItem('token');

  if (path === '/' || path.endsWith('index.html')) {
    localStorage.removeItem('token');
  }

  const headerDiv = document.getElementById('header');
  if (!headerDiv) return;

  let role = null;
  let name = null

  if (token) {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const user = await res.json();
        role = user.role;
        name = user.name;
        window.__currentUser = user; 
      } else {
        localStorage.removeItem('token');
        if (path !== '/' && !path.endsWith('index.html')) {
          alert('Session expired. Please log in again.');
          window.location.href = '/';
          return;
        }
      }
    } catch (e) {
      console.error('Session check failed:', e);
    }
  }

  let nav = '';

  if (role === 'ADMIN') {
    nav = `<a href="#" onclick="logout()">Logout</a>`;
  } else if (role === 'DOCTOR') {
    nav = `<a href="#" onclick="logout()">Logout</a>`;
  } else if (role === 'PATIENT') {
    nav = `<span style="margin: 10px">${name}</span>
    <a href="#" style="margin: 10px" onclick="logout()">Logout</a>`;
  } else {
    const isPatientDashboard = path.endsWith('patientDashboard.html');

    if (isPatientDashboard) {
      nav = `
        <button id="patientLogin" class="button">Login</button>
        <button id="patientSignup" class="adminBtn">Sign Up</button>`;
    } else {
      nav = '';
    }
  }


  headerDiv.innerHTML = `
    <div class="header">
      <div class="logo">Smart<span>Clinic</span></div>
      <nav>${nav}</nav>
    </div>`;

  attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
  document.getElementById('patientLogin')?.addEventListener('click', () => {
    window.openModal?.('patientLogin');
  });
  document.getElementById('patientSignup')?.addEventListener('click', () => {
    window.openModal?.('patientSignup');
  });
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

window.logout = logout;
renderHeader();
function renderHeader() {

  if (window.location.pathname === "/" ||
      window.location.pathname.endsWith("index.html")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  }

  const role  = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  const headerDiv = document.getElementById("header");
  if (!headerDiv) return;

  let headerContent = `
    <div class="header">
      <div class="logo">Smart<span>Clinic</span></div>
      <nav>`;

  if (role === "admin") {
    headerContent += `
        <a href="#" onclick="logout()">Logout</a>`;

  } else if (role === "doctor") {
    headerContent += `
        <a href="/">Home</a>
        <a href="#" onclick="logout()">Logout</a>`;

  } else if (role === "patient") {
    headerContent += `
        <button id="patientLogin" class="button">Login</button>
        <button id="patientSignup" class="adminBtn">Sign Up</button>`;

  } else if (role === "loggedPatient") {
    headerContent += `
        <a href="/">Home</a>
        <a href="../pages/patientAppointments.html">Appointments</a>
        <a href="#" onclick="logoutPatient()">Logout</a>`;
  }

  headerContent += `
      </nav>
    </div>`;

  headerDiv.innerHTML = headerContent;
  attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (typeof window.openModal === "function") {
        window.openModal("patientLogin");
      }
    });
  }

  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      if (typeof window.openModal === "function") {
        window.openModal("patientSignup");
      }
    });
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/";
}

function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.setItem("userRole", "patient");
  window.location.href = "/pages/patientDashboard.html";
}

renderHeader();
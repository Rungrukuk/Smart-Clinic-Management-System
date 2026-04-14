const modalTemplates = {

  adminLogin: `
    <h2>Admin Login</h2>
    <label for="adminUsername">Username</label>
    <input type="text" id="adminUsername" class="input-field" placeholder="Enter username" />
    <label for="adminPassword">Password</label>
    <input type="password" id="adminPassword" class="input-field" placeholder="Enter password" />
    <button class="button" onclick="adminLoginHandler()">Login</button>`,

  doctorLogin: `
    <h2>Doctor Login</h2>
    <label for="doctorEmail">Email</label>
    <input type="email" id="doctorEmail" class="input-field" placeholder="Enter email" />
    <label for="doctorPassword">Password</label>
    <input type="password" id="doctorPassword" class="input-field" placeholder="Enter password" />
    <button class="button" onclick="doctorLoginHandler()">Login</button>`,

  patientLogin: `
    <h2>Patient Login</h2>
    <label for="loginEmail">Email</label>
    <input type="email" id="loginEmail" class="input-field" placeholder="Enter email" />
    <label for="loginPassword">Password</label>
    <input type="password" id="loginPassword" class="input-field" placeholder="Enter password" />
    <button class="button" onclick="loginPatient()">Login</button>`,

  patientSignup: `
    <h2>Patient Sign Up</h2>
    <label for="signupName">Full Name</label>
    <input type="text" id="signupName" class="input-field" placeholder="Enter full name" />
    <label for="signupEmail">Email</label>
    <input type="email" id="signupEmail" class="input-field" placeholder="Enter email" />
    <label for="signupPassword">Password</label>
    <input type="password" id="signupPassword" class="input-field" placeholder="Enter password" />
    <label for="signupPhone">Phone</label>
    <input type="text" id="signupPhone" class="input-field" placeholder="Enter phone number (10 digits)" />
    <label for="signupAddress">Address</label>
    <input type="text" id="signupAddress" class="input-field" placeholder="Enter address" />
    <button class="button" onclick="signupPatient()">Sign Up</button>`,

  addDoctor: `
    <h2>Add Doctor</h2>
    <label for="doctorName">Full Name</label>
    <input type="text" id="doctorName" class="input-field" placeholder="Enter full name" />

    <label for="doctorSpecialty">Specialization</label>
    <input type="text" id="doctorSpecialty" class="input-field" placeholder="e.g. Cardiology" />

    <label for="doctorEmail">Email</label>
    <input type="email" id="doctorEmail" class="input-field" placeholder="Enter email" />

    <label for="doctorPassword">Password</label>
    <input type="password" id="doctorPassword" class="input-field" placeholder="Enter password" />

    <label for="doctorMobile">Phone (10 digits)</label>
    <input type="text" id="doctorMobile" class="input-field" placeholder="Enter phone number" />

    <label>Availability</label>
    <div class="checkbox-group">
      <label><input type="checkbox" name="availability" value="mon-am" /> Mon AM</label>
      <label><input type="checkbox" name="availability" value="mon-pm" /> Mon PM</label>
      <label><input type="checkbox" name="availability" value="tue-am" /> Tue AM</label>
      <label><input type="checkbox" name="availability" value="tue-pm" /> Tue PM</label>
      <label><input type="checkbox" name="availability" value="wed-am" /> Wed AM</label>
      <label><input type="checkbox" name="availability" value="wed-pm" /> Wed PM</label>
      <label><input type="checkbox" name="availability" value="thu-am" /> Thu AM</label>
      <label><input type="checkbox" name="availability" value="thu-pm" /> Thu PM</label>
      <label><input type="checkbox" name="availability" value="fri-am" /> Fri AM</label>
      <label><input type="checkbox" name="availability" value="fri-pm" /> Fri PM</label>
    </div>
    <button class="button" onclick="adminAddDoctor()">Add Doctor</button>`
};

export function openModal(type) {
  const modal     = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');

  if (!modal || !modalBody) return;

  const template = modalTemplates[type];
  if (!template) {
    console.warn(`No modal template found for type: "${type}"`);
    return;
  }

  modalBody.innerHTML = template;
  modal.classList.add('active');
}

export function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
});

window.openModal  = openModal;
window.closeModal = closeModal;
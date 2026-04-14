# User Stories

---

## Admin User Stories

---

**Title:** Admin Login

_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**
1. The admin can navigate to the login page and enter a valid username and password.
2. The system authenticates the credentials and redirects the admin to the dashboard upon success.
3. An error message is displayed if the credentials are invalid, without revealing which field is incorrect.

**Priority:** High
**Story Points:** 3
**Notes:**

---

**Title:** Admin Logout

_As an admin, I want to log out of the portal, so that I can protect system access when I am done._

**Acceptance Criteria:**
1. The admin can click a logout button available on all authenticated pages.
2. The session is invalidated and the admin is redirected to the login page.
3. Accessing any protected page after logout redirects the user back to the login page.

**Priority:** High
**Story Points:** 1
**Notes:**
- The session should also expire automatically after a period of inactivity.

---

**Title:** Add Doctor

_As an admin, I want to add a doctor to the portal, so that patients can view and book appointments with them._

**Acceptance Criteria:**
1. The admin can fill in a form with the doctor's name, specialization, email, and contact information.
2. The system saves the new doctor profile and displays it in the doctor listing.
3. A validation error is shown if any required fields are missing or incorrectly formatted.

**Priority:** High
**Story Points:** 5
**Notes:**
- The system should prevent duplicate doctor entries with the same email address.

---

**Title:** Delete Doctor Profile
_As an admin, I want to update doctors profile._

**Acceptance Criteria:**
1. The admin will be able to update doctor's fields through frontend
2. The system must validate that only authenticated admins (via token) can update doctor profiles; unauthorized requests must be rejected with an appropriate error message.
3. When updating a doctor, only valid and non-null fields should be modified, while existing data remains unchanged for fields not provided in the request.

**Priority:** Medium
**Story Points:** 4
**Notes:**

**Title:** View Appointment Statistics

_As an admin, I want to run a stored procedure in the MySQL CLI to get the number of appointments per month, so that I can track platform usage statistics._

**Acceptance Criteria:**
1. A stored procedure exists in MySQL that accepts a date range and returns the count of appointments grouped by month.
2. The procedure executes without errors and returns accurate results.
3. Results include the month, year, and total appointment count for each period.

**Priority:** Medium
**Story Points:** 3
**Notes:**

---

## Patient User Stories

---

**Title:** Browse Doctors Without Logging In

_As a patient, I want to view a list of doctors without logging in, so that I can explore my options before deciding to register._

**Acceptance Criteria:**
1. The doctor listing page is publicly accessible without requiring authentication.
2. Each doctor entry displays their name, specialization, and availability status.
3. Attempting to book an appointment redirects the user to the login or registration page.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Sensitive information such as contact details should not be visible to unauthenticated users.

---

**Title:** Patient Registration

_As a patient, I want to sign up using my email and password, so that I can book appointments on the portal._

**Acceptance Criteria:**
1. The patient can access a registration form and submit their email and password.
2. The system validates that the email is unique and the password meets the required strength criteria.
3. A confirmation message is shown upon successful registration and the patient can log in immediately.

**Priority:** High
**Story Points:** 5
**Notes:**
- Passwords must be confirmed via a repeat password field.

---

**Title:** Patient Login

_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. The patient can enter their registered email and password on the login page.
2. Successful authentication redirects the patient to their personal dashboard.
3. An appropriate error message is displayed for invalid credentials.

**Priority:** High
**Story Points:** 3
**Notes:**
- Sessions should expire after a period of inactivity to protect patient data.

---

**Title:** Patient Logout

_As a patient, I want to log out of the portal, so that I can secure my account when I am finished._

**Acceptance Criteria:**
1. A logout option is available on all authenticated patient pages.
2. The session is invalidated upon logout and the patient is redirected to the login page.
3. Navigating back after logout does not grant access to protected pages.

**Priority:** High
**Story Points:** 1
**Notes:**
- The session should automatically expire after a configured period of inactivity.

---

**Title:** Book an Appointment

_As a patient, I want to book an hour-long appointment with a doctor, so that I can consult with them at a convenient time._

**Acceptance Criteria:**
1. The patient can select a doctor, choose an available date, and pick an available one-hour time slot.
2. The system confirms the booking and displays the appointment details on the patient's dashboard.
3. Unavailable or already-booked time slots are clearly indicated and cannot be selected.

**Priority:** High
**Story Points:** 8
**Notes:**
- Each appointment is fixed at one hour in duration.
- The system must prevent double-booking the same time slot.

---

**Title:** View Upcoming Appointments

_As a patient, I want to view my upcoming appointments, so that I can prepare accordingly._

**Acceptance Criteria:**
1. The patient dashboard displays a list of all upcoming appointments sorted by date and time.
2. Each entry shows the doctor's name, specialization, date, and time of the appointment.
3. Past appointments are not shown in the upcoming list but can be accessed in a separate history view.

**Priority:** High
**Story Points:** 3
**Notes:**
- The patient should be able to cancel an upcoming appointment directly from this view.

---

## Doctor User Stories

---

**Title:** Doctor Login

_As a doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**
1. The doctor can enter their credentials on the login page and be authenticated.
2. Successful login redirects the doctor to their personal dashboard.
3. An error message is shown for invalid credentials without revealing which field is incorrect.

**Priority:** High
**Story Points:** 3
**Notes:**
- Doctor accounts are created by an admin and should not be self-registered.

---

**Title:** Doctor Logout

_As a doctor, I want to log out of the portal, so that I can protect my data when I am finished._

**Acceptance Criteria:**
1. A logout button is accessible on all authenticated doctor pages.
2. The session is invalidated and the doctor is redirected to the login page upon logout.
3. Protected pages cannot be accessed after the session has ended.

**Priority:** High
**Story Points:** 1
**Notes:**
- Sessions should expire automatically after a period of inactivity.

---

**Title:** View Appointment Calendar

_As a doctor, I want to view my appointment calendar, so that I can stay organised and plan my day._

**Acceptance Criteria:**
1. The doctor dashboard displays a calendar view showing all upcoming appointments.
2. Each appointment entry shows the patient's name, date, and time.
3. The doctor can switch between daily, weekly, and monthly calendar views.

**Priority:** High
**Story Points:** 5
**Notes:**
- Cancelled appointments should be visually distinguished or hidden from the calendar.

---

**Title:** Mark Unavailability

_As a doctor, I want to mark my unavailability, so that patients can only see and book available time slots._

**Acceptance Criteria:**
1. The doctor can select specific dates or time ranges and mark them as unavailable.
2. Marked slots are immediately removed from the patient-facing booking view.
3. The doctor can review and remove previously set unavailability blocks.

**Priority:** High
**Story Points:** 5
**Notes:**
- The system should prevent marking a time slot as unavailable if an appointment is already booked for that slot. The doctor must cancel the appointment first.

---

**Title:** Update Doctor Profile

_As a doctor, I want to update my profile with my specialization and contact information, so that patients have access to accurate and up-to-date information._

**Acceptance Criteria:**
1. The doctor can access a profile settings page and edit their specialization and contact details.
2. Changes are saved successfully and immediately reflected on the public-facing doctor listing.
3. Validation errors are shown if required fields are left empty or incorrectly formatted.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Core account details such as email should only be editable by an admin.

---

**Title:** View Patient Details for Upcoming Appointments

_As a doctor, I want to view the patient details for my upcoming appointments, so that I can be prepared before the consultation._

**Acceptance Criteria:**
1. The doctor can select an upcoming appointment and view the associated patient's details.
2. Displayed information includes the patient's name, contact information, and appointment time.
3. Patient details are only visible for appointments assigned to the logged-in doctor.

**Priority:** High
**Story Points:** 3
**Notes:**
- Access to patient details must be restricted to the doctor assigned to that appointment to comply with data privacy requirements.
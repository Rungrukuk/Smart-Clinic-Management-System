## MySQL Database Design

### Table: patients

* id: INT, Primary Key, Auto Increment
* name: VARCHAR(100), Not Null
* email: VARCHAR(100), Unique, Not Null
* password: VARCHAR(255), Not Null
* phone: VARCHAR(15), Not Null
* address: VARCHAR(255), Not Null

### Table: doctors

* id: INT, Primary Key, Auto Increment
* name: VARCHAR(100), Not Null
* specialty: VARCHAR(50), Not Null
* email: VARCHAR(100), Unique, Not Null
* password: VARCHAR(255), Not Null
* phone: VARCHAR(15), Not Null

### Table: appointments

* id: INT, Primary Key, Auto Increment
* doctor_id: INT, Foreign Key → doctors(id), Not Null
* patient_id: INT, Foreign Key → patients(id), Not Null
* appointment_time: DATETIME, Not Null
* status: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)

### Table: admins

* id: INT, Primary Key, Auto Increment
* username: VARCHAR(50), Unique, Not Null
* password: VARCHAR(255), Not Null

---

## MongoDB Collection Design

### Collection: prescriptions

* _id: ObjectId, Primary Key
* patient_name: STRING
* appointment_id: INT
* medication: STRING
* dosage: STRING
* doctor_notes: STRING
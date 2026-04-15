package com.rungrukuk.smart_clinic_management_system.service;

import com.rungrukuk.smart_clinic_management_system.domain.Appointment;
import com.rungrukuk.smart_clinic_management_system.domain.Doctor;
import com.rungrukuk.smart_clinic_management_system.dto.LoginDTO;
import com.rungrukuk.smart_clinic_management_system.repository.AppointmentRepository;
import com.rungrukuk.smart_clinic_management_system.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private TokenService tokenService;

    public ResponseEntity<Map<String, Object>> login(LoginDTO login) {
        Doctor doctor = doctorRepository.findByEmail(login.getIdentifier());

        if (doctor == null || !doctor.getPassword().equals(login.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        String token = tokenService.generateToken(
                doctor.getId().toString(),
                "DOCTOR",
                doctor.getName());

        return ResponseEntity.ok(Map.of("token", token, "message", "Login successful"));
    }

    public ResponseEntity<Map<String, Object>> getDoctorsResponse() {
        return ResponseEntity.ok(Map.of("doctors", doctorRepository.findAll()));
    }

    public ResponseEntity<Map<String, Object>> availabilityResponse(Long doctorId, LocalDate date) {
        return ResponseEntity.ok(Map.of("availability", getDoctorAvailability(doctorId, date)));
    }

    public ResponseEntity<Map<String, Object>> addDoctor(Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()) != null) {
            return ResponseEntity.status(409).body(Map.of("message", "Doctor already exists"));
        }
        try {
            doctorRepository.save(doctor);
            return ResponseEntity.status(201).body(Map.of("message", "Doctor added to db"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Some internal error occurred"));
        }
    }

    public ResponseEntity<Map<String, Object>> updateDoctor(Doctor doctor) {
        if (doctorRepository.findById(doctor.getId()).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }
        try {
            doctorRepository.save(doctor);
            return ResponseEntity.ok(Map.of("message", "Doctor updated"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Some internal error occurred"));
        }
    }

    public ResponseEntity<Map<String, Object>> deleteDoctor(long id) {
        if (doctorRepository.findById(id).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found with id"));
        }
        try {
            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Some internal error occurred"));
        }
    }

    public ResponseEntity<Map<String, Object>> filterDoctorsByName(String name) {
        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        return ResponseEntity.ok(Map.of("doctors", doctors));
    }

    public ResponseEntity<Map<String, Object>> filterDoctors(
            String name,
            String specialty,
            String time) {

        List<Doctor> doctors;

        boolean hasName = name != null && !name.equalsIgnoreCase("null") && !name.isBlank();
        boolean hasSpecialty = specialty != null && !specialty.equalsIgnoreCase("null") && !specialty.isBlank();
        boolean hasTime = time != null && !time.equalsIgnoreCase("null") && !time.isBlank();

        if (hasSpecialty && hasTime) {
            doctors = doctorRepository.findBySpecialtyAndTime(specialty, time);
        }

        else if (hasSpecialty) {
            doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        }

        else if (hasName) {
            doctors = doctorRepository.findByNameLike(name);
        }

        else {
            doctors = doctorRepository.findAll();
        }

        if (hasName && (hasSpecialty || hasTime)) {
            doctors = doctors.stream()
                    .filter(d -> d.getName().toLowerCase().contains(name.toLowerCase()))
                    .toList();
        }

        return ResponseEntity.ok(Map.of("doctors", doctors));
    }

    public List<String> getDoctorAvailability(Long doctorId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);

        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, start,
                end);

        Optional<Doctor> optionalDoctor = doctorRepository.findById(doctorId);
        if (optionalDoctor.isEmpty())
            return new ArrayList<>();

        List<String> availableSlots = new ArrayList<>(optionalDoctor.get().getAvailableTimes());

        for (Appointment a : appointments) {
            String appointmentTime = a.getAppointmentTime()
                    .toLocalTime()
                    .toString()
                    .substring(0, 5);

            availableSlots.removeIf(slot -> {
                String slotStart = slot.split("-")[0];
                return slotStart.equals(appointmentTime);
            });
        }

        return availableSlots;
    }
}
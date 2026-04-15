package com.rungrukuk.smart_clinic_management_system.service;

import com.rungrukuk.smart_clinic_management_system.domain.Patient;
import com.rungrukuk.smart_clinic_management_system.dto.AppointmentDTO;
import com.rungrukuk.smart_clinic_management_system.dto.LoginDTO;
import com.rungrukuk.smart_clinic_management_system.repository.AppointmentRepository;
import com.rungrukuk.smart_clinic_management_system.repository.PatientRepository;
import com.rungrukuk.smart_clinic_management_system.security.SecurityUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private TokenService tokenService;

    public ResponseEntity<Map<String, Object>> login(LoginDTO login) {
        Patient patient = patientRepository.findByEmail(login.getIdentifier());

        if (patient == null || !patient.getPassword().equals(login.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        String token = tokenService.generateToken(
                patient.getId().toString(),
                "PATIENT",
                patient.getName());

        return ResponseEntity.ok(Map.of("token", token, "message", "Login successful"));
    }

    public ResponseEntity<Map<String, Object>> createPatient(Patient patient) {
        if (!isUnique(patient)) {
            return ResponseEntity.status(409).body(
                    Map.of("message", "Patient with email or phone already exists"));
        }
        try {
            patientRepository.save(patient);
            return ResponseEntity.status(201).body(Map.of("message", "Signup successful"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error"));
        }
    }

    public ResponseEntity<Map<String, Object>> getPatientDetails() {
        Long patientId = Long.parseLong(SecurityUtils.getCurrentUser().id());
        Patient patient = patientRepository.findById(patientId).orElse(null);

        if (patient == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Patient not found"));
        }
        return ResponseEntity.ok(Map.of("patient", patient));
    }

    public ResponseEntity<Map<String, Object>> getPatientAppointment(Long id) {
        Patient patient = patientRepository.findById(id).orElse(null);
        if (patient == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Patient not found"));
        }

        List<AppointmentDTO> dtoList = appointmentRepository.findByPatientId(id)
                .stream().map(AppointmentDTO::new).toList();

        return ResponseEntity.ok(Map.of("appointments", dtoList));
    }

    public ResponseEntity<Map<String, Object>> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return ResponseEntity.ok(Map.of("patients", patients));
    }

    public ResponseEntity<Map<String, Object>> filterAppointments(String condition, String name) {
        Long patientId = Long.parseLong(SecurityUtils.getCurrentUser().id());

        if (condition != null && name != null) {
            return filterByDoctorAndCondition(condition, name, patientId);
        } else if (condition != null) {
            return filterByCondition(condition, patientId);
        } else if (name != null) {
            return filterByDoctor(name, patientId);
        }

        return ResponseEntity.badRequest().body(Map.of("message", "No filter applied"));
    }

    private boolean isUnique(Patient patient) {
        return patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone()) == null;
    }

    private ResponseEntity<Map<String, Object>> filterByCondition(String condition, Long id) {
        int status;
        if ("past".equalsIgnoreCase(condition))
            status = 1;
        else if ("future".equalsIgnoreCase(condition))
            status = 0;
        else
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid condition"));

        List<AppointmentDTO> dtoList = appointmentRepository
                .findByPatient_IdAndStatusOrderByAppointmentTimeAsc(id, status)
                .stream().map(AppointmentDTO::new).toList();

        return ResponseEntity.ok(Map.of("appointments", dtoList));
    }

    private ResponseEntity<Map<String, Object>> filterByDoctor(String name, Long patientId) {
        List<AppointmentDTO> dtoList = appointmentRepository.filterByDoctorNameAndPatientId(name, patientId)
                .stream().map(AppointmentDTO::new).toList();

        return ResponseEntity.ok(Map.of("appointments", dtoList));
    }

    private ResponseEntity<Map<String, Object>> filterByDoctorAndCondition(String condition,
            String name,
            long patientId) {
        int status;
        if ("past".equalsIgnoreCase(condition))
            status = 1;
        else if ("future".equalsIgnoreCase(condition))
            status = 0;
        else
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid condition"));

        List<AppointmentDTO> dtoList = appointmentRepository
                .filterByDoctorNameAndPatientIdAndStatus(name, patientId, status)
                .stream().map(AppointmentDTO::new).toList();

        return ResponseEntity.ok(Map.of("appointments", dtoList));
    }
}
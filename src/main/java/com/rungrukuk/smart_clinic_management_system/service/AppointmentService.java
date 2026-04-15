package com.rungrukuk.smart_clinic_management_system.service;

import com.rungrukuk.smart_clinic_management_system.domain.Appointment;
import com.rungrukuk.smart_clinic_management_system.domain.Doctor;
import com.rungrukuk.smart_clinic_management_system.dto.AppointmentDTO;
import com.rungrukuk.smart_clinic_management_system.repository.AppointmentRepository;
import com.rungrukuk.smart_clinic_management_system.repository.DoctorRepository;
import com.rungrukuk.smart_clinic_management_system.repository.PatientRepository;
import com.rungrukuk.smart_clinic_management_system.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    public ResponseEntity<Map<String, Object>> bookAppointment(AppointmentDTO dto) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId()).orElse(null);
        if (doctor == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }

        if (!isSlotAvailable(doctor, dto.getAppointmentTime())) {
            return ResponseEntity.status(409).body(Map.of("message", "Time slot unavailable"));
        }

        try {
            Long patientId = Long.parseLong(SecurityUtils.getCurrentUser().id());
            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor);
            appointment.setPatient(patientRepository.findById(patientId).get());
            appointment.setStatus(0);
            appointment.setAppointmentTime(dto.getAppointmentTime());
            appointmentRepository.save(appointment);
            return ResponseEntity.status(201).body(Map.of("message", "Appointment booked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error booking appointment"));
        }
    }

    public ResponseEntity<Map<String, Object>> updateAppointment(AppointmentDTO dto) {

        if (dto.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Appointment ID required"));
        }

        Appointment appointment = appointmentRepository.findById(dto.getId()).orElse(null);

        if (appointment == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Appointment not found"));
        }

        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(dto.getDoctorId()).orElse(null);
            if (doctor == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
            }
            appointment.setDoctor(doctor);
        }
        if (dto.getStatus() != null) {
            appointment.setStatus(dto.getStatus());
        }
        if (dto.getAppointmentTime() != null) {
            appointment.setAppointmentTime(dto.getAppointmentTime());
        }

        if (!isValidAppointment(appointment)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid appointment data"));
        }

        appointmentRepository.save(appointment);

        return ResponseEntity.ok(Map.of("message", "Appointment updated successfully"));
    }

    public ResponseEntity<Map<String, Object>> cancelAppointment(long id) {
        Optional<Appointment> opt = appointmentRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Appointment not found"));
        }

        Appointment appointment = opt.get();
        if (appointment.getStatus() != 0) {
            return ResponseEntity.status(400).body(
                    Map.of("message", "Cannot cancel a completed or already cancelled appointment"));
        }

        Long patientId = Long.parseLong(SecurityUtils.getCurrentUser().id());
        if (!appointment.getPatient().getId().equals(patientId)) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized to cancel this appointment"));
        }

        appointment.setStatus(2);
        appointmentRepository.save(appointment);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
    }

    public ResponseEntity<Map<String, Object>> getAppointmentById(Long Id) {
        Appointment appointment = appointmentRepository
                .findById(Id).orElse(null);
        if (appointment == null) {
            ResponseEntity.status(404)
                    .body(Map.of("message", "Appointment not found"));
        }
        AppointmentDTO dto = new AppointmentDTO(appointment);
        return ResponseEntity.ok(Map.of("appointment", dto));
    }

    public ResponseEntity<Map<String, Object>> getAppointment(String patientName, LocalDate date) {
        Long doctorId = Long.parseLong(SecurityUtils.getCurrentUser().id());
        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                        doctorId, patientName, date.atStartOfDay(), date.atTime(LocalTime.MAX));
        return ResponseEntity.ok(Map.of("appointments", appointments));
    }

    public ResponseEntity<Map<String, Object>> getAppointmentsByDate(LocalDate date) {
        Long doctorId = Long.parseLong(SecurityUtils.getCurrentUser().id());
        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdAndAppointmentTimeBetween(
                        doctorId, date.atStartOfDay(), date.atTime(LocalTime.MAX));
        return ResponseEntity.ok(Map.of("appointments", appointments));
    }

    public ResponseEntity<Map<String, Object>> getAppointmentsByPatientName(String patientName) {
        Long doctorId = Long.parseLong(SecurityUtils.getCurrentUser().id());
        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdAndPatient_NameContainingIgnoreCase(doctorId, patientName);
        return ResponseEntity.ok(Map.of("appointments", appointments));
    }

    public ResponseEntity<Map<String, Object>> getAppointmentsByDoctor() {
        Long doctorId = Long.parseLong(SecurityUtils.getCurrentUser().id());
        return ResponseEntity.ok(Map.of("appointments", appointmentRepository.findByDoctorId(doctorId)));
    }

    public ResponseEntity<Map<String, Object>> getAllAppointments() {
        return ResponseEntity.ok(Map.of("appointments", appointmentRepository.findAll()));
    }

    private boolean isSlotAvailable(Doctor doctor, LocalDateTime appointmentTime) {
        LocalDateTime start = appointmentTime.toLocalDate().atStartOfDay();
        LocalDateTime end = appointmentTime.toLocalDate().atTime(LocalTime.MAX);

        List<String> booked = appointmentRepository
                .findByDoctorIdAndAppointmentTimeBetween(doctor.getId(), start, end)
                .stream()
                .map(a -> a.getAppointmentTime().toLocalTime().toString())
                .toList();

        List<String> available = new ArrayList<>(doctor.getAvailableTimes());
        available.removeAll(booked);

        String requestedTime = appointmentTime.toLocalTime().toString();
        return available.stream().anyMatch(slot -> requestedTime.startsWith(slot.split("-")[0]));
    }

    private boolean isValidAppointment(Appointment appointment) {
        return appointment.getDoctor() != null
                && appointment.getPatient() != null
                && appointment.getAppointmentTime() != null;
    }
}
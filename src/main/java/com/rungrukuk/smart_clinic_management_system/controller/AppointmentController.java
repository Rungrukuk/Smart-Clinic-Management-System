package com.rungrukuk.smart_clinic_management_system.controller;

import com.rungrukuk.smart_clinic_management_system.dto.AppointmentDTO;
import com.rungrukuk.smart_clinic_management_system.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT')")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable long id) {
        return appointmentService.getAppointmentById(id);
    }

    @GetMapping("/{date}/{patientName}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Object>> getAppointments(
            @PathVariable String date,
            @PathVariable String patientName) {
        return appointmentService.getAppointment(patientName, LocalDate.parse(date));
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Object>> getByDate(@PathVariable String date) {
        return appointmentService.getAppointmentsByDate(LocalDate.parse(date));
    }

    @GetMapping("/patient/{patientName}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Object>> getByPatient(@PathVariable String patientName) {
        return appointmentService.getAppointmentsByPatientName(patientName);
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<Map<String, Object>> getByDoctor() {
        return appointmentService.getAppointmentsByDoctor();
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> bookAppointment(@RequestBody AppointmentDTO appointment) {
        return appointmentService.bookAppointment(appointment);
    }

    @PutMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> updateAppointment(@RequestBody AppointmentDTO appointment) {
        return appointmentService.updateAppointment(appointment);
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> cancelAppointment(@PathVariable long id) {
        return appointmentService.cancelAppointment(id);
    }
}
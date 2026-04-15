package com.rungrukuk.smart_clinic_management_system.controller;

import com.rungrukuk.smart_clinic_management_system.domain.Patient;
import com.rungrukuk.smart_clinic_management_system.dto.LoginDTO;
import com.rungrukuk.smart_clinic_management_system.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "patient")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> getPatientDetails() {
        return patientService.getPatientDetails();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO login) {
        return patientService.login(login);
    }

    @GetMapping("/appointments/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> getPatientAppointments(@PathVariable Long id) {
        return patientService.getPatientAppointment(id);
    }

    @GetMapping("/filter/{condition}/{name}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> filterAppointments(
            @PathVariable String condition,
            @PathVariable String name) {
        return patientService.filterAppointments(condition, name);
    }
}
package com.rungrukuk.smart_clinic_management_system.controller;

import com.rungrukuk.smart_clinic_management_system.domain.Admin;
import com.rungrukuk.smart_clinic_management_system.service.AdminService;
import com.rungrukuk.smart_clinic_management_system.service.AppointmentService;
import com.rungrukuk.smart_clinic_management_system.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Admin admin) {
        return adminService.login(admin);
    }

    @GetMapping("/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
}
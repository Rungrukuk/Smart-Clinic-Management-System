package com.rungrukuk.smart_clinic_management_system.controller;

import com.rungrukuk.smart_clinic_management_system.domain.Prescription;
import com.rungrukuk.smart_clinic_management_system.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "prescription")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Object>> savePrescription(@RequestBody Prescription prescription) {
        return prescriptionService.savePrescription(prescription);
    }

    @GetMapping("/{appointmentId}")
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT')")
    public ResponseEntity<Map<String, Object>> getPrescription(@PathVariable Long appointmentId) {
        return prescriptionService.getPrescription(appointmentId);
    }
}
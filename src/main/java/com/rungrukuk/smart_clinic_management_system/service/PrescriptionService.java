package com.rungrukuk.smart_clinic_management_system.service;

import com.rungrukuk.smart_clinic_management_system.domain.Prescription;
import com.rungrukuk.smart_clinic_management_system.repository.PrescriptionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public ResponseEntity<Map<String, Object>> savePrescription(Prescription prescription) {

        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Prescription> existing = prescriptionRepository
                    .findByAppointmentId(prescription.getAppointmentId());

            Prescription entity;

            if (existing.isPresent()) {
                entity = existing.get();
                entity.setMedication(prescription.getMedication());
                entity.setDosage(prescription.getDosage());
                entity.setDoctorNotes(prescription.getDoctorNotes());
                entity.setPatientName(prescription.getPatientName());
            } else {
                entity = prescription;
            }

            prescriptionRepository.save(entity);

            response.put("message", "Prescription saved");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public ResponseEntity<Map<String, Object>> getPrescription(Long appointmentId) {

        Map<String, Object> response = new HashMap<>();

        try {
            Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId).orElse(null);

            if (prescription == null) {
                response.put("message", "No prescription found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("prescription", prescription);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}

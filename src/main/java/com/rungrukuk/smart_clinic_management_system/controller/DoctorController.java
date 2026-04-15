package com.rungrukuk.smart_clinic_management_system.controller;

import com.rungrukuk.smart_clinic_management_system.domain.Doctor;
import com.rungrukuk.smart_clinic_management_system.dto.LoginDTO;
import com.rungrukuk.smart_clinic_management_system.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "doctor")
public class DoctorController {

        @Autowired
        private DoctorService doctorService;

        @GetMapping("/availability/{doctorId}/{date}")
        @PreAuthorize("hasAnyRole('DOCTOR','PATIENT')")
        public ResponseEntity<Map<String, Object>> getDoctorAvailability(
                        @PathVariable Long doctorId,
                        @PathVariable String date) {
                return doctorService.availabilityResponse(doctorId, LocalDate.parse(date));
        }

        @GetMapping
        public ResponseEntity<Map<String, Object>> getDoctors() {
                return doctorService.getDoctorsResponse();
        }

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Map<String, Object>> addDoctor(@RequestBody Doctor doctor) {
                return doctorService.addDoctor(doctor);
        }

        @PostMapping("/login")
        public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO login) {
                return doctorService.login(login);
        }

        @PutMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Map<String, Object>> updateDoctor(@RequestBody Doctor doctor) {
                return doctorService.updateDoctor(doctor);
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Map<String, Object>> deleteDoctor(@PathVariable long id) {
                return doctorService.deleteDoctor(id);
        }

        @GetMapping("/filter/{name}")
        public ResponseEntity<Map<String, Object>> filterDoctors(
                        @PathVariable String name) {
                return doctorService.filterDoctors(name);
        }
}
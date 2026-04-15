package com.rungrukuk.smart_clinic_management_system.controller;

import com.rungrukuk.smart_clinic_management_system.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.path}" + "report")
public class ReportController {

        @Autowired
        private ReportService reportService;

        @GetMapping("/daily")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<Object[]>> getDailyReport(@RequestParam String date) {
                return ResponseEntity.ok(reportService.getDailyAppointmentReport(date));
        }

        @GetMapping("/top-doctor/month")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<Object[]>> getTopDoctorByMonth(
                        @RequestParam int month,
                        @RequestParam int year) {
                return ResponseEntity.ok(reportService.getDoctorWithMostPatientsByMonth(month, year));
        }

        @GetMapping("/top-doctor/year")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<Object[]>> getTopDoctorByYear(@RequestParam int year) {
                return ResponseEntity.ok(reportService.getDoctorWithMostPatientsByYear(year));
        }
}
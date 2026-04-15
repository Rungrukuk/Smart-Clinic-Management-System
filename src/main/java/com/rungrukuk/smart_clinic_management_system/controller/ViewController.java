package com.rungrukuk.smart_clinic_management_system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/admin/adminDashboard")
    public String adminDashboard() {
        return "admin/adminDashboard";
    }

    @GetMapping("/doctor/doctorDashboard")
    public String doctorDashboard() {
        return "doctor/doctorDashboard";
    }
}
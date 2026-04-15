package com.rungrukuk.smart_clinic_management_system.service;

import com.rungrukuk.smart_clinic_management_system.domain.Admin;
import com.rungrukuk.smart_clinic_management_system.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private TokenService tokenService;

    public ResponseEntity<Map<String, Object>> login(Admin receivedAdmin) {
        Optional<Admin> admin = adminRepository.findByUsername(receivedAdmin.getUsername());

        if (admin.isEmpty() || !admin.get().getPassword().equals(receivedAdmin.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        String token = tokenService.generateToken(
                admin.get().getUsername(),
                "ADMIN",
                admin.get().getUsername());

        return ResponseEntity.ok(Map.of("token", token, "message", "Login successful"));
    }
}
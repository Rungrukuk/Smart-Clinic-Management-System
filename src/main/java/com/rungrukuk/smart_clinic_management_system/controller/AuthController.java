package com.rungrukuk.smart_clinic_management_system.controller;

import com.rungrukuk.smart_clinic_management_system.security.UserInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me() {

        UserInfo user = (UserInfo) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(Map.of(
                "id", user.id(),
                "name", user.name(),
                "role", user.role()));
    }

}
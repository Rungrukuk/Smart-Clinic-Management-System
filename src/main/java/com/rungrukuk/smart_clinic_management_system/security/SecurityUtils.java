package com.rungrukuk.smart_clinic_management_system.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static UserInfo getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("Unauthenticated");
        }

        return (UserInfo) auth.getPrincipal();
    }
}

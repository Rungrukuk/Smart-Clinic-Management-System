package com.rungrukuk.smart_clinic_management_system.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public class CustomAuthentication extends AbstractAuthenticationToken {

    private final UserInfo principal;

    public CustomAuthentication(UserInfo userInfo) {
        super(List.of(new SimpleGrantedAuthority("ROLE_" + userInfo.role())));
        this.principal = userInfo;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }
}

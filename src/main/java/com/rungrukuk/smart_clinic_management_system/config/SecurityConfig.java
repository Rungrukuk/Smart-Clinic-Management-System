package com.rungrukuk.smart_clinic_management_system.config;

import com.rungrukuk.smart_clinic_management_system.security.JwtAuthFilter;
import com.rungrukuk.smart_clinic_management_system.service.TokenService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http, TokenService tokenService) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(sm -> sm.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .anyRequest().permitAll())
                                .addFilterBefore(new JwtAuthFilter(tokenService),
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}

package com.rungrukuk.smart_clinic_management_system.repository;

import com.rungrukuk.smart_clinic_management_system.domain.Patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Patient findByEmail(String email);

    Patient findByEmailOrPhone(String email, String phone);
}

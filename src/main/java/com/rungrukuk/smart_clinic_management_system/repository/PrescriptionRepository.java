package com.rungrukuk.smart_clinic_management_system.repository;

import com.rungrukuk.smart_clinic_management_system.domain.Prescription;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {

    Optional<Prescription> findByAppointmentId(Long appointmentId);
}

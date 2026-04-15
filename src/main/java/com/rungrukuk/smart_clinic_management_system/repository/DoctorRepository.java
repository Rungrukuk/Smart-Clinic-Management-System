package com.rungrukuk.smart_clinic_management_system.repository;

import com.rungrukuk.smart_clinic_management_system.domain.Doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

        Doctor findByEmail(String email);

        @Query("SELECT d FROM Doctor d " +
                        "WHERE d.name LIKE CONCAT('%', :name, '%')")
        List<Doctor> findByNameLike(@Param("name") String name);

        List<Doctor> findBySpecialtyIgnoreCase(String specialty);

        @Query("SELECT DISTINCT d FROM Doctor d " +
                        "JOIN d.availableTimes t " +
                        "WHERE LOWER(d.specialty) = LOWER(:specialty) " +
                        "AND t LIKE CONCAT(:time, '%')")
        List<Doctor> findBySpecialtyAndTime(
                        @Param("specialty") String specialty,
                        @Param("time") String time);

}

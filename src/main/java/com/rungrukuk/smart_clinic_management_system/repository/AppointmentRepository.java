package com.rungrukuk.smart_clinic_management_system.repository;

import com.rungrukuk.smart_clinic_management_system.domain.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        @Query("SELECT a FROM Appointment a " +
                        "LEFT JOIN FETCH a.doctor d " +
                        "WHERE d.id = :doctorId " +
                        "AND a.appointmentTime BETWEEN :start AND :end")
        List<Appointment> findByDoctorIdAndAppointmentTimeBetween(
                        @Param("doctorId") Long doctorId,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);

        @Query("SELECT a FROM Appointment a " +
                        "LEFT JOIN FETCH a.doctor d " +
                        "LEFT JOIN FETCH a.patient p " +
                        "WHERE d.id = :doctorId " +
                        "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :patientName, '%')) " +
                        "AND a.appointmentTime BETWEEN :start AND :end")
        List<Appointment> findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                        @Param("doctorId") Long doctorId,
                        @Param("patientName") String patientName,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);

        @Query("SELECT a FROM Appointment a " +
                        "LEFT JOIN FETCH a.doctor d " +
                        "LEFT JOIN FETCH a.patient p " +
                        "WHERE d.id = :doctorId " +
                        "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :patientName, '%')) ")
        List<Appointment> findByDoctorIdAndPatient_NameContainingIgnoreCase(
                        @Param("doctorId") Long doctorId,
                        @Param("patientName") String patientName);

        @Modifying
        @Transactional
        @Query("DELETE FROM Appointment a WHERE a.doctor.id = :doctorId")
        void deleteAllByDoctorId(@Param("doctorId") Long doctorId);

        List<Appointment> findByPatientId(Long patientId);

        List<Appointment> findByDoctorId(Long doctorId);

        List<Appointment> findByPatient_IdAndStatusOrderByAppointmentTimeAsc(
                        Long patientId,
                        int status);

        @Query("SELECT a FROM Appointment a " +
                        "WHERE a.patient.id = :patientId " +
                        "AND LOWER(a.doctor.name) LIKE LOWER(CONCAT('%', :doctorName, '%'))")
        List<Appointment> filterByDoctorNameAndPatientId(
                        @Param("doctorName") String doctorName,
                        @Param("patientId") Long patientId);

        @Query("SELECT a FROM Appointment a " +
                        "WHERE a.patient.id = :patientId " +
                        "AND LOWER(a.doctor.name) LIKE LOWER(CONCAT('%', :doctorName, '%')) " +
                        "AND a.status = :status")
        List<Appointment> filterByDoctorNameAndPatientIdAndStatus(
                        @Param("doctorName") String doctorName,
                        @Param("patientId") Long patientId,
                        @Param("status") int status);
}

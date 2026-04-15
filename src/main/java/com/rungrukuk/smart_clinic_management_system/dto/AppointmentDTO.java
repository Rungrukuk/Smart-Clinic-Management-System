package com.rungrukuk.smart_clinic_management_system.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.rungrukuk.smart_clinic_management_system.domain.Appointment;

public class AppointmentDTO {

    private Long id;
    private Long doctorId;
    private String doctorName;
    private String doctorSpeciality;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private String patientAddress;
    private LocalDateTime appointmentTime;
    private Integer status;

    private LocalDate appointmentDate;
    private LocalTime appointmentTimeOnly;
    private LocalDateTime endTime;

    public AppointmentDTO() {
    }

    public AppointmentDTO(Appointment appointment) {
        this.id = appointment.getId();

        if (appointment.getDoctor() != null) {
            this.doctorId = appointment.getDoctor().getId();
            this.doctorName = appointment.getDoctor().getName();
            this.doctorSpeciality = appointment.getDoctor().getSpecialty();
        }

        if (appointment.getPatient() != null) {
            this.patientId = appointment.getPatient().getId();
            this.patientName = appointment.getPatient().getName();
            this.patientEmail = appointment.getPatient().getEmail();
            this.patientPhone = appointment.getPatient().getPhone();
            this.patientAddress = appointment.getPatient().getAddress();
        }

        this.appointmentTime = appointment.getAppointmentTime();
        this.status = appointment.getStatus();

        if (appointment.getAppointmentTime() != null) {
            this.appointmentDate = appointment.getAppointmentTime().toLocalDate();
            this.appointmentTimeOnly = appointment.getAppointmentTime().toLocalTime();
            this.endTime = appointment.getAppointmentTime().plusHours(1);
        }
    }

    public AppointmentDTO(
            Long id,
            Long doctorId,
            String doctorName,
            String doctorSpecialty,
            Long patientId,
            String patientName,
            String patientEmail,
            String patientPhone,
            String patientAddress,
            LocalDateTime appointmentTime,
            int status) {

        this.id = id;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.patientId = patientId;
        this.doctorSpeciality = doctorSpecialty;
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.patientPhone = patientPhone;
        this.patientAddress = patientAddress;
        this.appointmentTime = appointmentTime;
        this.status = status;

        this.appointmentDate = appointmentTime.toLocalDate();
        this.appointmentTimeOnly = appointmentTime.toLocalTime();
        this.endTime = appointmentTime.plusHours(1);
    }

    public Long getId() {
        return id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public Long getPatientId() {
        return patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public String getPatientAddress() {
        return patientAddress;
    }

    public String getDoctorSpeciality() {
        return doctorSpeciality;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public Integer getStatus() {
        return status;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public LocalTime getAppointmentTimeOnly() {
        return appointmentTimeOnly;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public void setDoctorSpeciality(String doctorSpeciality) {
        this.doctorSpeciality = doctorSpeciality;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public void setPatientAddress(String patientAddress) {
        this.patientAddress = patientAddress;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public void setStatus(int status) {
        this.status = status;
    }

}
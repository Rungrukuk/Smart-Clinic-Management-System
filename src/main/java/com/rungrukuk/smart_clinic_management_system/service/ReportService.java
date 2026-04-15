package com.rungrukuk.smart_clinic_management_system.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private EntityManager entityManager;

    @SuppressWarnings("unchecked")
    public List<Object[]> getDailyAppointmentReport(String date) {
        Query query = entityManager.createNativeQuery(
                "CALL GetDailyAppointmentReportByDoctor(:date)");
        query.setParameter("date", date);
        return query.getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> getDoctorWithMostPatientsByMonth(int month, int year) {
        Query query = entityManager.createNativeQuery(
                "CALL GetDoctorWithMostPatientsByMonth(:month, :year)");
        query.setParameter("month", month);
        query.setParameter("year", year);
        return query.getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> getDoctorWithMostPatientsByYear(int year) {
        Query query = entityManager.createNativeQuery(
                "CALL GetDoctorWithMostPatientsByYear(:year)");
        query.setParameter("year", year);
        return query.getResultList();
    }
}
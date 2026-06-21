package com.bloodlink.donation.repository;

import com.bloodlink.donation.entity.AppointmentStatus;
import com.bloodlink.donation.entity.DonationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DonationAppointmentRepository extends JpaRepository<DonationAppointment, UUID> {
    
    List<DonationAppointment> findByDonorId(UUID donorId);
    
    List<DonationAppointment> findByHospitalId(UUID hospitalId);
    
    List<DonationAppointment> findByStatus(AppointmentStatus status);
    
    List<DonationAppointment> findByDonorIdAndStatus(UUID donorId, AppointmentStatus status);
    
    List<DonationAppointment> findByHospitalIdAndStatus(UUID hospitalId, AppointmentStatus status);
    
    @Query("SELECT a FROM DonationAppointment a WHERE a.donorId = :donorId AND a.appointmentDate BETWEEN :startDate AND :endDate")
    List<DonationAppointment> findAppointmentsByDonorAndDateRange(
        @Param("donorId") UUID donorId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT a FROM DonationAppointment a WHERE a.hospitalId = :hospitalId AND a.appointmentDate >= :today ORDER BY a.appointmentDate ASC")
    List<DonationAppointment> findUpcomingAppointmentsByHospital(
        @Param("hospitalId") UUID hospitalId,
        @Param("today") LocalDateTime today
    );
}

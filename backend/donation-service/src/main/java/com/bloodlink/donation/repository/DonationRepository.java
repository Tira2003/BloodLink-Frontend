package com.bloodlink.donation.repository;

import com.bloodlink.donation.entity.Donation;
import com.bloodlink.donation.entity.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DonationRepository extends JpaRepository<Donation, UUID> {
    
    List<Donation> findByDonorId(UUID donorId);
    
    List<Donation> findByHospitalId(UUID hospitalId);
    
    List<Donation> findByStatus(DonationStatus status);
    
    List<Donation> findByDonorIdAndStatus(UUID donorId, DonationStatus status);
    
    List<Donation> findByHospitalIdAndStatus(UUID hospitalId, DonationStatus status);
    
    @Query("SELECT d FROM Donation d WHERE d.donorId = :donorId AND d.donationDate BETWEEN :startDate AND :endDate")
    List<Donation> findDonationsByDonorAndDateRange(
        @Param("donorId") UUID donorId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT COUNT(d) FROM Donation d WHERE d.donorId = :donorId AND d.status = 'COMPLETED'")
    long countCompletedDonationsByDonor(@Param("donorId") UUID donorId);
    
    @Query("SELECT d FROM Donation d WHERE d.hospitalId = :hospitalId AND d.status = :status ORDER BY d.donationDate DESC")
    List<Donation> findByHospitalIdAndStatusOrderByDate(
        @Param("hospitalId") UUID hospitalId,
        @Param("status") DonationStatus status
    );
}

package com.bloodlink.inventory.repository;

import com.bloodlink.inventory.entity.BloodUnit;
import com.bloodlink.inventory.entity.BloodUnitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BloodUnitRepository extends JpaRepository<BloodUnit, UUID> {
    
    List<BloodUnit> findByDonationId(UUID donationId);
    
    List<BloodUnit> findByHospitalId(UUID hospitalId);
    
    List<BloodUnit> findByStatus(BloodUnitStatus status);
    
    List<BloodUnit> findByHospitalIdAndStatus(UUID hospitalId, BloodUnitStatus status);
    
    List<BloodUnit> findByHospitalIdAndBloodType(UUID hospitalId, String bloodType);
    
    List<BloodUnit> findByHospitalIdAndBloodTypeAndStatus(UUID hospitalId, String bloodType, BloodUnitStatus status);
    
    @Query("SELECT b FROM BloodUnit b WHERE b.hospitalId = :hospitalId AND b.status = 'AVAILABLE' AND b.expiryDate > :today ORDER BY b.expiryDate ASC")
    List<BloodUnit> findAvailableUnits(
        @Param("hospitalId") UUID hospitalId,
        @Param("today") LocalDateTime today
    );
    
    @Query("SELECT b FROM BloodUnit b WHERE b.expiryDate < :expiryDate AND b.status != 'EXPIRED'")
    List<BloodUnit> findExpiringUnits(@Param("expiryDate") LocalDateTime expiryDate);
    
    @Query("SELECT COUNT(b) FROM BloodUnit b WHERE b.hospitalId = :hospitalId AND b.bloodType = :bloodType AND b.status = 'AVAILABLE'")
    long countAvailableByHospitalAndBloodType(
        @Param("hospitalId") UUID hospitalId,
        @Param("bloodType") String bloodType
    );
}

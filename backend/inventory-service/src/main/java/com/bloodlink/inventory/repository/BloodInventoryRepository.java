package com.bloodlink.inventory.repository;

import com.bloodlink.inventory.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, UUID> {
    
    List<BloodInventory> findByHospitalId(UUID hospitalId);
    
    Optional<BloodInventory> findByHospitalIdAndBloodType(UUID hospitalId, String bloodType);
    
    List<BloodInventory> findByHospitalIdAndBloodType(UUID hospitalId, String bloodType);
    
    @Query("SELECT b FROM BloodInventory b WHERE b.hospitalId = :hospitalId AND b.quantityMl < b.minimumThreshold")
    List<BloodInventory> findLowStockByHospital(@Param("hospitalId") UUID hospitalId);
    
    @Query("SELECT b FROM BloodInventory b WHERE b.expiryDate < :expiryDate AND b.quantityMl > 0")
    List<BloodInventory> findExpiredInventory(@Param("expiryDate") LocalDateTime expiryDate);
    
    @Query("SELECT SUM(b.quantityMl) FROM BloodInventory b WHERE b.hospitalId = :hospitalId AND b.bloodType = :bloodType")
    Integer getTotalQuantityByHospitalAndBloodType(
        @Param("hospitalId") UUID hospitalId,
        @Param("bloodType") String bloodType
    );
}

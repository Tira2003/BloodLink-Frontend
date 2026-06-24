package com.bloodlink.core.repository;

import com.bloodlink.core.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DonorRepository extends JpaRepository<Donor, UUID> {
    Optional<Donor> findByUserId(UUID userId);

    @Query("SELECT d FROM Donor d WHERE d.bloodType = :bloodType AND d.isActive = true ORDER BY RANDOM() LIMIT :limit")
    List<Donor> findAvailableDonorsByBloodType(@Param("bloodType") Donor.BloodType bloodType, @Param("limit") int limit);

    @Query("SELECT d FROM Donor d WHERE d.bloodType = :bloodType AND d.isActive = true")
    List<Donor> findAllByBloodType(@Param("bloodType") Donor.BloodType bloodType);

    List<Donor> findByIsActiveTrue();
}

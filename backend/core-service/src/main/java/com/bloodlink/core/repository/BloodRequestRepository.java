package com.bloodlink.core.repository;

import com.bloodlink.core.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, UUID> {
    @Query("SELECT br FROM BloodRequest br WHERE br.status = 'ACTIVE' ORDER BY br.createdAt DESC")
    List<BloodRequest> findActiveRequests();

    @Query("SELECT br FROM BloodRequest br WHERE br.bloodType = :bloodType AND br.status = 'ACTIVE' ORDER BY br.createdAt DESC")
    List<BloodRequest> findActiveRequestsByBloodType(@Param("bloodType") String bloodType);

    @Query("SELECT br FROM BloodRequest br WHERE br.district = :district AND br.status = 'ACTIVE' ORDER BY br.createdAt DESC")
    List<BloodRequest> findActiveRequestsByDistrict(@Param("district") String district);

    List<BloodRequest> findByUserId(UUID userId);
}

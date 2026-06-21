package com.bloodlink.user.repository;

import com.bloodlink.user.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, UUID> {
    Optional<Hospital> findByUserId(UUID userId);
    List<Hospital> findByIsVerifiedTrue();
    List<Hospital> findByCity(String city);
    Optional<Hospital> findByLicenseNumber(String licenseNumber);
}

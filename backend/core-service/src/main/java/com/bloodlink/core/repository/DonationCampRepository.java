package com.bloodlink.core.repository;

import com.bloodlink.core.model.DonationCamp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationCampRepository extends JpaRepository<DonationCamp, UUID> {
    List<DonationCamp> findByDistrict(String district);
    List<DonationCamp> findByIsActiveTrue();
    List<DonationCamp> findByOrganizerId(UUID organizerId);
}
